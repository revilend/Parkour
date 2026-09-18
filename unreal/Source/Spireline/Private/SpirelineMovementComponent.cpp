// Copyright (c) SPIRE-LINE Interactive.

#include "SpirelineMovementComponent.h"

#include "Components/CapsuleComponent.h"
#include "GameFramework/Character.h"
#include "SpirelineMovementTuning.h"
#include "SpirelineTraversalProbe.h"

namespace
{
	/** Phys funksiyalari uchun minimal tick (UE'dagi MIN_TICK_TIME analogi). */
	constexpr float MinTickTime = 1e-5f;

	/** "O'rta" qo'nish chegarasi (sm/s): 8 m/s. */
	constexpr float MediumLandVelocity = 800.f;

	/** Devorga yopishib turish kuchi (sm/s). */
	constexpr float WallStickForce = 40.f;
}

// ============================================================================
//  QURILISH
// ============================================================================
USpirelineMovementComponent::USpirelineMovementComponent()
{
	// Gravitatsiya Tuning orqali qo'llanadi — bu yerda 1.0 qolishi SHART.
	GravityScale = 1.0f;

	// Kapsula o'lchamlari Tuning'dan sinxronlanadi (BeginPlay'da).
	bOrientRotationToMovement = false; // FPP — kontroller yo'nalishni boshqaradi
	RotationRate = FRotator(0.f, 720.f, 0.f);

	// Erkin harakat: FPP parkurda "air control" kerak.
	AirControl = 0.35f;
	bCanWalkOffLedges = true;

	// Sirpanish/kvantizatsiya uchun yumshoqroq simulyatsiya.
	MaxSimulationTimeStep = 0.05f;
	MaxSimulationIterations = 3;
}

void USpirelineMovementComponent::BeginPlay()
{
	Super::BeginPlay();

	if (!Tuning)
	{
		UE_LOG(LogTemp, Warning, TEXT("[Spireline] Tuning DataAsset biriktirilmagan — standart qiymatlar ishlaydi. "
		                              "EditAnywhere 'Tuning' maydonini to'ldiring."));
	}

	// Kapsula o'lchamlari (GDD 5.4 / 2.1-jadval).
	if (CharacterOwner)
	{
		if (UCapsuleComponent* Capsule = CharacterOwner->GetCapsuleComponent())
		{
			const float Radius = Tuning ? Tuning->CapsuleRadius : 32.f;
			const float HalfHeight = Tuning ? Tuning->CapsuleHalfHeight : 86.f;
			Capsule->SetCapsuleRadius(Radius);
			Capsule->SetCapsuleHalfHeight(HalfHeight);
		}
	}

	// Skanerni tayyorlash.
	ProbeScanner = NewObject<USpirelineTraversalProbe>(this);
	ProbeScanner->Initialize(GetWorld(), Tuning, TraversalChannel);

	// Tuning qiymatlarini UE'ning o'z maydonlariga ko'chirish.
	if (Tuning)
	{
		GroundFriction = Tuning->GroundFriction;
		MaxWalkSpeed = Tuning->RunSpeed;
		JumpZVelocity = Tuning->JumpVelocity;
	}

	FallStartZ = UpdatedComponent ? UpdatedComponent->GetComponentLocation().Z : 0.f;
}

// ============================================================================
//  TICK — FSM har kadr UE harakatidan OLDIN baholanadi
// ============================================================================
void USpirelineMovementComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	if (ShouldSkipUpdate(DeltaTime) || !UpdatedComponent || !PawnOwner)
	{
		return;
	}

	// Katta delta (tab o'zgartirish, hitch) — tunnel effektining oldini olamiz.
	const float Dt = FMath::Min(DeltaTime, Tuning ? Tuning->MaxFrameDelta : 0.05f);

	// ---- 1) Muhitni skanerlash (GDD 5.2) ----
	if (ProbeScanner)
	{
		const FVector Forward = UpdatedComponent->GetForwardVector();
		Probe = ProbeScanner->Scan(CharacterOwner, UpdatedComponent->GetComponentLocation(), Velocity, Forward, Dt);

		if (bDrawDebugProbes)
		{
			ProbeScanner->DrawDebug(Probe, UpdatedComponent->GetComponentLocation(), Forward);
		}
	}

	// ---- 2) Taymerlar ----
	UpdateTimers(Dt);

	// ---- 3) Qo'nishni qayd qilish (Roll / Hard Landing qarori) ----
	HandleLanding();

	// ---- 4) FSM o'tishi (harakat rejimi shu yerda tanlanadi) ----
	UpdateStateMachine(Dt);

	// ---- 5) Tezlik chegaralari va havo qarshiligi (inersiya) ----
	// SoftCap (kvadratik drag) + HardCap + havo qarshiligi bir joyda.
	ApplySpeedCaps(Dt);
	ApplyAirDrag(Dt);

	// ---- 6) UE harakatni bajaradi ----
	Super::TickComponent(Dt, TickType, ThisTickFunction);

	// Keyingi kadr uchun
	PreviousVelocityZ = Velocity.Z;
	bJustLanded = false;
}

void USpirelineMovementComponent::UpdateTimers(float Dt)
{
	CoyoteTimer = FMath::Max(0.f, CoyoteTimer - Dt);
	JumpBufferTimer = FMath::Max(0.f, JumpBufferTimer - Dt);
	SlideTimer = FMath::Max(0.f, SlideTimer - Dt);
	WallRunTimer = FMath::Max(0.f, WallRunTimer - Dt);
	VaultTimer = FMath::Max(0.f, VaultTimer - Dt);
	LedgeClimbTimer = FMath::Max(0.f, LedgeClimbTimer - Dt);
	RollTimer = FMath::Max(0.f, RollTimer - Dt);
	HardLandLockTimer = FMath::Max(0.f, HardLandLockTimer - Dt);
	WallJumpCooldownTimer = FMath::Max(0.f, WallJumpCooldownTimer - Dt);
	SprintGraceTimer = FMath::Max(0.f, SprintGraceTimer - Dt);
	ApexTimer = FMath::Max(0.f, ApexTimer - Dt);

	// Apex oynasi: vertikal tezlik ishorasi + dan - ga o'zgarganda ochiladi.
	if (PreviousVelocityZ > 0.f && Velocity.Z <= 0.f)
	{
		ApexTimer = Tuning ? Tuning->ApexWindowSeconds : 0.18f;
	}

	UpdateSprintRamp(Dt);
}

// ============================================================================
//  QO'NISH
// ============================================================================
void USpirelineMovementComponent::HandleLanding()
{
	const bool bNowGrounded = IsMovingOnGround();

	if (bNowGrounded && !bJustLanded && PreviousVelocityZ < -1.f)
	{
		// Shu kadrda yerga tegdi.
		bJustLanded = true;
		LandingImpactVelocity = FMath::Abs(PreviousVelocityZ);

		const float CurrentZ = UpdatedComponent->GetComponentLocation().Z;
		LandingFallHeight = FMath::Max(0.f, FallStartZ - CurrentZ);
	}

	if (!bNowGrounded && !IsFalling())
	{
		// Ko'tarilib/sakrab ketdi — tushish balandligini hisoblash boshlanadi.
		FallStartZ = UpdatedComponent->GetComponentLocation().Z;
	}

	if (bJustLanded && Tuning)
	{
		// Hard Landing: O'LIM EMAS, narx (GDD 2.6 — P2 ustuni).
		if (LandingImpactVelocity >= Tuning->HardLandMinImpactVelocity)
		{
			ApplyRetention(Tuning->HardLandRetention);
			HardLandLockTimer = Tuning->HardLandLockTime;
			bJustLanded = false; // Roll endi qutqarmaydi — jarima allaqachon qo'llandi
		}
		else if (LandingImpactVelocity >= MediumLandVelocity)
		{
			ApplyRetention(Tuning->MediumLandRetention);
		}

		// Zamin balandligini yangilaymiz.
		FallStartZ = UpdatedComponent->GetComponentLocation().Z;
	}
}

// ============================================================================
//  FSM O'TISHI
// ============================================================================
void USpirelineMovementComponent::UpdateStateMachine(float Dt)
{
	// Hard Landing lock — P1 ustuni: majburiy pauza 0.9 sekunddan oshmaydi.
	if (HardLandLockTimer > 0.f)
	{
		return;
	}

	// Snag Assist — 0.4 sek harakatsiz qolsa (GDD 2.6, kompensatsiya qoidasi).
	if (GetCurrentSpeed() < 100.f && !IsFalling())
	{
		SnagTimer += Dt;
		if (SnagTimer >= (Tuning ? Tuning->SnagAssistTimeout : 0.4f) && Probe.bLedge)
		{
			SnagTimer = 0.f;
			ExitState(State);
			State = ESpireMovementState::LedgeClimb;
			EnterState(State);
			return;
		}
	}
	else
	{
		SnagTimer = 0.f;
	}

	const ESpireMovementState Best = EvaluateTransitions();
	if (Best != State)
	{
		ExitState(State);
		State = Best;
		EnterState(State);
	}

	TryConsumeJump();
}

ESpireMovementState USpirelineMovementComponent::EvaluateTransitions() const
{
	// ------------------------------------------------------------------
	//  0) "COMMITTED" harakatlar — o'z taymeri tugamaguncha bekor qilinmaydi
	// ------------------------------------------------------------------
	switch (State)
	{
	case ESpireMovementState::Vault:
		if (VaultTimer > 0.f) return ESpireMovementState::Vault;
		break;

	case ESpireMovementState::LedgeClimb:
		if (LedgeClimbTimer > 0.f) return ESpireMovementState::LedgeClimb;
		break;

	case ESpireMovementState::Roll:
		if (RollTimer > 0.f) return ESpireMovementState::Roll;
		break;

	case ESpireMovementState::Slide:
	{
		// Slayd minimal davomiylikdan keyin tugaydi: tugma qo'yib yuborildi,
		// taymer tugadi yoki tezlik yo'qoldi.
		//
		// SlideTimer SlideMaxDuration'dan boshlanadi, shuning uchun u
		// (Max - Min) dan pastga tushganda minimal davomiylik o'tgan bo'ladi.
		const float MinRemaining = Tuning ? (Tuning->SlideMaxDuration - Tuning->SlideMinDuration) : 1.15f;
		const bool bMinDurationPending = SlideTimer > MinRemaining;

		if (bMinDurationPending || (bSlideHeld && SlideTimer > 0.f && GetCurrentSpeed() > 250.f))
		{
			return ESpireMovementState::Slide;
		}
		break;
	}

	case ESpireMovementState::WallRun:
		if (WallRunTimer > 0.f && (Probe.bWallLeft || Probe.bWallRight) && !IsMovingOnGround())
		{
			return ESpireMovementState::WallRun;
		}
		break;

	default:
		break;
	}

	// MUHIM (UE o'ziga xosligi): MOVE_Custom rejimida UE'ning IsMovingOnGround()
	// funksiyasi FALSE qaytaradi (u faqat MOVE_Walking / MOVE_NavWalking'ni
	// "yerda" deb hisoblaydi). Slide / Roll / Vault / LedgeClimb — hammasi
	// MOVE_Custom, lekin ular YERGA BOG'LIQ harakatlar.
	//
	// Buni hisobga olmasak: sirpanish tugagach FSM bir kadr "Fall" ni tanlaydi
	// (sakrab ketgandek) va ExitState yolg'on coyote oynasi ochadi.
	// Shu sabab "yerga bog'liq custom faza"da probe natijasiga tayanamiz —
	// skaner harakat rejimidan qat'i nazar har kadr yangilanadi.
	const bool bGroundedCustomPhase =
		State == ESpireMovementState::Slide ||
		State == ESpireMovementState::Roll ||
		State == ESpireMovementState::Vault ||
		State == ESpireMovementState::LedgeClimb;

	const bool bGrounded = IsMovingOnGround() || (bGroundedCustomPhase && Probe.bGrounded);
	const float Speed = GetCurrentSpeed();
	const FVector Forward = UpdatedComponent ? UpdatedComponent->GetForwardVector() : FVector::ForwardVector;
	const FVector HorizontalVel = FVector(Velocity.X, Velocity.Y, 0.f);
	const float ForwardDot = HorizontalVel.GetSafeNormal().Dot(Forward);

	// ------------------------------------------------------------------
	//  PRIORITY 60 — ROLL (xavfsiz qo'nishning yagona yo'li)
	// ------------------------------------------------------------------
	if (bJustLanded && Tuning && bGrounded)
	{
		const bool bFastEnough = Speed >= Tuning->RollMinSpeed;
		const bool bHighEnough = LandingFallHeight >= Tuning->RollMinFallHeight;
		if (bFastEnough && bHighEnough)
		{
			return ESpireMovementState::Roll;
		}
	}

	// ------------------------------------------------------------------
	//  PRIORITY 58 — VAULT (past to'siq: 0.40 .. 1.25 m)
	// ------------------------------------------------------------------
	if (!bGrounded && Probe.bObstacle && ForwardDot > 0.5f)
	{
		const float MinH = Tuning ? Tuning->VaultMinHeight : 40.f;
		const float MaxH = Tuning ? Tuning->VaultMaxHeight : 125.f;
		if (Probe.IsVaultable(MinH, MaxH))
		{
			return ESpireMovementState::Vault;
		}
	}

	// ------------------------------------------------------------------
	//  PRIORITY 56 — LEDGE CLIMB (baland to'siq: 1.25 .. 2.40 m) — Mantle
	// ------------------------------------------------------------------
	if (!bGrounded && Probe.bLedge)
	{
		const float MinH = Tuning ? Tuning->LedgeMinHeight : 125.f;
		const float MaxH = Tuning ? Tuning->LedgeMaxHeight : 240.f;
		if (Probe.IsMantleable(MinH, MaxH))
		{
			return ESpireMovementState::LedgeClimb;
		}
	}

	// ------------------------------------------------------------------
	//  PRIORITY 40 — WALL RUN
	// ------------------------------------------------------------------
	if (!bGrounded && (Probe.bWallLeft != Probe.bWallRight))
	{
		const float MinSpeed = Tuning ? Tuning->WallRunMinSpeed : 900.f;
		if (Speed >= MinSpeed && WallJumpCooldownTimer <= 0.f)
		{
			// Bir xil devorga qayta yopishmaslik (GDD 2.2: "almashish shart").
			const int32 SideIndex = Probe.bWallLeft ? 0 : 1;
			if (SideIndex != LastWallSideIndex || WallRunTimer <= 0.f)
			{
				return ESpireMovementState::WallRun;
			}
		}
	}

	// ------------------------------------------------------------------
	//  PRIORITY 30 — SLIDE (Crouch + tezlik >= 6 m/s)
	// ------------------------------------------------------------------
	if (bGrounded && bSlideHeld && Tuning && Speed >= Tuning->SlideMinEntrySpeed)
	{
		return ESpireMovementState::Slide;
	}

	// ------------------------------------------------------------------
	//  PRIORITY 20 — FALL (havo; coyote oynasi shu holatda ishlaydi)
	// ------------------------------------------------------------------
	if (!bGrounded)
	{
		return ESpireMovementState::Fall;
	}

	// ------------------------------------------------------------------
	//  PRIORITY 12 / 10 — SPRINT / IDLE
	// ------------------------------------------------------------------
	const float SprintThreshold = Tuning ? Tuning->RunSpeed * 0.95f : 700.f;
	if (Speed >= SprintThreshold)
	{
		return ESpireMovementState::Sprint;
	}

	return ESpireMovementState::Idle;
}

// ============================================================================
//  HOLATGA KIRISH / CHIQISH
// ============================================================================
void USpirelineMovementComponent::EnterState(ESpireMovementState NewState)
{
	bIsWallRunning = (NewState == ESpireMovementState::WallRun);

	switch (NewState)
	{
	case ESpireMovementState::Slide:
		SlideTimer = Tuning ? Tuning->SlideMaxDuration : 1.6f;
		SetSlideCapsule(true);
		SetMovementMode(MOVE_Custom, static_cast<uint8>(ESpireCustomMode::Slide));
		break;

	case ESpireMovementState::WallRun:
		WallRunTimer = Tuning ? Tuning->WallRunMaxDuration : 2.2f;
		WallRunDuration = 0.f;
		bWallOnLeft = Probe.bWallLeft;
		LastWallSideIndex = bWallOnLeft ? 0 : 1;
		CurrentWallNormal = bWallOnLeft ? Probe.WallNormalLeft : Probe.WallNormalRight;
		bWallJumpedOff = false;
		SetMovementMode(MOVE_Custom, static_cast<uint8>(ESpireCustomMode::WallRun));
		break;

	case ESpireMovementState::Vault:
		StartVault();
		SetMovementMode(MOVE_Custom, static_cast<uint8>(ESpireCustomMode::Vault));
		break;

	case ESpireMovementState::LedgeClimb:
		StartLedgeClimb();
		SetMovementMode(MOVE_Custom, static_cast<uint8>(ESpireCustomMode::LedgeClimb));
		break;

	case ESpireMovementState::Roll:
		RollTimer = Tuning ? Tuning->RollDuration : 0.55f;
		// Roll — "yumshoq" qo'nish: tezlik deyarli saqlanadi (inersiya).
		ApplyRetention(Tuning ? Tuning->RollRetention : 0.92f);
		SetMovementMode(MOVE_Custom, static_cast<uint8>(ESpireCustomMode::Roll));
		break;

	case ESpireMovementState::Fall:
		FallStartZ = UpdatedComponent ? UpdatedComponent->GetComponentLocation().Z : 0.f;
		SetMovementMode(MOVE_Falling);
		break;

	case ESpireMovementState::Sprint:
	case ESpireMovementState::Idle:
	default:
		SetMovementMode(MOVE_Walking);
		break;
	}
}

void USpirelineMovementComponent::ExitState(ESpireMovementState OldState)
{
	switch (OldState)
	{
	case ESpireMovementState::Slide:
		SetSlideCapsule(false);
		// INERSIYA: sirpanishdan keyin tezlikning saqlanishi (GDD 2.4).
		ApplyRetention(Tuning ? Tuning->SlideExitRetention : 0.90f);
		break;

	case ESpireMovementState::WallRun:
		bIsWallRunning = false;
		// Agar devordan sakrab chiqilgan bo'lsa — bonus allaqachon qo'llandi.
		// Aks holda (vaqt tugadi / devor yo'qoldi) — jarima.
		if (!bWallJumpedOff)
		{
			ApplyRetention(Tuning ? Tuning->WallRunTimeoutRetention : 0.80f);
		}
		bWallJumpedOff = false;
		break;

	case ESpireMovementState::Vault:
		ApplyRetention(Tuning ? Tuning->VaultRetention : 0.92f);
		break;

	case ESpireMovementState::LedgeClimb:
		ApplyRetention(Tuning ? Tuning->LedgeClimbRetention : 0.70f);
		break;

	case ESpireMovementState::Roll:
		// Retention Roll'ga kirishda qo'llandi — bu yerda takrorlanmaydi.
		break;

	default:
		break;
	}

	// Yer ustki holatdan havoga chiqish => COYOTE TIME ochiladi (0.15 s).
	if (IsGroundedState(OldState) && !IsMovingOnGround())
	{
		CoyoteTimer = Tuning ? Tuning->CoyoteTime : 0.15f;
		FallStartZ = UpdatedComponent ? UpdatedComponent->GetComponentLocation().Z : 0.f;
	}

	// Sprint rampi har qanday traversal harakatdan keyin saqlanadi.
	if (OldState == ESpireMovementState::Slide ||
	    OldState == ESpireMovementState::Vault ||
	    OldState == ESpireMovementState::Roll ||
	    OldState == ESpireMovementState::WallRun ||
	    OldState == ESpireMovementState::LedgeClimb)
	{
		if (SprintRampAlpha > 0.3f && Tuning)
		{
			SprintGraceTimer = Tuning->SprintRampGraceTime;
		}
	}
}

// ============================================================================
//  INERSIYA — tezlikni ko'paytiruvchi bilan saqlash
// ============================================================================
void USpirelineMovementComponent::ApplyRetention(float Retention)
{
	// Faqat gorizontal komponentga ta'sir qiladi: vertikal tezlik gravitatsiya
	// va sakrash tomonidan boshqariladi.
	FVector Horizontal(Velocity.X, Velocity.Y, 0.f);
	Horizontal *= Retention;

	const float NewSpeed = Horizontal.Size();
	const float Cap = Tuning ? Tuning->HardCapSpeed : 1500.f;

	if (NewSpeed > Cap)
	{
		Horizontal *= Cap / NewSpeed;
	}

	Velocity.X = Horizontal.X;
	Velocity.Y = Horizontal.Y;
}

// ============================================================================
//  SAKRASH: JUMP BUFFERING + COYOTE TIME
// ============================================================================
void USpirelineMovementComponent::OnJumpPressed()
{
	// Buferga yozamiz — o'yinchi YERGA TEGISHDAN OLDIN bosgan bo'lishi mumkin.
	JumpBufferTimer = Tuning ? Tuning->JumpBufferTime : 0.10f;
}

void USpirelineMovementComponent::OnJumpReleased()
{
	// O'zgaruvchan sakrash balandligi: erta qo'yib yuborilsa ko'tarilish kesiladi.
	if (Velocity.Z > 0.f && Tuning)
	{
		Velocity.Z *= Tuning->VariableJumpMinScale;
	}
}

void USpirelineMovementComponent::OnSlidePressed()
{
	// Faqat niyat yoziladi: slaydga kirish shartlarini FSM tekshiradi
	// (yerda + tezlik >= SlideMinEntrySpeed). Shu sabab havoda bosilsa
	// hech narsa bo'lmaydi va yerga tekkanda avtomatik boshlanadi.
	bSlideHeld = true;
}

void USpirelineMovementComponent::OnSlideReleased()
{
	// Slaydni erta tugatish niyati. Minimal davomiylik (SlideMinDuration)
	// EvaluateTransitions()da hurmat qilinadi — tasodifiy "tap" slaydni
	// bir kadrda buzib qo'ymasligi uchun.
	bSlideHeld = false;
}

bool USpirelineMovementComponent::CanJumpNow() const
{
	// 1) Yerda
	if (IsMovingOnGround())
	{
		return true;
	}
	// 2) Coyote Time — yerdan chiqqanidan keyin 0.15 sek ichida
	if (CoyoteTimer > 0.f)
	{
		return true;
	}
	// 3) Devorda yugurish — devordan sakrash
	if (bIsWallRunning)
	{
		return true;
	}
	return false;
}

void USpirelineMovementComponent::TryConsumeJump()
{
	if (JumpBufferTimer <= 0.f || !CanJumpNow())
	{
		return;
	}

	// Bufer "iste'mol qilindi".
	JumpBufferTimer = 0.f;
	DoJump(false);
}

bool USpirelineMovementComponent::DoJump(bool bReplayingMoves)
{
	if (!CharacterOwner || !Tuning)
	{
		return false;
	}

	// Devordan sakrash — tezlik BONUS oladi (GDD 2.2).
	if (bIsWallRunning)
	{
		PerformWallJump();
		return true;
	}

	// Oddiy sakrash
	Velocity.Z = Tuning->JumpVelocity;
	CoyoteTimer = 0.f;
	FallStartZ = UpdatedComponent->GetComponentLocation().Z;
	SetMovementMode(MOVE_Falling);
	return true;
}

void USpirelineMovementComponent::PerformWallJump()
{
	if (!Tuning)
	{
		return;
	}

	// Gorizontal tezlik bonus bilan saqlanadi (+5%), vertikal yangidan beriladi.
	FVector Horizontal(Velocity.X, Velocity.Y, 0.f);
	Horizontal *= Tuning->WallJumpOffBonus;

	Velocity = Horizontal
	         + CurrentWallNormal * Tuning->WallJumpPushOff                      // devordan itarish
	         + FVector(0.f, 0.f, Tuning->JumpVelocity * 0.95f);                 // devor sakrashi biroz past

	bWallJumpedOff = true;
	WallRunTimer = 0.f;
	bIsWallRunning = false;
	WallJumpCooldownTimer = Tuning->WallJumpCooldown;
	LastWallSideIndex = bWallOnLeft ? 0 : 1;

	SetMovementMode(MOVE_Falling);
}

// ============================================================================
//  SPRINT RAMPI
// ============================================================================
void USpirelineMovementComponent::UpdateSprintRamp(float Dt)
{
	if (!Tuning)
	{
		return;
	}

	const bool bWantSprint = (State == ESpireMovementState::Sprint)
	                      || (State == ESpireMovementState::Idle && GetCurrentSpeed() > Tuning->RunSpeed);
	const bool bGraceActive = SprintGraceTimer > 0.f;

	if (bWantSprint || bGraceActive)
	{
		// Ramp ko'tariladi (grace davomida ham, lekin sekinroq emas).
		SprintRampAlpha = FMath::Clamp(SprintRampAlpha + Dt / FMath::Max(Tuning->SprintRampTime, 0.01f), 0.f, 1.f);
	}
	else
	{
		// Traversal harakatlarda (Vault/Slide/WallRun) rampi muzlatamiz.
		const bool bInTraversal =
			State == ESpireMovementState::Vault ||
			State == ESpireMovementState::Roll ||
			State == ESpireMovementState::WallRun ||
			State == ESpireMovementState::Slide ||
			State == ESpireMovementState::LedgeClimb;

		if (!bInTraversal)
		{
			SprintRampAlpha = FMath::Clamp(SprintRampAlpha - Dt / FMath::Max(Tuning->SprintRampTime, 0.01f), 0.f, 1.f);
		}
	}
}

// ============================================================================
//  TEZLIK CHEGARALARI (GDD 2.4.1 / 2.4.2)
// ============================================================================
void USpirelineMovementComponent::ApplySpeedCaps(float Dt)
{
	if (!Tuning)
	{
		return;
	}

	float Speed = Velocity.Size2D();
	if (Speed <= KINDA_SMALL_NUMBER)
	{
		return;
	}

	// --- Yumshoq chegara: drag = k * (v - softCap)^2 ---
	if (Speed > Tuning->SoftCapSpeed)
	{
		const float OverflowM = (Speed - Tuning->SoftCapSpeed) / 100.f;            // m/s
		const float DragAccelCm = Tuning->SoftCapDragCoefficient * OverflowM * OverflowM * 100.f;
		const float NewSpeed = FMath::Max(Tuning->SoftCapSpeed, Speed - DragAccelCm * Dt);

		const float Scale = NewSpeed / Speed;
		Velocity.X *= Scale;
		Velocity.Y *= Scale;
		Speed = NewSpeed;
	}

	// --- Qattiq chegara ---
	if (Speed > Tuning->HardCapSpeed)
	{
		const float Scale = Tuning->HardCapSpeed / Speed;
		Velocity.X *= Scale;
		Velocity.Y *= Scale;
	}
}

void USpirelineMovementComponent::ApplyAirDrag(float Dt)
{
	if (!Tuning || !IsFalling())
	{
		return;
	}
	// Havo qarshiligi juda kichik — momentum saqlanishi kerak (P1 ustuni).
	const float Damp = FMath::Clamp(1.f - Tuning->AirDrag * Dt, 0.f, 1.f);
	Velocity.X *= Damp;
	Velocity.Y *= Damp;
}

// ============================================================================
//  KAPSULA (slayd uchun pasaytirish)
// ============================================================================
void USpirelineMovementComponent::SetSlideCapsule(bool bEnteringSlide)
{
	if (!CharacterOwner || !Tuning)
	{
		return;
	}

	UCapsuleComponent* Capsule = CharacterOwner->GetCapsuleComponent();
	if (!Capsule)
	{
		return;
	}

	const float TargetHalfHeight = bEnteringSlide ? Tuning->SlideCapsuleHalfHeight : Tuning->CapsuleHalfHeight;
	if (FMath::IsNearlyEqual(Capsule->GetScaledCapsuleHalfHeight(), TargetHalfHeight, 0.5f))
	{
		return;
	}

	const float CurrentHalf = Capsule->GetScaledCapsuleHalfHeight();
	const float Delta = TargetHalfHeight - CurrentHalf;

	// Balandlikni o'zgartirsak, kapsula markazi ham surilishi kerak —
	// aks holda oyoqlar polga "kirib" ketadi yoki havoda osilib qoladi.
	// Kapsula markazi aktyor lokatsiyasida, oyoq = markaz - HalfHeight.
	const FVector NewLocation = CharacterOwner->GetActorLocation() + FVector(0.f, 0.f, Delta);

	// Amallar TARTIBI muhim: avval kapsulani kattalashtirsak, u polga bir
	// lahzaga bo'lsa ham kirib ketadi (va penetratsiya hal qilinishi kerak
	// bo'ladi). Shuning uchun:
	//   · kattalashish  -> avval aktyorni ko'taramiz, keyin kapsulani ostiramiz;
	//   · kichrayish    -> avval kapsulani kichraytiramiz, keyin tushiramiz.
	// Ikkala holatda ham oraliq holat "havoda", penetratsiya emas.
	if (Delta > 0.f)
	{
		CharacterOwner->SetActorLocation(NewLocation, false, nullptr, ETeleportType::TeleportPhysics);
		Capsule->SetCapsuleHalfHeight(TargetHalfHeight, true);
	}
	else
	{
		Capsule->SetCapsuleHalfHeight(TargetHalfHeight, true);
		CharacterOwner->SetActorLocation(NewLocation, false, nullptr, ETeleportType::TeleportPhysics);
	}
}

// ============================================================================
//  PHYS CUSTOM — har bir harakatning o'z fizikasi
// ============================================================================
void USpirelineMovementComponent::PhysCustom(float DeltaTime, int32 Iterations)
{
	Super::PhysCustom(DeltaTime, Iterations);

	switch (static_cast<ESpireCustomMode>(CustomMovementMode))
	{
	case ESpireCustomMode::Slide:      PhysSlide(DeltaTime, Iterations);      break;
	case ESpireCustomMode::WallRun:    PhysWallRun(DeltaTime, Iterations);    break;
	case ESpireCustomMode::Vault:      PhysVault(DeltaTime, Iterations);      break;
	case ESpireCustomMode::LedgeClimb: PhysLedgeClimb(DeltaTime, Iterations); break;
	case ESpireCustomMode::Roll:       PhysRoll(DeltaTime, Iterations);       break;
	default: break;
	}
}

void USpirelineMovementComponent::MoveWithGravity(float DeltaTime, int32 Iterations, float GravityMultiplier, float LinearDamping)
{
	if (DeltaTime < MinTickTime || !UpdatedComponent)
	{
		return;
	}

	if (Iterations >= MaxSimulationIterations)
	{
		StopMovementImmediately();
		return;
	}

	// 1) Gravitatsiya
	const float G = Tuning ? Tuning->GetGravityZ() : -1960.f;
	Velocity.Z += G * GravityMultiplier * DeltaTime;

	// Vertikal chegara
	const float Terminal = Tuning ? Tuning->TerminalVelocity : 4500.f;
	Velocity.Z = FMath::Max(Velocity.Z, -Terminal);

	// 2) Chiziqli so'nish (havo qarshiligi / ishqalanish)
	if (LinearDamping > 0.f)
	{
		const float Damp = FMath::Clamp(1.f - LinearDamping * DeltaTime, 0.f, 1.f);
		Velocity.X *= Damp;
		Velocity.Y *= Damp;
	}

	// 3) Harakatni qo'llash + sirpanish
	FHitResult Hit(1.f);
	const FVector Delta = Velocity * DeltaTime;

	SafeMoveUpdatedComponent(Delta, UpdatedComponent->GetComponentQuat(), true, Hit);

	if (Hit.Time < 1.f && Hit.bBlockingHit)
	{
		// Devor bo'ylab sirpanish — tezlik yo'qolmaydi, yo'nalishi o'zgaradi.
		SlideAlongSurface(Delta, 1.f - Hit.Time, Hit.Normal, Hit, true);
	}

	UpdateComponentVelocity();
}

void USpirelineMovementComponent::PhysSlide(float DeltaTime, int32 Iterations)
{
	if (!Tuning)
	{
		return;
	}

	// Nishabdan tezlanish: a = g * sin(theta) * k  (GDD 2.1)
	if (Probe.bGrounded && Probe.GroundSlopeDeg > 1.f)
	{
		const float ThetaRad = FMath::DegreesToRadians(Probe.GroundSlopeDeg);
		const float SlopeAccel = FMath::Abs(Tuning->GetGravityZ()) * FMath::Sin(ThetaRad) * Tuning->SlopeAccelerationScale;

		// Nishabning pastga yo'nalishi.
		const FVector DownhillDir = FVector::VectorPlaneProject(FVector::DownVector, Probe.GroundNormal).GetSafeNormal();
		Velocity += DownhillDir * SlopeAccel * DeltaTime;
	}

	// Sirpanish ishqalanishi: a = μ * g (GDD 2.1).
	//
	// MUHIM: μ — ko'rsatkich emas, TEZLANISH koeffitsiyenti. Uni "eksponensial
	// so'nish" sifatida qo'llash xato bo'lardi: μ = 0.08 da 0.08 * 10 = 0.8/s
	// so'nish 11 m/s da 8.8 m/s^2 tormoz beradi va slayd tezlikni yo'q qiladi.
	// To'g'ri hisob: 0.08 * 19.6 = 1.57 m/s^2. Eng uzun slayd (1.6 s) ham
	// 11 -> 8.5 m/s, ya'ni momentum saqlanadi (GDD 2.4: kirish ▸ chiqish ×0.90).
	const float FrictionAccel = Tuning->SlideFriction * FMath::Abs(Tuning->GetGravityZ());

	FVector Horizontal(Velocity.X, Velocity.Y, 0.f);
	const float HSize = Horizontal.Size();
	if (HSize > KINDA_SMALL_NUMBER)
	{
		const float NewSize = FMath::Max(0.f, HSize - FrictionAccel * DeltaTime);
		Horizontal *= (NewSize / HSize);
		Velocity.X = Horizontal.X;
		Velocity.Y = Horizontal.Y;
	}

	MoveWithGravity(DeltaTime, Iterations,
	                Tuning->FallGravityMultiplier,   // yerga yopishib turishi uchun
	                0.f);                            // ishqalanish yuqorida qo'llandi
}

void USpirelineMovementComponent::PhysWallRun(float DeltaTime, int32 Iterations)
{
	if (!UpdatedComponent || !Tuning)
	{
		return;
	}

	// Devorning gorizontal tangensi (yuqoriga perpendikulyar).
	const FVector WallTangent = FVector::CrossProduct(FVector::UpVector, CurrentWallNormal).GetSafeNormal();

	// Joriy tezlikni tangensga proyeksiya qilamiz — "momentum yo'qolmaydi".
	const float Along = Velocity.X * WallTangent.X + Velocity.Y * WallTangent.Y;
	const float Sign = (Along >= 0.f) ? 1.f : -1.f;

	const float TargetSpeed = FMath::Clamp(FMath::Abs(Along), Tuning->WallRunMinSpeed, Tuning->WallRunMaxSpeed);

	FVector NewHorizontal = WallTangent * (TargetSpeed * Sign);

	// Devorga yopishish kuchi (normal bo'ylab).
	NewHorizontal += -CurrentWallNormal * WallStickForce;

	Velocity.X = NewHorizontal.X;
	Velocity.Y = NewHorizontal.Y;

	// Vertikal: sekin pastga tushish.
	Velocity.Z = FMath::FInterpTo(Velocity.Z, Tuning->WallRunVerticalDecay * -1.f, DeltaTime, 4.f);

	MoveWithGravity(DeltaTime, Iterations, 0.f, 0.f);

	WallRunDuration += DeltaTime;
}

void USpirelineMovementComponent::PhysVault(float DeltaTime, int32 Iterations)
{
	// Iterations kerak emas: bu skript harakat, kolliziya bilan kurashmaydi.
	(void)Iterations;

	// MUHIM: taymerni bu yerda KAMAYTIRMAYMIZ — UpdateTimers() har kadr
	// buni allaqachon qiladi. Aks holda taymer ikki marta kamayib, vault
	// belgilangan davomiylikning yarmida tugab qoladi (va substep paytida
	// yana ko'proq).
	(void)DeltaTime;

	if (!UpdatedComponent)
	{
		return;
	}

	const float Alpha = 1.f - FMath::Clamp(VaultTimer / FMath::Max(VaultDuration, 0.01f), 0.f, 1.f);
	const float Smooth = FMath::InterpEaseInOut(0.f, 1.f, Alpha, 2.f);

	const FVector Current = UpdatedComponent->GetComponentLocation();
	const FVector Target = FMath::Lerp(VaultStartLocation, VaultTargetLocation, Smooth);

	FHitResult Hit(1.f);
	SafeMoveUpdatedComponent(Target - Current, UpdatedComponent->GetComponentQuat(), true, Hit);
	UpdateComponentVelocity();
}

void USpirelineMovementComponent::PhysLedgeClimb(float DeltaTime, int32 Iterations)
{
	// Iterations kerak emas: bu skript harakat (yuqoridagi izohga qarang).
	(void)Iterations;

	// Taymer UpdateTimers() tomonidan boshqariladi (PhysVault izohiga qarang).
	(void)DeltaTime;

	if (!UpdatedComponent)
	{
		return;
	}

	const float Duration = Tuning ? Tuning->LedgeClimbDuration : 0.35f;
	const float Alpha = 1.f - FMath::Clamp(LedgeClimbTimer / FMath::Max(Duration, 0.01f), 0.f, 1.f);
	const float Smooth = FMath::InterpEaseInOut(0.f, 1.f, Alpha, 2.f);

	const FVector Current = UpdatedComponent->GetComponentLocation();
	const FVector Target = FMath::Lerp(LedgeStartLocation, LedgeTargetLocation, Smooth);

	FHitResult Hit(1.f);
	SafeMoveUpdatedComponent(Target - Current, UpdatedComponent->GetComponentQuat(), true, Hit);
	UpdateComponentVelocity();
}

void USpirelineMovementComponent::PhysRoll(float DeltaTime, int32 Iterations)
{
	if (!Tuning)
	{
		return;
	}
	// Roll ham sirpanish kabi ishlaydi, lekin davomiyligi qat'iy.
	//
	// Bu yerda ishqalanish YO'Q (LinearDamping = 0): roll momentumni saqlaydi —
	// uning yagona narxi kirishdagi ×0.92 (GDD 2.4-jadval). Aks holda 2/s so'nish
	// 0.55 sekundda tezlikning 67% ini yo'q qilardi va "flow" uzilardi.
	MoveWithGravity(DeltaTime, Iterations, Tuning->FallGravityMultiplier, 0.f);
}

// ============================================================================
//  VAULT / LEDGE CLIMB BOSHLANISHI
// ============================================================================
void USpirelineMovementComponent::StartVault()
{
	if (!UpdatedComponent || !Tuning)
	{
		return;
	}

	// Davomiylik to'siq balandligiga qarab (past to'siq = tez vault).
	const float Range = FMath::Max(1.f, Tuning->VaultMaxHeight - Tuning->VaultMinHeight);
	const float Pct = FMath::Clamp((Probe.ObstacleHeight - Tuning->VaultMinHeight) / Range, 0.f, 1.f);
	VaultDuration = FMath::Lerp(Tuning->VaultDurationMin, Tuning->VaultDurationMax, Pct);
	VaultTimer = VaultDuration;

	VaultStartLocation = UpdatedComponent->GetComponentLocation();

	// Nishon: to'siqning ustki sathidan bir oz narida, oyoq ustida turgandek.
	//
	// ESLATMA (production uchun): bu yerda "narigi tomon" (LandingProbe) ni
	// trace qilish to'g'riroq bo'lardi — to'siq orqasida bo'shliq bo'lsa,
	// o'yinchi ustidan sakrab o'tib, pastga tushishi kerak. Hozirgi variant
	// har doim xavfsiz: hech qachon geometriya ichiga kirmaydi.
	const FVector Forward = UpdatedComponent->GetForwardVector();
	VaultTargetLocation = Probe.ObstacleTopPoint
	                    + Forward * (Tuning->CapsuleRadius + 25.f)
	                    + FVector(0.f, 0.f, Tuning->CapsuleHalfHeight + 2.f);

	// Vault davomida vertikal tezlik nolga tushadi (skript harakat boshqaradi).
	Velocity.Z = 0.f;
}

void USpirelineMovementComponent::StartLedgeClimb()
{
	if (!UpdatedComponent || !Tuning)
	{
		return;
	}

	LedgeClimbTimer = Tuning->LedgeClimbDuration;
	LedgeStartLocation = UpdatedComponent->GetComponentLocation();

	// Nishon: qirra ustki nuqtasi + kapsula balandligi.
	LedgeTargetLocation = FVector(Probe.LedgeTopPoint.X, Probe.LedgeTopPoint.Y,
	                              Probe.LedgeTopPoint.Z + Tuning->CapsuleHalfHeight + 2.f);

	Velocity.Z = 0.f;
}

// ============================================================================
//  GRAVITATSIYA — holatga qarab asimmetrik (GDD 2.1)
// ============================================================================
float USpirelineMovementComponent::GetGravityZ() const
{
	const float Base = Super::GetGravityZ();
	if (!Tuning)
	{
		return Base * 2.f;
	}

	float Multiplier = Tuning->GravityMultiplier;

	if (IsFalling())
	{
		if (ApexTimer > 0.f)
		{
			// Cho'qqi: qaror qabul qilish uchun "osilib turish" oynasi.
			Multiplier *= Tuning->ApexGravityMultiplier;
		}
		else if (Velocity.Z > 0.f)
		{
			Multiplier *= Tuning->RiseGravityMultiplier;
		}
		else
		{
			Multiplier *= Tuning->FallGravityMultiplier;
		}
	}

	return Base * Multiplier;
}

// ============================================================================
//  UE OVERRIDELARI
// ============================================================================
void USpirelineMovementComponent::OnMovementModeChanged(EMovementMode PreviousMovementMode, uint8 PreviousCustomMode)
{
	Super::OnMovementModeChanged(PreviousMovementMode, PreviousCustomMode);

	// Fall -> Grounded o'tishi: qo'nish zarbasi shu yerda ham qayd qilinadi
	// (TickComponent'dagi mantiqni to'ldiradi).
	const bool bWasFalling = (PreviousMovementMode == MOVE_Falling);
	if (bWasFalling && IsMovingOnGround() && PreviousVelocityZ < -1.f)
	{
		bJustLanded = true;
		LandingImpactVelocity = FMath::Abs(PreviousVelocityZ);
	}
}

float USpirelineMovementComponent::GetMaxSpeed() const
{
	if (!Tuning)
	{
		return MaxWalkSpeed;
	}

	switch (State)
	{
	case ESpireMovementState::Idle:
		return Tuning->RunSpeed;

	case ESpireMovementState::Sprint:
		// Sprint rampi: 7.5 -> 11.0 m/s (GDD 2.2).
		return FMath::Lerp(Tuning->RunSpeed, Tuning->SprintSpeed, SprintRampAlpha);

	case ESpireMovementState::Slide:
		return Tuning->SprintSpeed;

	case ESpireMovementState::WallRun:
		return Tuning->WallRunMaxSpeed;

	case ESpireMovementState::Fall:
		return Tuning->SprintSpeed;

	case ESpireMovementState::Roll:
	case ESpireMovementState::Vault:
	case ESpireMovementState::LedgeClimb:
	default:
		return Tuning->HardCapSpeed;
	}
}

float USpirelineMovementComponent::GetMaxAcceleration() const
{
	// Skript harakatlarda (Vault/LedgeClimb/Slide/WallRun) tezlanishni biz
	// o'zimiz boshqaramiz — shuning uchun 0.
	if (State == ESpireMovementState::Vault ||
	    State == ESpireMovementState::LedgeClimb ||
	    State == ESpireMovementState::Slide ||
	    State == ESpireMovementState::WallRun)
	{
		return 0.f;
	}
	return Tuning ? Tuning->RunAcceleration : Super::GetMaxAcceleration();
}

float USpirelineMovementComponent::GetMaxBrakingDeceleration() const
{
	return Tuning ? Tuning->RunDeceleration : Super::GetMaxBrakingDeceleration();
}

// ============================================================================
//  YORDAMCHI STATIKLAR
// ============================================================================
bool USpirelineMovementComponent::IsGroundedState(ESpireMovementState InState)
{
	return InState == ESpireMovementState::Idle
	    || InState == ESpireMovementState::Sprint
	    || InState == ESpireMovementState::Slide
	    || InState == ESpireMovementState::Roll;
}

float USpirelineMovementComponent::GetStatePriority(ESpireMovementState InState)
{
	// GDD 5.1-jadval: ustuvorlik zinapoyasi.
	switch (InState)
	{
	case ESpireMovementState::Roll:       return 60.f;
	case ESpireMovementState::Vault:      return 58.f;
	case ESpireMovementState::LedgeClimb: return 56.f;
	case ESpireMovementState::WallRun:    return 40.f;
	case ESpireMovementState::Slide:      return 30.f;
	case ESpireMovementState::Fall:       return 20.f;
	case ESpireMovementState::Sprint:     return 12.f;
	case ESpireMovementState::Idle:
	default:                              return 10.f;
	}
}

FString USpirelineMovementComponent::GetDebugStateString() const
{
	const TCHAR* StateName = TEXT("?");
	switch (State)
	{
	case ESpireMovementState::Idle:       StateName = TEXT("Idle");       break;
	case ESpireMovementState::Sprint:     StateName = TEXT("Sprint");     break;
	case ESpireMovementState::Slide:      StateName = TEXT("Slide");      break;
	case ESpireMovementState::WallRun:    StateName = TEXT("WallRun");    break;
	case ESpireMovementState::Vault:      StateName = TEXT("Vault");      break;
	case ESpireMovementState::LedgeClimb: StateName = TEXT("LedgeClimb"); break;
	case ESpireMovementState::Fall:       StateName = TEXT("Fall");       break;
	case ESpireMovementState::Roll:       StateName = TEXT("Roll");       break;
	}

	return FString::Printf(
		TEXT("P%.0f %s | v %.2f m/s | coyote %.0f kadr | buffer %.0f kadr | sprint %.0f%%"),
		GetStatePriority(State),
		StateName,
		GetCurrentSpeed() / 100.f,
		(CoyoteTimer / 0.01667f),
		(JumpBufferTimer / 0.01667f),
		SprintRampAlpha * 100.f);
}
