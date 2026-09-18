// Copyright (c) SPIRE-LINE Interactive.

#include "SpirelineMovementTuning.h"

namespace
{
	/**
	 * UE'ning standart gravitatsiyasi (sm/s^2).
	 * Project Settings -> Physics -> Default Gravity Z bilan bir xil bo'lishi kerak.
	 */
	constexpr float DefaultWorldGravityZ = -980.f;
}

USpirelineMovementTuning::USpirelineMovementTuning()
{
	// Qiymatlar hujjatdagi (GDD 5.4-jadval) standart holatda.
}

float USpirelineMovementTuning::GetGravityZ() const
{
	// 2.0 x (-980) = -1960 sm/s^2 = 19.6 m/s^2  (GDD 2.1)
	return DefaultWorldGravityZ * GravityMultiplier;
}

float USpirelineMovementTuning::GetJumpHeight() const
{
	const float G = FMath::Abs(GetGravityZ());
	if (G <= KINDA_SMALL_NUMBER)
	{
		return 0.f;
	}
	// h = v0^2 / (2g)  ->  642^2 / (2 * 1960) = 105 sm = 1.05 m
	return (JumpVelocity * JumpVelocity) / (2.f * G);
}

float USpirelineMovementTuning::GetAirTime() const
{
	const float G = FMath::Abs(GetGravityZ());
	if (G <= KINDA_SMALL_NUMBER)
	{
		return 0.f;
	}
	// t = 2 * v0 / g  ->  2 * 642 / 1960 = 0.655 sek
	return (2.f * JumpVelocity) / G;
}

float USpirelineMovementTuning::PredictGap(float HorizontalSpeed, float DeltaHeight) const
{
	const float G = FMath::Abs(GetGravityZ());
	if (G <= KINDA_SMALL_NUMBER)
	{
		return -1.f;
	}

	// Diskriminant: v0^2 - 2gh. Manfiy bo'lsa — nishon balandlikka yetib bo'lmaydi.
	const float Discriminant = (JumpVelocity * JumpVelocity) - (2.f * G * DeltaHeight);
	if (Discriminant < 0.f)
	{
		return -1.f;
	}

	// d = (v / g) * (v0 + sqrt(v0^2 - 2g*dh))   (GDD 5.3.2)
	return (HorizontalSpeed / G) * (JumpVelocity + FMath::Sqrt(Discriminant));
}

bool USpirelineMovementTuning::IsGapReachable(float Distance, float HorizontalSpeed, float DeltaHeight) const
{
	const float Reach = PredictGap(HorizontalSpeed, DeltaHeight);
	if (Reach < 0.f)
	{
		return false;
	}

	// 6% bag'rikenglik: kapsula radiusi + qo'nish zonasi + LandingAssistDistance.
	// 0.94 dan pastga tushirilsa chegara sakrashlar "omad"ga aylanadi (GDD 5.3).
	constexpr float Tolerance = 0.94f;
	return (Reach * Tolerance) >= Distance;
}
