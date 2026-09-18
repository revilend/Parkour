// Copyright (c) SPIRE-LINE Interactive.

#include "SpirelineTraversalProbe.h"

#include "DrawDebugHelpers.h"
#include "PhysicalMaterials/PhysicalMaterial.h"
#include "SpirelineMovementTuning.h"

void USpirelineTraversalProbe::Initialize(UWorld* InWorld, const USpirelineMovementTuning* InTuning, ECollisionChannel InTraversalChannel)
{
	World = InWorld;
	Tuning = InTuning;
	TraversalChannel = InTraversalChannel;

	if (!Tuning)
	{
		UE_LOG(LogTemp, Error, TEXT("[Spireline] TraversalProbe: Tuning DataAsset berilmagan — standart qiymatlar ishlatiladi."));
	}
}

// ============================================================================
//  SCAN — bir kadrlik to'liq skan
// ============================================================================
FTraversalProbeResult USpirelineTraversalProbe::Scan(const AActor* IgnoredActor,
                                                     const FVector& Location,
                                                     const FVector& Velocity,
                                                     const FVector& Forward,
                                                     float DeltaTime)
{
	return ScanSingle(IgnoredActor, Location, Velocity, Forward, ESpireProbeMask::All);
}

FTraversalProbeResult USpirelineTraversalProbe::ScanSingle(const AActor* IgnoredActor,
                                                           const FVector& Location,
                                                           const FVector& Velocity,
                                                           const FVector& Forward,
                                                           ESpireProbeMask Mask)
{
	FTraversalProbeResult Result;
	LastScanMs = 0.f;

	const double StartTime = FPlatformTime::Seconds();

	// Eslatma: probe'lar arzon → qimmat tartibida bajariladi. Agar zamin
	// topilsa, devor/vault/qirra probelari umuman kerak emas (erta chiqish,
	// GDD 5.2 "Optimizatsiya qoidalari" — ~60% tejash).
	const bool bNeedAirProbes =
		EnumHasAnyFlags(Mask, ESpireProbeMask::Walls | ESpireProbeMask::Obstacle | ESpireProbeMask::Ledge);

	if (EnumHasAnyFlags(Mask, ESpireProbeMask::Ground))
	{
		ProbeGround(IgnoredActor, Location, Result);
	}

	// Tepadan pastga qarab harakatlanmayotgan bo'lsa, havo probe'lari kerak.
	const bool bWantsAir = bNeedAirProbes && (!Result.bGrounded || Velocity.Z > 0.f);

	if (bWantsAir && EnumHasAnyFlags(Mask, ESpireProbeMask::Walls))
	{
		ProbeWalls(IgnoredActor, Location, Forward, Result);
	}

	if (EnumHasAnyFlags(Mask, ESpireProbeMask::Step) && Result.bGrounded)
	{
		ProbeStep(IgnoredActor, Location, Forward, Result);
	}

	if (bWantsAir && EnumHasAnyFlags(Mask, ESpireProbeMask::Obstacle))
	{
		ProbeObstacle(IgnoredActor, Location, Forward, Result);
	}

	if (bWantsAir && EnumHasAnyFlags(Mask, ESpireProbeMask::Ledge))
	{
		ProbeLedge(IgnoredActor, Location, Forward, Result);
	}

	if (EnumHasAnyFlags(Mask, ESpireProbeMask::Landing) && Velocity.Z < 0.f)
	{
		ProbeLanding(IgnoredActor, Location, Velocity, Result);
	}

	LastScanMs = static_cast<float>((FPlatformTime::Seconds() - StartTime) * 1000.0);
	return Result;
}

// ============================================================================
//  1. ZAMIN — kapsula sweep pastga (0.35 m)
// ============================================================================
bool USpirelineTraversalProbe::ProbeGround(const AActor* IgnoredActor, const FVector& Location, FTraversalProbeResult& Out) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return false;
	}

	const FCollisionShape Capsule = FCollisionShape::MakeCapsule(Tuning->CapsuleRadius, Tuning->CapsuleHalfHeight);

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineGroundProbe), /*bTraceComplex=*/false, IgnoredActor);

	FHitResult Hit;
	const FVector Start = Location;
	const FVector End = Location - FVector(0.f, 0.f, 35.f); // 0.35 m pastga

	if (!W->SweepSingleByChannel(Hit, Start, End, FQuat::Identity, TraversalChannel, Capsule, Params))
	{
		return false;
	}

	// Yurish mumkin qiyalik: pol normali bilan yuqori vektor orasidagi burchak.
	const float SlopeDeg = FMath::RadiansToDegrees(FMath::Acos(FMath::Clamp(Hit.Normal.Z, -1.f, 1.f)));

	Out.GroundNormal = Hit.Normal;
	Out.GroundSlopeDeg = SlopeDeg;
	Out.GroundDistance = Hit.Distance;
	Out.bGrounded = SlopeDeg <= Tuning->WalkableFloorAngleDeg;

	ApplySurface(Hit, Out);
	return Out.bGrounded;
}

// ============================================================================
//  2. QADAM — tizza balandligidagi nur (avtomatik step-up)
// ============================================================================
bool USpirelineTraversalProbe::ProbeStep(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return false;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineStepProbe), false, IgnoredActor);

	// Tizza balandligi = kapsula yarim bo'yining ~52% i (86 sm -> 45 sm).
	const FVector From = Location - FVector(0.f, 0.f, Tuning->CapsuleHalfHeight - Tuning->StepOffset);
	const FVector To = From + Forward * 55.f; // 0.55 m

	FHitResult Hit;
	if (!W->LineTraceSingleByChannel(Hit, From, To, TraversalChannel, Params))
	{
		return false;
	}

	// To'siqning ustki sathini topamiz: tepadan pastga qisqa sweep.
	FCollisionShape ProbeBox = FCollisionShape::MakeBox(FVector(12.f, 12.f, 6.f));
	const FVector TopFrom = FVector(Hit.ImpactPoint.X, Hit.ImpactPoint.Y, Location.Z + Tuning->StepOffset + 10.f);
	const FVector TopTo = TopFrom - FVector(0.f, 0.f, Tuning->StepOffset + 20.f);

	FHitResult TopHit;
	if (W->SweepSingleByChannel(TopHit, TopFrom, TopTo, FQuat::Identity, TraversalChannel, ProbeBox, Params))
	{
		const float Step = TopHit.ImpactPoint.Z - (Location.Z - Tuning->CapsuleHalfHeight);
		if (Step > 0.f && Step <= Tuning->StepOffset)
		{
			Out.bStepUp = true;
			Out.StepHeight = Step;
			return true;
		}
	}
	return false;
}

// ============================================================================
//  3. DEVORLAR — chap/o'ng, 3 balandlikda
// ============================================================================
bool USpirelineTraversalProbe::ProbeWalls(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return false;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineWallProbe), false, IgnoredActor);

	const FVector Right = FVector::CrossProduct(FVector::UpVector, Forward).GetSafeNormal();

	// Uch balandlik: tizza, ko'krak, bosh (0.5 / 1.1 / 1.6 m).
	const float Heights[3] = { 60.f, 115.f, 160.f };

	for (int32 Side = 0; Side < 2; ++Side)
	{
		const FVector SideDir = (Side == 0) ? -Right : Right;

		FVector AccumNormal = FVector::ZeroVector;
		int32 HitCount = 0;

		for (const float H : Heights)
		{
			const FVector From = Location + FVector(0.f, 0.f, H - Tuning->CapsuleHalfHeight);
			const FVector To = From + SideDir * Tuning->WallStickDistance;

			FHitResult Hit;
			if (W->LineTraceSingleByChannel(Hit, From, To, TraversalChannel, Params))
			{
				AccumNormal += Hit.Normal;
				++HitCount;
			}
		}

		if (HitCount == 0)
		{
			continue;
		}

		const FVector AvgNormal = (AccumNormal / static_cast<float>(HitCount)).GetSafeNormal();

		// Devorning vertikaldan og'ish burchagi. Tik devor -> 0 gradus.
		const float WallAngleDeg = FMath::RadiansToDegrees(FMath::Acos(FMath::Clamp(FMath::Abs(AvgNormal.Z), -1.f, 1.f)));

		// Devor o'yinchiga qaragan bo'lishi shart: dot(Normal, SideDir) < -WallMinFacingDot.
		// Bu tekshiruvsiz o'yinchi "orqasidagi" devorga yopishib qolardi.
		const float Facing = AvgNormal.Dot(SideDir);
		const bool bUsable = (WallAngleDeg <= Tuning->MaxWallAngleDeg) && (Facing < -Tuning->WallMinFacingDot);

		if (!bUsable)
		{
			continue;
		}

		if (Side == 0)
		{
			Out.bWallLeft = true;
			Out.WallNormalLeft = AvgNormal;
			Out.WallAngleLeftDeg = WallAngleDeg;
		}
		else
		{
			Out.bWallRight = true;
			Out.WallNormalRight = AvgNormal;
			Out.WallAngleRightDeg = WallAngleDeg;
		}
	}

	return Out.bWallLeft || Out.bWallRight;
}

// ============================================================================
//  4. TO'SIQ — box sweep oldinga + balandlikni o'lchash + Clearance
// ============================================================================
bool USpirelineTraversalProbe::ProbeObstacle(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return false;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineObstacleProbe), false, IgnoredActor);

	// Box: kenglik bo'yicha 60 sm, balandlik 100 sm (ko'krak sathida).
	const FCollisionShape Box = FCollisionShape::MakeBox(FVector(30.f, 30.f, 50.f));

	const FVector From = Location - FVector(0.f, 0.f, 10.f);
	const FVector To = From + Forward * 110.f; // 1.10 m

	FHitResult Hit;
	if (!W->SweepSingleByChannel(Hit, From, To, FQuat::Identity, TraversalChannel, Box, Params))
	{
		return false;
	}

	Out.bObstacle = true;
	Out.ObstacleTopPoint = Hit.ImpactPoint;

	// Balandlikni o'lchaymiz — Vault (40..125) yoki LedgeClimb (125..240) qarori.
	// MUHIM: balandlik oyoq sathidan hisoblanadi, mutlaq jahon Z emas.
	const float FootZ = Location.Z - Tuning->CapsuleHalfHeight;
	Out.ObstacleHeight = MeasureObstacleHeight(Hit.ImpactPoint, Forward, FootZ);

	// Clearance: to'siq USTIDA bo'sh joy bormi. Bu bo'lmasa o'yinchi
	// "ko'rinmas devorga" uchadi (GDD 5.2, Antu-Frustration qoidasi).
	Out.bClearanceAbove = TraceClearanceAbove(IgnoredActor, Hit.ImpactPoint, Forward,
	                                          Tuning->VaultClearanceDepth, Tuning->VaultClearanceHeight);

	return true;
}

float USpirelineTraversalProbe::MeasureObstacleHeight(const FVector& ImpactPoint, const FVector& Forward, float FootZ) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return 0.f;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineObstacleHeight));
	const FCollisionShape Probe = FCollisionShape::MakeBox(FVector(10.f, 10.f, 5.f));

	// To'siq yuzasidan biroz oldinda, yuqoridan pastga sweep.
	const FVector From = ImpactPoint + Forward * 15.f + FVector(0.f, 0.f, Tuning->LedgeMaxHeight + 60.f);
	const FVector To = From - FVector(0.f, 0.f, Tuning->LedgeMaxHeight + 120.f);

	FHitResult Hit;
	if (!W->SweepSingleByChannel(Hit, From, To, FQuat::Identity, TraversalChannel, Probe, Params))
	{
		return 0.f;
	}

	// O'YINCHINING OYOQ sathidan nisbiy balandlik (sm).
	return FMath::Max(0.f, Hit.ImpactPoint.Z - FootZ);
}

bool USpirelineTraversalProbe::TraceClearanceAbove(const AActor* IgnoredActor, const FVector& From, const FVector& Forward, float Depth, float Height) const
{
	UWorld* W = World.Get();
	if (!W)
	{
		return false;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineClearanceProbe), false, IgnoredActor);

	// Box balandligi 90 sm, sweep 1.0 m oldinga — to'siq ustidagi "tunnel".
	const FCollisionShape Box = FCollisionShape::MakeBox(FVector(30.f, 30.f, Height * 0.5f));

	const FVector Start = From + FVector(0.f, 0.f, Height * 0.5f);
	const FVector End = Start + Forward * Depth;

	FHitResult Hit;
	// Sweep bo'lmasa => to'siq ustida bo'sh joy bor.
	return !W->SweepSingleByChannel(Hit, Start, End, FQuat::Identity, TraversalChannel, Box, Params);
}

// ============================================================================
//  5. QIRRA — ko'krak va bosh balandligidagi nurlar (Mantle)
// ============================================================================
bool USpirelineTraversalProbe::ProbeLedge(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return false;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineLedgeProbe), false, IgnoredActor);

	// Ko'krak balandligi: kapsula markazidan +34 sm (1.20 m).
	const FVector ChestFrom = Location + FVector(0.f, 0.f, 34.f);
	// Bosh balandligi: +84 sm (1.70 m).
	const FVector HeadFrom = Location + FVector(0.f, 0.f, 84.f);

	const float Reach = 75.f; // 0.75 m

	FHitResult ChestHit;
	const bool bChestBlocked = W->LineTraceSingleByChannel(ChestHit, ChestFrom, ChestFrom + Forward * Reach, TraversalChannel, Params);

	FHitResult HeadHit;
	const bool bHeadBlocked = W->LineTraceSingleByChannel(HeadHit, HeadFrom, HeadFrom + Forward * Reach, TraversalChannel, Params);

	// Qirra sharti: ko'krakda to'siq BOR, boshda to'siq YO'Q.
	// (Ikkalasi ham to'siq bo'lsa — bu devor, LedgeClimb emas, WallRun yoki Fall.)
	if (!bChestBlocked || bHeadBlocked)
	{
		return false;
	}

	// Qirraning ustki sathini topamiz.
	FCollisionShape Probe = FCollisionShape::MakeBox(FVector(10.f, 10.f, 5.f));
	const FVector TopFrom = ChestHit.ImpactPoint + Forward * 12.f + FVector(0.f, 0.f, Tuning->LedgeMaxHeight);
	const FVector TopTo = TopFrom - FVector(0.f, 0.f, Tuning->LedgeMaxHeight + 40.f);

	FHitResult TopHit;
	if (!W->SweepSingleByChannel(TopHit, TopFrom, TopTo, FQuat::Identity, TraversalChannel, Probe, Params))
	{
		return false;
	}

	// Balandlik oyoq sathidan (kapsula pastidan) o'lchanadi.
	const float FootZ = Location.Z - Tuning->CapsuleHalfHeight;
	Out.bLedge = true;
	Out.LedgeTopPoint = TopHit.ImpactPoint;
	Out.LedgeHeight = TopHit.ImpactPoint.Z - FootZ;

	return true;
}

// ============================================================================
//  6. QO'NISH — pastga 3 ta sweep (qo'nish nuqtasi + tushish balandligi)
// ============================================================================
bool USpirelineTraversalProbe::ProbeLanding(const AActor* IgnoredActor, const FVector& Location, const FVector& Velocity, FTraversalProbeResult& Out) const
{
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return false;
	}

	FCollisionQueryParams Params(SCENE_QUERY_STAT(SpirelineLandingProbe), false, IgnoredActor);

	const FCollisionShape Capsule = FCollisionShape::MakeCapsule(Tuning->CapsuleRadius, Tuning->CapsuleHalfHeight);
	const FVector Right = FVector::CrossProduct(FVector::UpVector, Velocity.GetSafeNormal2D()).GetSafeNormal();

	// Uchta lateral namuna: -0.3 / 0 / +0.3 m. Qo'nish zonasi kengroq bo'lsin.
	const float Offsets[3] = { -30.f, 0.f, 30.f };

	float BestDistance = TNumericLimits<float>::Max();

	for (const float Offset : Offsets)
	{
		const FVector Sample = Location + Right * Offset;
		const FVector End = Sample - FVector(0.f, 0.f, Tuning->LedgeMaxHeight + 200.f);

		FHitResult Hit;
		if (W->SweepSingleByChannel(Hit, Sample, End, FQuat::Identity, TraversalChannel, Capsule, Params))
		{
			const float LandingSlope = FMath::RadiansToDegrees(FMath::Acos(FMath::Clamp(Hit.Normal.Z, -1.f, 1.f)));
			if (LandingSlope <= Tuning->WalkableFloorAngleDeg && Hit.Distance < BestDistance)
			{
				BestDistance = Hit.Distance;
				Out.bLandingSurface = true;
				Out.LandingPoint = Hit.ImpactPoint;
				Out.LandingSlopeDeg = LandingSlope;
				ApplySurface(Hit, Out);
			}
		}
	}

	if (!Out.bLandingSurface)
	{
		return false;
	}

	// Tushish balandligi: sakrash cho'qqisidan hisoblangan ballistik balandlik.
	// v^2 / (2g) — joriy vertikal tezlikdan hozirgi balandlik.
	const float G = FMath::Abs(Tuning->GetGravityZ());
	if (G > KINDA_SMALL_NUMBER)
	{
		const float AirborneHeight = (Velocity.Z * Velocity.Z) / (2.f * G);
		Out.LandingFallHeight = AirborneHeight + (Location.Z - Out.LandingPoint.Z);
	}

	return true;
}

// ============================================================================
//  Yordamchi
// ============================================================================
void USpirelineTraversalProbe::ApplySurface(const FHitResult& Hit, FTraversalProbeResult& Out)
{
	// Sirt materiali Foley tizimi uchun (beton / temir / shisha / yog'och, GDD 6.4).
	Out.SurfaceType = Hit.PhysMaterial.IsValid() ? Hit.PhysMaterial->SurfaceType : TEnumAsByte<EPhysicalSurface>(SurfaceType_Default);
}

// ============================================================================
//  DEBUG CHIZMALAR (GDD 8.3 — ranglar jadvali). Shipping'da kompilyatsiya
//  qilinmaydi (GDD 8.7).
// ============================================================================
void USpirelineTraversalProbe::DrawDebug(const FTraversalProbeResult& Result, const FVector& Location, const FVector& Forward) const
{
#if !UE_BUILD_SHIPPING
	UWorld* W = World.Get();
	if (!W || !Tuning)
	{
		return;
	}

	constexpr float Life = -1.f;      // bir kadr
	constexpr uint8 Depth = 0;        // depth test'siz — doim ustida
	constexpr float Thickness = 1.6f;

	const FVector Right = FVector::CrossProduct(FVector::UpVector, Forward).GetSafeNormal();

	// --- Zamin: YASHIL (#3DE07A) ---
	DrawDebugLine(W, Location, Location - FVector(0.f, 0.f, 35.f),
	              Result.bGrounded ? FColor(0x3D, 0xE0, 0x7A) : FColor(0x8B, 0x30, 0x30),
	              false, Life, Depth, Thickness);

	// --- Devorlar: KO'K (#3D9BFF) ---
	if (Result.bWallLeft)
	{
		DrawDebugLine(W, Location + FVector(0.f, 0.f, 34.f), Location + FVector(0.f, 0.f, 34.f) - Right * Tuning->WallStickDistance,
		              FColor(0x3D, 0x9B, 0xFF), false, Life, Depth, Thickness);
	}
	if (Result.bWallRight)
	{
		DrawDebugLine(W, Location + FVector(0.f, 0.f, 34.f), Location + FVector(0.f, 0.f, 34.f) + Right * Tuning->WallStickDistance,
		              FColor(0x3D, 0x9B, 0xFF), false, Life, Depth, Thickness);
	}

	// --- To'siq: TO'Q SARIQ (#FF6A1F) va Clearance: SARIQ (#FFC53D) ---
	if (Result.bObstacle)
	{
		DrawDebugLine(W, Location - FVector(0.f, 0.f, 10.f), Result.ObstacleTopPoint,
		              FColor(0xFF, 0x6A, 0x1F), false, Life, Depth, Thickness);

		DrawDebugBox(W, Result.ObstacleTopPoint + FVector(0.f, 0.f, Tuning->VaultClearanceHeight * 0.5f),
		             FVector(30.f, 30.f, Tuning->VaultClearanceHeight * 0.5f),
		             Result.bClearanceAbove ? FColor(0xFF, 0xC5, 0x3D) : FColor(0xFF, 0x3D, 0x5A),
		             false, Life, Depth, Thickness);

		// Balandlik raqami animatsiyasiz: "spire.hud" L3 da ko'rinadi.
		DrawDebugString(W, Result.ObstacleTopPoint, FString::Printf(TEXT("%.0f sm"), Result.ObstacleHeight),
		                nullptr, FColor::White, Life);
	}

	// --- Qirra (Mantle): MOVIY (#2FE0C4) ---
	if (Result.bLedge)
	{
		DrawDebugLine(W, Location + FVector(0.f, 0.f, 34.f), Result.LedgeTopPoint,
		              FColor(0x2F, 0xE0, 0xC4), false, Life, Depth, Thickness);
		DrawDebugSphere(W, Result.LedgeTopPoint, 8.f, 8, FColor(0x2F, 0xE0, 0xC4), false, Life, Depth);
	}

	// --- Qo'nish: yumshoq / og'ir ---
	if (Result.bLandingSurface)
	{
		const bool bHard = Result.LandingFallHeight >= Tuning->RollMinFallHeight;
		DrawDebugSphere(W, Result.LandingPoint, 12.f, 10, bHard ? FColor(0xFF, 0x3D, 0x5A) : FColor(0x3D, 0xE0, 0x7A),
		                false, Life, Depth);
	}
#endif // !UE_BUILD_SHIPPING
}
