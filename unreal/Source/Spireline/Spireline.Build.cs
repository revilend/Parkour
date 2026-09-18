// Copyright (c) SPIRE-LINE Interactive.
// SPIRELINE harakat moduli uchun Build.cs.
//
// O'rnatish: bu faylni <Loyiha>/Source/Spireline/Spireline.Build.cs ga qo'ying
// va <Loyiha>.uproject faylidagi "Modules" ro'yxatiga qo'shing:
//
//   {
//     "Name": "Spireline",
//     "Type": "Runtime",
//     "LoadingPhase": "Default"
//   }

using UnrealBuildTool;

public class Spireline : ModuleRules
{
	public Spireline(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[]
		{
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
		});

		PrivateDependencyModuleNames.AddRange(new string[]
		{
			// Probe/debug chizmalari uchun qo'shimcha modul kerak emas —
			// DrawDebugHelpers.h Engine ichida.
		});
	}
}
