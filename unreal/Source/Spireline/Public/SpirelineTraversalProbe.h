// Copyright (c) SPIRE-LINE Interactive. Barcha huquqlar himoyalangan.
// SPIRELINE — Muhit skaneri (GDD 5.2-bo'lim).
//
// Bu sinf FSM uchun "ko'z" vazifasini bajaradi: bir kadrda bir marta
// muhitni skanerlaydi va FTraversalProbeResult qaytaradi. Harakat kodi
// hech qachon o'zi trace urmaydi — bu "nega ishlamadi?" savoliga javobni
// bitta joyda saqlaydi va debug chizmalarini (GDD 8.3) avtomatik beradi.
//
// Probe to'plami (9 ta) va ularning byudjeti: GDD 5.2-jadval.

#pragma once

#include "CoreMinimal.h"
#include "UObject/Object.h"
#include "SpirelineMovementTypes.h"
#include "SpirelineTraversalProbe.generated.h"

class USpirelineMovementTuning;

UCLASS()
class SPIRELINE_API USpirelineTraversalProbe : public UObject
{
	GENERATED_BODY()

public:
	/**
	 * Skanerni sozlash. Harakat komponenti BeginPlay'da chaqiradi.
	 * @param InTraversalChannel  Loyihada yaratilgan "Spireline_Traversal" kanali.
	 *                            (Project Settings -> Collision -> Trace Channels)
	 */
	void Initialize(UWorld* InWorld, const USpirelineMovementTuning* InTuning, ECollisionChannel InTraversalChannel);

	/**
	 * Bir kadrlik to'liq skan. Barcha probe'lar shu yerda bajariladi.
	 *
	 * @param IgnoredActor  O'yinchining o'zi (trace'lar uni ko'rmasligi uchun).
	 * @param Location      Kapsula markazi (aktör lokatsiyasi).
	 * @param Velocity      Joriy tezlik (sm/s) — vertikal holat aniqlash uchun.
	 * @param Forward       Oldinga yo'nalish (kontroller yaw'i).
	 * @param DeltaTime     Kadr vaqti (prognoz uchun).
	 */
	FTraversalProbeResult Scan(const AActor* IgnoredActor,
	                           const FVector& Location,
	                           const FVector& Velocity,
	                           const FVector& Forward,
	                           float DeltaTime);

	/** Bitta probe'ni qo'lda bajarish — "spire.probe Ground on" (GDD 8.4). */
	FTraversalProbeResult ScanSingle(const AActor* IgnoredActor,
	                                 const FVector& Location,
	                                 const FVector& Velocity,
	                                 const FVector& Forward,
	                                 ESpireProbeMask Mask);

	/** Debug chizmalari (faqat !UE_BUILD_SHIPPING). Ranglar GDD 8.3-jadvali. */
	void DrawDebug(const FTraversalProbeResult& Result,
	               const FVector& Location,
	               const FVector& Forward) const;

	/** Skanerning oxirgi ishlash vaqti (ms) — P6 paneli uchun (GDD 8.2). */
	float GetLastScanMilliseconds() const { return LastScanMs; }

private:
	// ------------------------------------------------------------- yordamchi
	bool ProbeGround(const AActor* IgnoredActor, const FVector& Location, FTraversalProbeResult& Out) const;

	bool ProbeStep(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const;

	/** Chap va o'ng devorlarni 3 balandlikda tekshiradi. */
	bool ProbeWalls(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const;

	/** Oldindagi to'siqni topadi va balandligini o'lchaydi (Vault vs Mantle qarori). */
	bool ProbeObstacle(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const;

	/** Ko'krak + bosh balandligidagi nurlar orqali qirrani aniqlaydi. */
	bool ProbeLedge(const AActor* IgnoredActor, const FVector& Location, const FVector& Forward, FTraversalProbeResult& Out) const;

	/** Pastga qarab qo'nish nuqtasi va tushish balandligini topadi. */
	bool ProbeLanding(const AActor* IgnoredActor, const FVector& Location, const FVector& Velocity, FTraversalProbeResult& Out) const;

	/**
	 * To'siq balandligini O'YINCHINING OYOQ sathidan o'lchaydi (sm).
	 * @param FootZ  Kapsula pastki nuqtasining jahon Z koordinatasi.
	 */
	float MeasureObstacleHeight(const FVector& ImpactPoint, const FVector& Forward, float FootZ) const;

	/** To'siq USTIDA yetarli bo'sh joy borligini tekshiradi (ClearanceProbe). */
	bool TraceClearanceAbove(const AActor* IgnoredActor, const FVector& From, const FVector& Forward, float Depth, float Height) const;

	/** Yordamchi: natijaga sirt materialini yozish (Foley uchun, GDD 6.4). */
	static void ApplySurface(const FHitResult& Hit, FTraversalProbeResult& Out);

	TWeakObjectPtr<UWorld> World;
	const USpirelineMovementTuning* Tuning = nullptr;

	/** Standart: ECC_Visibility. Loyihada maxsus kanal yaratilsa, o'shanga o'zgartiriladi. */
	ECollisionChannel TraversalChannel = ECC_Visibility;

	float LastScanMs = 0.f;
};
