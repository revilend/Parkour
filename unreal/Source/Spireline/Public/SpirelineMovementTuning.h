// Copyright (c) SPIRE-LINE Interactive. Barcha huquqlar himoyalangan.
// SPIRELINE — Harakat tizimi: tuning ma'lumotlari (GDD 5.4-bo'lim).
//
// BU FAYL — YAGONA HAQIQAT MANBAI.
// Kodda hech qanday "sehrli son" bo'lmasligi kerak: har bir qiymat shu
// DataAsset'dan o'qiladi. Shu sabab dizayner kodni ochmasdan, hatto
// o'yin ichida (F10 -> spire.tune) tuning qila oladi.
//
// Birliklar: sm, sm/sek, sekund (UE tabiiy birliklari).
// Izohlarda m/s ekvivalenti ko'rsatilgan.

#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "SpirelineMovementTuning.generated.h"

UCLASS(BlueprintType)
class SPIRELINE_API USpirelineMovementTuning : public UPrimaryDataAsset
{
	GENERATED_BODY()

public:
	USpirelineMovementTuning();

	// ============================================================= UMUMIY
	/** Fizika tick chastotasi (Hz). 60 -> DeltaTime 0.01667 s (5.4-jadval). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Umumiy", meta = (ClampMin = "30", ClampMax = "120"))
	float PhysicsTickRate = 60.f;

	/** Bir kadrdagi maksimal delta (sek). Tab o'zgartirilganda tunnel effektining oldini oladi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Umumiy", meta = (ClampMin = "0.01", ClampMax = "0.1"))
	float MaxFrameDelta = 0.05f;

	// ========================================================= GRAVITATSIYA
	/** 2.0 -> 19.6 m/s^2 (real 9.8 x2). "Responsive, ammo og'ir" hissi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Gravitatsiya", meta = (ClampMin = "1.0", ClampMax = "4.0"))
	float GravityMultiplier = 2.0f;

	/** Ko'tarilishda gravitatsiya ko'paytiruvchisi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Gravitatsiya", meta = (ClampMin = "0.5", ClampMax = "2.0"))
	float RiseGravityMultiplier = 1.0f;

	/** Tushishda ko'paytiruvchi (asimmetrik gravitatsiya -> "floaty" hissini yo'q qiladi). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Gravitatsiya", meta = (ClampMin = "0.5", ClampMax = "2.0"))
	float FallGravityMultiplier = 1.15f;

	/** Cho'qqi (apex) atrofida gravitatsiya yengillashadi — qaror uchun vaqt beradi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Gravitatsiya", meta = (ClampMin = "0.5", ClampMax = "1.0"))
	float ApexGravityMultiplier = 0.85f;

	/** Apex oynasining davomiyligi (sek). 0.18 sek = 11 kadr @60Hz. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Gravitatsiya", meta = (ClampMin = "0.0", ClampMax = "0.5"))
	float ApexWindowSeconds = 0.18f;

	/** Vertikal tezlik chegarasi (sm/s). 4500 = 45 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Gravitatsiya", meta = (ClampMin = "1000"))
	float TerminalVelocity = 4500.f;

	// ============================================================== SAKRASH
	/** Sakrash boshlang'ich tezligi (sm/s). 642 = 6.42 m/s -> 1.05 m balandlik. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Sakrash", meta = (ClampMin = "100"))
	float JumpVelocity = 642.f;

	/** Tugma erta qo'yib yuborilsa vertikal tezlik shu koeffitsiyentga ko'paytiriladi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Sakrash", meta = (ClampMin = "0.1", ClampMax = "1.0"))
	float VariableJumpMinScale = 0.55f;

	/**
	 * COYOTE TIME (sek).
	 * DIQQAT: foydalanuvchi talabiga ko'ra 0.15 sek (9 kadr).
	 * GDD 2.5-bo'limi 0.12 sek (7 kadr) deb belgilagan — hujjat yangilanishi kerak.
	 */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Sakrash", meta = (ClampMin = "0.0", ClampMax = "0.3"))
	float CoyoteTime = 0.15f;

	/**
	 * JUMP BUFFERING (sek).
	 * DIQQAT: foydalanuvchi talabiga ko'ra 0.10 sek (6 kadr).
	 * GDD 2.5-bo'limi 0.15 sek (9 kadr) deb belgilagan — hujjat yangilanishi kerak.
	 */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Sakrash", meta = (ClampMin = "0.0", ClampMax = "0.3"))
	float JumpBufferTime = 0.10f;

	// ======================================================= TEZLIK / INERSIYA
	/** 750 = 7.5 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "100"))
	float RunSpeed = 750.f;

	/** 1100 = 11.0 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "100"))
	float SprintSpeed = 1100.f;

	/** 0 dan sprintgacha ko'tarilish vaqti (sek). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "0.1"))
	float SprintRampTime = 1.2f;

	/** Sprint rampni to'siqdan keyin saqlab qolish oynasi (sek). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "0.0"))
	float SprintRampGraceTime = 0.35f;

	/** Yer usti tezlanishi (sm/s^2). 4500 = 45 m/s^2 -> 0..7.5 m/s = 0.17 sek. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "100"))
	float RunAcceleration = 4500.f;

	/** Sekinlashish (sm/s^2). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "100"))
	float RunDeceleration = 2200.f;

	/** Yer ishqalanishi (UE GroundFriction). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "0.0"))
	float GroundFriction = 8.0f;

	/** Havo qarshiligi — momentum saqlanishi uchun juda kichik. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "0.0", ClampMax = "5.0"))
	float AirDrag = 0.35f;

	/** Yumshoq chegara (sm/s). Undan yuqorida drag kvadratik o'sadi (GDD 2.4.1). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "100"))
	float SoftCapSpeed = 1100.f;

	/** drag = k * (v - SoftCapSpeed)^2 formuladagi k (sekundiga). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "0.0"))
	float SoftCapDragCoefficient = 0.35f;

	/** Qattiq chegara (sm/s). 1500 = 15 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tezlik", meta = (ClampMin = "100"))
	float HardCapSpeed = 1500.f;

	// ================================================================ SLIDE
	/** Slaydga kirish uchun minimal tezlik (sm/s). 600 = 6 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0"))
	float SlideMinEntrySpeed = 600.f;

	/** Sirpanish ishqalanish koeffitsiyenti (kichik = uzoq sirpanadi). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0.0", ClampMax = "1.0"))
	float SlideFriction = 0.08f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0.1"))
	float SlideMinDuration = 0.45f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0.1"))
	float SlideMaxDuration = 1.6f;

	/** Sirpanishda burilish tezligi (gradus/sek). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0.0"))
	float SlideSteerRateDegPerSec = 30.f;

	/**
	 * SLIDE CHIQISHIDA TEZLIK SAQLANISHI (inersiya).
	 * 0.90 -> 11.0 m/s dan 9.9 m/s qoladi (GDD 2.4-jadval).
	 */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0.0", ClampMax = "1.5"))
	float SlideExitRetention = 0.90f;

	/** Nishabdan tezlanish koeffitsiyenti: a = g * sin(theta) * k (GDD 2.1). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Slide", meta = (ClampMin = "0.0", ClampMax = "1.0"))
	float SlopeAccelerationScale = 0.35f;

	// ============================================================== WALL RUN
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0"))
	float WallRunMinSpeed = 900.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0"))
	float WallRunMaxSpeed = 1150.f;

	/** Maksimal devor yugurish davomiyligi (sek). GDD: 2.2 sek. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.1"))
	float WallRunMaxDuration = 2.2f;

	/** Devorga yopishish masofasi (sm). GDD: 0.55 m. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "1.0"))
	float WallStickDistance = 55.f;

	/** Devor vertikaldan shu burchakdan ko'p og'masligi kerak (gradus). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.0", ClampMax = "60.0"))
	float MaxWallAngleDeg = 25.f;

	/** Devor o'yinchiga qaragan bo'lishi sharti: dot(WallNormal, Side) < -MinFacingDot. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.0", ClampMax = "1.0"))
	float WallMinFacingDot = 0.35f;

	/** Devor yugurishida vertikal tezlikning sekin pasayishi (sm/s^2). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.0"))
	float WallRunVerticalDecay = 120.f;

	/** Devor yugurishidan SAKRAB chiqishda tezlik bonusi (1.05 = +5%). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.5", ClampMax = "1.5"))
	float WallJumpOffBonus = 1.05f;

	/** Vaqt tugab, devordan tushib qolganda saqlanish (jarima). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.0", ClampMax = "1.5"))
	float WallRunTimeoutRetention = 0.80f;

	/** Bir xil devorga qayta yopishmaslik uchun cooldown (sek). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.0"))
	float WallJumpCooldown = 0.35f;

	/** Devordan itarish kuchi (sm/s) — o'yinchini devordan uzoqlashtiradi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "WallRun", meta = (ClampMin = "0.0"))
	float WallJumpPushOff = 320.f;

	// ================================================================= VAULT
	/** Vault qilinadigan to'siq balandligi oralig'i (sm). 40..125 sm. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.0"))
	float VaultMinHeight = 40.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.0"))
	float VaultMaxHeight = 125.f;

	/** To'siq ustidagi bo'sh joy tekshiruvi (sm). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.0"))
	float VaultClearanceDepth = 100.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.0"))
	float VaultClearanceHeight = 190.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.05"))
	float VaultDurationMin = 0.28f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.05"))
	float VaultDurationMax = 0.42f;

	/** Vault tugagach tezlikning saqlanishi (0.92 = 8% yo'qotish). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Vault", meta = (ClampMin = "0.0", ClampMax = "1.5"))
	float VaultRetention = 0.92f;

	// =========================================================== LEDGE CLIMB
	/** Mantle balandligi oralig'i (sm). 125..240 sm. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "LedgeClimb", meta = (ClampMin = "0.0"))
	float LedgeMinHeight = 125.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "LedgeClimb", meta = (ClampMin = "0.0"))
	float LedgeMaxHeight = 240.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "LedgeClimb", meta = (ClampMin = "0.05"))
	float LedgeClimbDuration = 0.35f;

	/** Mantle — qutqaruv harakati, shuning uchun tezlik ko'p yo'qoladi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "LedgeClimb", meta = (ClampMin = "0.0", ClampMax = "1.5"))
	float LedgeClimbRetention = 0.70f;

	// =================================================================== ROLL
	/** Roll uchun minimal tezlik (sm/s). 900 = 9 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Roll", meta = (ClampMin = "0.0"))
	float RollMinSpeed = 900.f;

	/** Roll uchun minimal tushish balandligi (sm). 350 = 3.5 m. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Roll", meta = (ClampMin = "0.0"))
	float RollMinFallHeight = 350.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Roll", meta = (ClampMin = "0.05"))
	float RollDuration = 0.55f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Roll", meta = (ClampMin = "0.0", ClampMax = "1.5"))
	float RollRetention = 0.92f;

	// ============================================================ HARD LANDING
	/** Bu tezlikdan yuqori qo'nish "og'ir" hisoblanadi (sm/s). 1400 = 14 m/s. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "HardLanding", meta = (ClampMin = "0.0"))
	float HardLandMinImpactVelocity = 1400.f;

	/** Og'ir qo'nishda saqlanish — jazoning asosiy qismi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "HardLanding", meta = (ClampMin = "0.0", ClampMax = "1.0"))
	float HardLandRetention = 0.35f;

	/** Og'ir qo'nishdan keyingi harakatsizlik (sek). O'lim EMAS. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "HardLanding", meta = (ClampMin = "0.0"))
	float HardLandLockTime = 0.9f;

	/** 8..14 m/s orasidagi "o'rta" qo'nish saqlanishi. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "HardLanding", meta = (ClampMin = "0.0", ClampMax = "1.0"))
	float MediumLandRetention = 0.85f;

	// ================================================================ YORDAM
	/** Qo'nish nuqtasiga lateral tortish (sm) — "adolat oynasi" (GDD 2.5). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Yordam", meta = (ClampMin = "0.0"))
	float LandingAssistDistance = 120.f;

	/** Harakatsiz qolib ketishda avtomatik Mantle ishga tushadigan vaqt (sek). */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Yordam", meta = (ClampMin = "0.0"))
	float SnagAssistTimeout = 0.40f;

	// ============================================================== KAPSULA
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Kapsula", meta = (ClampMin = "5.0"))
	float CapsuleRadius = 32.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Kapsula", meta = (ClampMin = "10.0"))
	float CapsuleHalfHeight = 86.f;

	/** Slayd uchun kapsula balandligi (sm) — past shift ostidan o'tish uchun. */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Kapsula", meta = (ClampMin = "10.0"))
	float SlideCapsuleHalfHeight = 48.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Kapsula", meta = (ClampMin = "0.0"))
	float StepOffset = 45.f;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Kapsula", meta = (ClampMin = "0.0", ClampMax = "89.0"))
	float WalkableFloorAngleDeg = 46.f;

	// ================================================== HISOBLANGAN QIYMATLAR
	/** Gravitatsiya tezlanishi (sm/s^2). 2.0 x -980 = -1960. */
	UFUNCTION(BlueprintPure, Category = "Spireline|Hisob")
	float GetGravityZ() const;

	/** Sakrash balandligi (sm): h = v0^2 / (2g). 642^2/(2*1960) = 105 sm = 1.05 m. */
	UFUNCTION(BlueprintPure, Category = "Spireline|Hisob")
	float GetJumpHeight() const;

	/** Havoda o'tgan to'liq vaqt (sek): t = 2*v0/g. 0.655 sek. */
	UFUNCTION(BlueprintPure, Category = "Spireline|Hisob")
	float GetAirTime() const;

	/**
	 * Balandlikka sakrashda yetib boriladigan masofa (sm) — GDD 5.3.2.
	 * d = (v / g) * (v0 + sqrt(v0^2 - 2*g*dh))
	 * @return  -1: balandlikka umuman yetib bo'lmaydi.
	 */
	UFUNCTION(BlueprintPure, Category = "Spireline|Hisob")
	float PredictGap(float HorizontalSpeed, float DeltaHeight) const;

	/** Bu bo'shliq shu tezlikda o'tiladimi (6% bag'rikenglik bilan, GDD 5.3.3). */
	UFUNCTION(BlueprintPure, Category = "Spireline|Hisob")
	bool IsGapReachable(float Distance, float HorizontalSpeed, float DeltaHeight) const;
};
