// Copyright (c) SPIRE-LINE Interactive. Barcha huquqlar himoyalangan.
// SPIRELINE — Qahramon klassi: kirish (input) va kamera "juice" qatlami.
//
// Bu klass faqat "ulash" vazifasini bajaradi:
//   · USpirelineMovementComponent'ni ACharacter'ga o'rnatadi
//   · Klaviatura/gamepad kirishini harakat niyatlariga aylantiradi
//   · Kamera FOV va roll'ini tezlikka bog'laydi (GDD 2.7 — Game Juice)
//
// Harakat mantig'i bu yerda YO'Q — u butunlay komponentda.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "SpirelineCharacter.generated.h"

class UCameraComponent;
class USpirelineMovementComponent;

UCLASS()
class SPIRELINE_API ASpirelineCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	ASpirelineCharacter(const FObjectInitializer& ObjectInitializer);

	virtual void Tick(float DeltaSeconds) override;

	/** Harakat komponentiga tez murojaat (FSM holati, probe, debugging uchun). */
	UFUNCTION(BlueprintPure, Category = "Spireline")
	USpirelineMovementComponent* GetSpireMovement() const;

protected:
	virtual void BeginPlay() override;
	virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

	// ============================================================== KAMERA
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Spireline|Kamera")
	TObjectPtr<UCameraComponent> Camera;

	/** GDD 2.7: base 90°, maksimal 102° (15 m/s da). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float BaseFov = 90.f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float MaxFov = 102.f;

	/** FOV trigger tezligi — Flow boshlanishi bilan sinxron (4.5 m/s). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float FovSpeedTrigger = 450.f;

	/** FOV lerp tezligi (0.25 sek to'liq o'tish uchun ~4.0). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float FovInterpSpeed = 4.f;

	/** Devor yugurishida kamera devor tomon egiladi (GDD 2.7: 12°). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float WallRunRollDegrees = 12.f;

	/** Sirpanishda engil egilish (6°). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float SlideRollDegrees = 6.f;

	/** Roll lerp tezligi (0.18 sek uchun ~8.0). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kamera")
	float RollInterpSpeed = 8.f;

	// =============================================================== KIRISH
	/** Gamepad bilan harakatlanish uchun maksimal tezlik (sm/s). */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spireline|Kirish")
	float GamepadMoveThreshold = 20.f;

	void MoveForward(float Value);
	void MoveRight(float Value);
	void TurnInput(float Value);
	void LookUpInput(float Value);

	void OnJumpPressed();
	void OnJumpReleased();
	void OnSlidePressed();
	void OnSlideReleased();

private:
	/** FOV va roll'ni tezlikka/holatga bog'lash (GDD 2.7). */
	void UpdateCameraFeel(float DeltaSeconds);

	/** Silliq roll uchun joriy qiymat. */
	float CurrentRollDegrees = 0.f;
};
