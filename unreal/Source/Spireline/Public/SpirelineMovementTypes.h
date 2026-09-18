// Copyright (c) SPIRE-LINE Interactive. Barcha huquqlar himoyalangan.
// SPIRELINE — Harakat tizimi: umumiy tiplar.
//
// Bu fayl BUTUN harakat tizimi uchun yagona "lug'at" hisoblanadi:
//   · ESpireMovementState  — FSM holatlari (8 ta)
//   · ESpireCustomMode     — UCharacterMovementComponent custom rejimlari
//   · FTraversalProbeResult— muhit skanerining natijasi (5.2-bo'lim)
//
// MUHIM: barcha o'lchovlar UE'ning tabiiy birliklarida — SANTIMETR va
// SANTIMETR/SEKUND. Qavs ichidagi izohlarda m/s ekvivalenti ko'rsatilgan.

#pragma once

#include "CoreMinimal.h"
#include "Engine/EngineTypes.h"
#include "SpirelineMovementTypes.generated.h"

/**
 * Harakat holatlari (FSM). GDD 5.1-bo'lim.
 *
 * Tartib muhim emas — o'tishlar ustuvorlik (priority) bo'yicha hal qilinadi,
 * enum indeksi bo'yicha emas (5.1-jadval).
 */
UENUM(BlueprintType)
enum class ESpireMovementState : uint8
{
	Idle		UMETA(DisplayName = "Idle"),			// Sekin yurish / turish
	Sprint		UMETA(DisplayName = "Sprint"),			// 7.5 -> 11.0 m/s ramp
	Slide		UMETA(DisplayName = "Slide"),			// Sirpanish, μ = 0.08
	WallRun		UMETA(DisplayName = "Wall Run"),		// Devor bo'ylab yugurish
	Vault		UMETA(DisplayName = "Vault"),			// Past to'siqdan sakrab o'tish
	LedgeClimb	UMETA(DisplayName = "Ledge Climb"),		// Qirraga ilashib chiqish (Mantle)
	Fall		UMETA(DisplayName = "Fall"),			// Havoda (coyote oynasi shu yerda)
	Roll		UMETA(DisplayName = "Roll"),			// Xavfsiz qo'nish
};

/**
 * UCharacterMovementComponent custom rejimlari.
 *
 * Nega kerak: UE'ning MOVE_Walking / MOVE_Falling rejimlari bizning
 * harakatlarimizni ifodalay olmaydi. Har bir "fizika boshqacha" harakat
 * o'z Phys* funksiyasini oladi (5.6-bo'lim).
 */
UENUM(BlueprintType)
enum class ESpireCustomMode : uint8
{
	None		= 0		UMETA(DisplayName = "None"),
	Slide		= 1		UMETA(DisplayName = "Slide"),
	WallRun		= 2		UMETA(DisplayName = "Wall Run"),
	Vault		= 3		UMETA(DisplayName = "Vault"),
	LedgeClimb	= 4		UMETA(DisplayName = "Ledge Climb"),
	Roll		= 5		UMETA(DisplayName = "Roll"),
};

/**
 * Probe tanlash maskasi.
 * Debug HUD'da bitta probeni ajratib ko'rish uchun (GDD 8.4: "spire.probe Ground on").
 */
UENUM(BlueprintType, meta = (Bitflags, UseEnumValuesAsMaskValuesInEditor = "true"))
enum class ESpireProbeMask : uint8
{
	None		= 0			UMETA(Hidden),
	Ground		= 1 << 0		UMETA(DisplayName = "Ground"),
	Step		= 1 << 1		UMETA(DisplayName = "Step"),
	Walls		= 1 << 2		UMETA(DisplayName = "Walls"),
	Obstacle	= 1 << 3		UMETA(DisplayName = "Obstacle"),
	Ledge		= 1 << 4		UMETA(DisplayName = "Ledge"),
	Landing		= 1 << 5		UMETA(DisplayName = "Landing"),

	All = Ground | Step | Walls | Obstacle | Ledge | Landing	UMETA(DisplayName = "All"),
};
ENUM_CLASS_FLAGS(ESpireProbeMask)

/**
 * Muhit skanerining yagona natijasi.
 *
 * Bir kadrda bir marta to'ldiriladi (TraversalProbe::Scan), so'ng butun FSM
 * shu natijadan foydalanadi. Kod hech qayerda o'zi raycast urmaydi —
 * shu sabab bilan "nega bu harakat ishlamadi?" savoliga javob bitta joyda.
 */
USTRUCT(BlueprintType)
struct FTraversalProbeResult
{
	GENERATED_BODY()

	// ---------------------------------------------------------------- zamin
	/** Zamin topildimi va u yurish mumkin qiyalikdami (<= WalkableFloorAngle). */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bGrounded = false;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	FVector GroundNormal = FVector::UpVector;

	/** Zaminning vertikaldan og'ish burchagi (gradus). 0 = tekis pol. */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float GroundSlopeDeg = 0.f;

	/** Tepadan pastga masofa (sm). */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float GroundDistance = 0.f;

	/** Sirt turi — Foley tizimi shu ID bo'yicha ovoz tanlaydi (6.4-bo'lim). */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	TEnumAsByte<EPhysicalSurface> SurfaceType = SurfaceType_Default;

	// ----------------------------------------------------------------- qadam
	/** Oldinda kichik to'siq bormi (avtomatik step-up). */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bStepUp = false;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float StepHeight = 0.f;

	// ------------------------------------------------------------------ devor
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bWallLeft = false;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bWallRight = false;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	FVector WallNormalLeft = FVector::ZeroVector;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	FVector WallNormalRight = FVector::ZeroVector;

	/** Devorning vertikaldan og'ish burchagi (gradus). Kichik = tik devor. */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float WallAngleLeftDeg = 90.f;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float WallAngleRightDeg = 90.f;

	// ------------------------------------------------ to'siq (Vault vs Mantle)
	/** Oldinda harakatlanadigan to'siq bormi. */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bObstacle = false;

	/** To'siq balandligi (sm), zamin sathidan o'lchanadi. */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float ObstacleHeight = 0.f;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	FVector ObstacleTopPoint = FVector::ZeroVector;

	/**
	 * To'siq USTIDAN o'tish uchun bo'sh joy bormi.
	 *
	 * Bu tekshiruvsiz o'yinchi ko'rinmas devorga uchadi — GDD 5.2-bo'limidagi
	 * "ClearanceProbe" aynan shu muammoni yopadi.
	 */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bClearanceAbove = false;

	/** To'siq balandligi bo'yicha qaror: Vault (past) yoki LedgeClimb (baland). */
	bool IsVaultable(float MinH, float MaxH) const { return bObstacle && bClearanceAbove && ObstacleHeight >= MinH && ObstacleHeight <= MaxH; }
	bool IsMantleable(float MinH, float MaxH) const { return bLedge && LedgeHeight >= MinH && LedgeHeight <= MaxH; }

	// ------------------------------------------------------------------ qirra
	/** Ko'krak balandligida to'siq + bosh erkin => qirra (mantle) boshlandi. */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bLedge = false;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float LedgeHeight = 0.f;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	FVector LedgeTopPoint = FVector::ZeroVector;

	// ------------------------------------------------------------------ qo'nish
	/** Pastda qo'nish mumkin sirt bormi (havoda tushayotganda). */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	bool bLandingSurface = false;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	FVector LandingPoint = FVector::ZeroVector;

	/** Shu qo'nishgacha tushilgan balandlik (sm) — Roll shartini aniqlaydi. */
	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float LandingFallHeight = 0.f;

	UPROPERTY(BlueprintReadOnly, Category = "Spireline|Probe")
	float LandingSlopeDeg = 0.f;

	/** Har kadr Scan() boshida chaqiriladi — eski natija qolib ketmasligi uchun. */
	void Reset()
	{
		*this = FTraversalProbeResult();
	}
};
