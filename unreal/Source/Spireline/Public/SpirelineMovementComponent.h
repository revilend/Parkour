// Copyright (c) SPIRE-LINE Interactive. Barcha huquqlar himoyalangan.
// SPIRELINE — Harakat komponenti (FSM yadro). GDD 5.1-bo'lim.
//
// ARXITEKTURA (nima uchun aynan shunday):
//
//   TickComponent()  ->  1) taymerlar
//                        2) qo'nishni qayd qilish
//                        3) FSM o'tishini baholash (probe asosida)
//                        4) Super::TickComponent()  <-- UE harakatni bajaradi
//
//   PhysCustom()     ->  har bir "fizikasi boshqacha" harakat uchun
//                        alohida Phys* funksiyasi (Slide / WallRun / Vault / ...)
//
// MUHIM: bu sinf UCharacterMovementComponent'dan meros oladi — kapsula
// kolliziyasi, qavat aniqlash va tarmoq sinxronizatsiyasi UE tomonidan
// bajariladi. Biz faqat "qanday harakat qilish" qismini yozamiz.
//
// DIQQAT: GravityScale = 1.0 qolishi kerak. Gravitatsiya ko'paytiruvchisi
// Tuning->GravityMultiplier orqali qo'llanadi (aks holda ikki marta
// ko'paytiriladi).

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "SpirelineMovementTypes.h"
#include "SpirelineMovementComponent.generated.h"

class USpirelineMovementTuning;
class USpirelineTraversalProbe;

UCLASS(ClassGroup = (Spireline), meta = (BlueprintSpawnableComponent))
class SPIRELINE_API USpirelineMovementComponent : public UCharacterMovementComponent
{
	GENERATED_BODY()

public:
	USpirelineMovementComponent();

	// ==================================================== SOZLAMALAR (GDD 5.4)
	/** Barcha sonlar shu DataAsset'dan o'qiladi. Bo'sh bo'lsa — kompilyatsiya ishlaydi, lekin tuning yo'q. */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Sozlama")
	TObjectPtr<USpirelineMovementTuning> Tuning;

	/**
	 * Traversal trace kanali.
	 * Project Settings -> Collision -> Trace Channels'da "Spireline_Traversal"
	 * yaratib, shu yerga tanlang (GDD 5.2: ECC_Traversal).
	 */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Sozlama")
	TEnumAsByte<ECollisionChannel> TraversalChannel = ECC_Visibility;

	/** Debug chizmalarini yoqish (faqat !UE_BUILD_SHIPPING). GDD 8.4: F3. */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Debug")
	bool bDrawDebugProbes = false;

	// ========================================================= KIRISH (INPUT)
	// Bu funksiyalar ACharacter tomonidan chaqiriladi. Jump buferlanadi
	// (JumpBuffering), shuning uchun "hoziroq bajar" emas, "niyat" yoziladi.
	UFUNCTION(BlueprintCallable, Category = "Spireline|Kirish")
	void OnJumpPressed();

	UFUNCTION(BlueprintCallable, Category = "Spireline|Kirish")
	void OnJumpReleased();

	UFUNCTION(BlueprintCallable, Category = "Spireline|Kirish")
	void OnSlidePressed();

	UFUNCTION(BlueprintCallable, Category = "Spireline|Kirish")
	void OnSlideReleased();

	// ============================================================= SO'ROVLAR
	UFUNCTION(BlueprintPure, Category = "Spireline|Holat")
	ESpireMovementState GetState() const { return State; }

	UFUNCTION(BlueprintPure, Category = "Spireline|Holat")
	float GetCurrentSpeed() const { return Velocity.Size2D(); }

	UFUNCTION(BlueprintPure, Category = "Spireline|Holat")
	float GetCoyoteTimer() const { return CoyoteTimer; }

	UFUNCTION(BlueprintPure, Category = "Spireline|Holat")
	float GetJumpBufferTimer() const { return JumpBufferTimer; }

	const FTraversalProbeResult& GetProbe() const { return Probe; }

	/** Debug HUD uchun bir qatorlik holat matni (GDD 8.2, panel P2). */
	UFUNCTION(BlueprintPure, Category = "Spireline|Debug")
	FString GetDebugStateString() const;

	// ======================================================= UE OVERRIDELARI
	virtual void BeginPlay() override;
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;
	virtual void OnMovementModeChanged(EMovementMode PreviousMovementMode, uint8 PreviousCustomMode) override;

	virtual void PhysCustom(float DeltaTime, int32 Iterations) override;
	virtual float GetMaxSpeed() const override;
	virtual float GetMaxAcceleration() const override;
	virtual float GetMaxBrakingDeceleration() const override;
	virtual bool DoJump(bool bReplayingMoves) override;

	/**
	 * Gravitatsiyani holatga qarab qaytaradi (GDD 2.1 — asimmetrik gravitatsiya):
	 *   ko'tarilish  x1.00
	 *   tushish      x1.15
	 *   apex (0.18s) x0.85  <- sakrash cho'qqisida qaror qabul qilish uchun vaqt
	 */
	virtual float GetGravityZ() const override;

protected:
	// ================================================================ HOLAT
	ESpireMovementState State = ESpireMovementState::Idle;

	FTraversalProbeResult Probe;

	UPROPERTY(Transient)
	TObjectPtr<USpirelineTraversalProbe> ProbeScanner;

	// ============================================================== TAYMERLAR
	float CoyoteTimer = 0.f;          // 0.15 s (GDD 2.5) — yerdan chiqqach sakrash oynasi
	float JumpBufferTimer = 0.f;      // 0.10 s — erta bosilgan sakrash saqlanadi
	float SlideTimer = 0.f;
	float WallRunTimer = 0.f;
	float VaultTimer = 0.f;
	float LedgeClimbTimer = 0.f;
	float RollTimer = 0.f;
	float HardLandLockTimer = 0.f;
	float WallJumpCooldownTimer = 0.f;
	float SnagTimer = 0.f;

	/** Sprint rampi 0..1 (0 = RunSpeed, 1 = SprintSpeed). */
	float SprintRampAlpha = 0.f;
	float SprintGraceTimer = 0.f;

	// ========================================================== VAQTINCHALIK
	bool bSlideHeld = false;
	bool bJustLanded = false;
	bool bWallJumpedOff = false;
	bool bIsWallRunning = false;

	float WallRunDuration = 0.f;
	bool bWallOnLeft = false;
	int32 LastWallSideIndex = -1;
	FVector CurrentWallNormal = FVector::ZeroVector;

	/** Qo'nish momentidagi zarba tezligi (sm/s) — Hard Landing qarori uchun. */
	float LandingImpactVelocity = 0.f;
	float LandingFallHeight = 0.f;
	float FallStartZ = 0.f;

	/** Vault / LedgeClimb — skript harakat (root motion o'rnini bosadi). */
	FVector VaultStartLocation = FVector::ZeroVector;
	FVector VaultTargetLocation = FVector::ZeroVector;
	float VaultDuration = 0.28f;

	FVector LedgeStartLocation = FVector::ZeroVector;
	FVector LedgeTargetLocation = FVector::ZeroVector;

	/** Apex oynasi taymeri — GetGravityZ() ichida o'qiladi, shuning uchun mutable. */
	mutable float ApexTimer = 0.f;
	float PreviousVelocityZ = 0.f;

	// ============================================================ FSM YADROSI
	void UpdateTimers(float DeltaTime);
	void UpdateStateMachine(float DeltaTime);
	void HandleLanding();

	/** Ustuvorlik bo'yicha eng yaxshi holatni tanlaydi (GDD 5.1-jadval). */
	ESpireMovementState EvaluateTransitions() const;

	void EnterState(ESpireMovementState NewState);
	void ExitState(ESpireMovementState OldState);

	/** Holat almashganda tezlikni saqlash (inersiya). GDD 2.4-jadval. */
	void ApplyRetention(float Retention);

	/** Jump buffer + coyote time mantig'i. */
	void TryConsumeJump();
	bool CanJumpNow() const;
	void PerformWallJump();

	void UpdateSprintRamp(float DeltaTime);

	/** Yumshoq (kvadratik drag) va qattiq tezlik chegaralari. GDD 2.4.1–2.4.2. */
	void ApplySpeedCaps(float DeltaTime);

	void ApplyAirDrag(float DeltaTime);

	void SetSlideCapsule(bool bEnteringSlide);

	static bool IsGroundedState(ESpireMovementState InState);
	static float GetStatePriority(ESpireMovementState InState);

	// ====================================================== PHYS* FUNKSIYALAR
	void PhysSlide(float DeltaTime, int32 Iterations);
	void PhysWallRun(float DeltaTime, int32 Iterations);
	void PhysVault(float DeltaTime, int32 Iterations);
	void PhysLedgeClimb(float DeltaTime, int32 Iterations);
	void PhysRoll(float DeltaTime, int32 Iterations);

	/** Umumiy harakat yadrosi: gravitatsiya -> tezlik -> sweep + sirpanish. */
	void MoveWithGravity(float DeltaTime, int32 Iterations, float GravityMultiplier, float LinearDamping);

	void StartVault();
	void StartLedgeClimb();
};
