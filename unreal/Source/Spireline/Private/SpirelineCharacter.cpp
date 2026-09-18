// Copyright (c) SPIRE-LINE Interactive.

#include "SpirelineCharacter.h"

#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "SpirelineMovementComponent.h"
#include "SpirelineMovementTuning.h"

ASpirelineCharacter::ASpirelineCharacter(const FObjectInitializer& ObjectInitializer)
	// Muhim: ACharacter'ning standart harakat komponentini bizning komponentga almashtiramiz.
	: Super(ObjectInitializer.SetDefaultSubobjectClass<USpirelineMovementComponent>(
		ACharacter::CharacterMovementComponentName))
{
	PrimaryActorTick.bCanEverTick = true;

	// Kapsula (Tuning'dagi qiymatlar BeginPlay'da qo'llanadi).
	GetCapsuleComponent()->InitCapsuleSize(32.f, 86.f);

	// FPP: qahramon kontroller yo'nalishiga qaraydi, tana emas.
	bUseControllerRotationYaw = true;
	bUseControllerRotationPitch = false;
	bUseControllerRotationRoll = false;

	// Birinchi shaxs kamerasi. Ko'z balandligi 1.68 m; kapsula markazi = 0
	// bo'lgani uchun 168 - 86 = 82 sm.
	Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("SpirelineCamera"));
	Camera->SetupAttachment(GetCapsuleComponent());
	Camera->SetRelativeLocation(FVector(12.f, 0.f, 82.f)); // oldinga 12 sm (ko'z siljishi)
	Camera->bUsePawnControlRotation = true;
	Camera->SetFieldOfView(BaseFov);
}

void ASpirelineCharacter::BeginPlay()
{
	Super::BeginPlay();

	if (Camera)
	{
		Camera->SetFieldOfView(BaseFov);
	}
	else
	{
		UE_LOG(LogTemp, Error, TEXT("[Spireline] Kamera komponenti yaratilmagan."));
	}
}

USpirelineMovementComponent* ASpirelineCharacter::GetSpireMovement() const
{
	return Cast<USpirelineMovementComponent>(GetCharacterMovement());
}

// ============================================================================
//  KIRISH
// ============================================================================
void ASpirelineCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	// ESLATMA: bu yerda UE'ning klassik (legacy) input tizimi ishlatiladi —
	// u qisqaroq va o'qishga oson. UE5.4'ning Enhanced Input tizimiga o'tish
	// uchun UInputAction/UInputMappingContext yaratib, quyidagi funksiyalarni
	// xuddi shunday bog'lash kifoya (harakat mantig'i o'zgarmaydi).

	// --- Harakat o'qlari ---
	PlayerInputComponent->BindAxis(TEXT("MoveForward"), this, &ASpirelineCharacter::MoveForward);
	PlayerInputComponent->BindAxis(TEXT("MoveRight"), this, &ASpirelineCharacter::MoveRight);

	// --- Kamera o'qlari ---
	PlayerInputComponent->BindAxis(TEXT("Turn"), this, &ASpirelineCharacter::TurnInput);
	PlayerInputComponent->BindAxis(TEXT("LookUp"), this, &ASpirelineCharacter::LookUpInput);

	// --- Harakat tugmalari ---
	PlayerInputComponent->BindAction(TEXT("Jump"), IE_Pressed, this, &ASpirelineCharacter::OnJumpPressed);
	PlayerInputComponent->BindAction(TEXT("Jump"), IE_Released, this, &ASpirelineCharacter::OnJumpReleased);

	PlayerInputComponent->BindAction(TEXT("Slide"), IE_Pressed, this, &ASpirelineCharacter::OnSlidePressed);
	PlayerInputComponent->BindAction(TEXT("Slide"), IE_Released, this, &ASpirelineCharacter::OnSlideReleased);
}

void ASpirelineCharacter::MoveForward(float Value)
{
	if (FMath::Abs(Value) <= KINDA_SMALL_NUMBER || !Controller)
	{
		return;
	}

	// Faqat yaw bo'yicha harakat — pitch harakatga ta'sir qilmasin (FPP).
	const FRotator YawRotation(0.f, Controller->GetControlRotation().Yaw, 0.f);
	const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);

	AddMovementInput(Direction, Value);
}

void ASpirelineCharacter::MoveRight(float Value)
{
	if (FMath::Abs(Value) <= KINDA_SMALL_NUMBER || !Controller)
	{
		return;
	}

	const FRotator YawRotation(0.f, Controller->GetControlRotation().Yaw, 0.f);
	const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);

	AddMovementInput(Direction, Value);
}

void ASpirelineCharacter::TurnInput(float Value)
{
	AddControllerYawInput(Value);
}

void ASpirelineCharacter::LookUpInput(float Value)
{
	AddControllerPitchInput(Value);
}

void ASpirelineCharacter::OnJumpPressed()
{
	if (USpirelineMovementComponent* Move = GetSpireMovement())
	{
		// Buferlanadi — darhol bajarilmaydi (GDD 2.5: Jump Buffering).
		Move->OnJumpPressed();
	}
}

void ASpirelineCharacter::OnJumpReleased()
{
	if (USpirelineMovementComponent* Move = GetSpireMovement())
	{
		// O'zgaruvchan sakrash balandligi.
		Move->OnJumpReleased();
	}
}

void ASpirelineCharacter::OnSlidePressed()
{
	if (USpirelineMovementComponent* Move = GetSpireMovement())
	{
		Move->OnSlidePressed();
	}
}

void ASpirelineCharacter::OnSlideReleased()
{
	if (USpirelineMovementComponent* Move = GetSpireMovement())
	{
		Move->OnSlideReleased();
	}
}

// ============================================================================
//  TICK — kamera "juice" (GDD 2.7)
// ============================================================================
void ASpirelineCharacter::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	UpdateCameraFeel(DeltaSeconds);
}

void ASpirelineCharacter::UpdateCameraFeel(float DeltaSeconds)
{
	USpirelineMovementComponent* Move = GetSpireMovement();
	if (!Move || !Camera)
	{
		return;
	}

	const float Speed = Move->GetCurrentSpeed();

	// Sprint tezligi Tuning'dan olinadi (DataAsset — yagona haqiqat manbai).
	const USpirelineMovementTuning* Tuning = Move->Tuning;
	const float SprintSpeed = Tuning ? Tuning->SprintSpeed : 1100.f;

	// ---- FOV: 4.5 m/s dan boshlab 11 m/s gacha 90° -> 102° ----
	if (Speed > FovSpeedTrigger)
	{
		const float Alpha = FMath::Clamp((Speed - FovSpeedTrigger) / FMath::Max(SprintSpeed - FovSpeedTrigger, 1.f), 0.f, 1.f);
		const float TargetFov = FMath::Lerp(BaseFov, MaxFov, Alpha);
		Camera->SetFieldOfView(FMath::FInterpTo(Camera->FieldOfView, TargetFov, DeltaSeconds, FovInterpSpeed));
	}
	else
	{
		Camera->SetFieldOfView(FMath::FInterpTo(Camera->FieldOfView, BaseFov, DeltaSeconds, FovInterpSpeed));
	}

	// ---- Roll: devor yugurishida 12°, slaydda 6° ----
	float TargetRoll = 0.f;
	const ESpireMovementState State = Move->GetState();

	if (State == ESpireMovementState::WallRun)
	{
		// Devor qaysi tomonda bo'lsa, o'sha tomonga egiladi.
		// Probe normali devordan o'yinchiga qaraydi — ikkisi o'rtasidagi
		// belgi roll yo'nalishini beradi.
		const FTraversalProbeResult& Probe = Move->GetProbe();
		TargetRoll = Probe.bWallLeft ? -WallRunRollDegrees : WallRunRollDegrees;
	}
	else if (State == ESpireMovementState::Slide)
	{
		TargetRoll = SlideRollDegrees;
	}

	CurrentRollDegrees = FMath::FInterpTo(CurrentRollDegrees, TargetRoll, DeltaSeconds, RollInterpSpeed);

	// Roll'ni faqat kamera komponentiga qo'llaymiz — kontroller rotatsiyasiga
	// EMAS (aks holda tarmoqda va qayta o'ynashda muammo bo'ladi).
	FRotator CameraRotation = Camera->GetRelativeRotation();
	CameraRotation.Roll = CurrentRollDegrees;
	Camera->SetRelativeRotation(CameraRotation);
}
