export type SubNavItem = { id: string; num: string; label: string };
export type SectionNavItem = {
  id: string;
  index: string;
  title: string;
  short: string;
  subs: SubNavItem[];
};

export const SECTIONS: SectionNavItem[] = [
  {
    id: "vizyon",
    index: "01",
    title: "Asosiy Vizyon va Identitet",
    short: "Vizyon",
    subs: [
      { id: "1-1", num: "1.1", label: "O'yin pasporti" },
      { id: "1-2", num: "1.2", label: "High Concept" },
      { id: "1-3", num: "1.3", label: "Core Fantasy" },
      { id: "1-4", num: "1.4", label: "Uchta USP" },
      { id: "1-5", num: "1.5", label: "Bozor va raqobat" },
      { id: "1-6", num: "1.6", label: "Dizayn ustunlari" },
    ],
  },
  {
    id: "harakat",
    index: "02",
    title: "Harakat Mexanikasi va Dinamika",
    short: "Harakat",
    subs: [
      { id: "2-1", num: "2.1", label: "Fizika asoslari" },
      { id: "2-2", num: "2.2", label: "Harakat katalogi" },
      { id: "2-3", num: "2.3", label: "Kinetik Zaryad" },
      { id: "2-4", num: "2.4", label: "Momentum qoidalari" },
      { id: "2-5", num: "2.5", label: "Coyote Time va yordam" },
      { id: "2-6", num: "2.6", label: "Flow State" },
      { id: "2-7", num: "2.7", label: "Game Juice" },
      { id: "2-8", num: "2.8", label: "Flow sinovi" },
    ],
  },
  {
    id: "level",
    index: "03",
    title: "Level Design va Yo'l Topish",
    short: "Level",
    subs: [
      { id: "3-1", num: "3.1", label: "Tracer Language" },
      { id: "3-2", num: "3.2", label: "Matnsiz yo'naltirish" },
      { id: "3-3", num: "3.3", label: "Risk vs Reward" },
      { id: "3-4", num: "3.4", label: "To'siqlar katalogi" },
      { id: "3-5", num: "3.5", label: "Blockout metrikasi" },
      { id: "3-6", num: "3.6", label: "Ritm va pacing" },
    ],
  },
  {
    id: "sikl",
    index: "04",
    title: "O'yin Sikli va Rivojlanish",
    short: "Sikl",
    subs: [
      { id: "4-1", num: "4.1", label: "Sikl qatlamlari" },
      { id: "4-2", num: "4.2", label: "Line Grade" },
      { id: "4-3", num: "4.3", label: "Qayta o'ynash" },
      { id: "4-4", num: "4.4", label: "Skill Tree" },
      { id: "4-5", num: "4.5", label: "Ochilish darvozalari" },
      { id: "4-6", num: "4.6", label: "Kontent tuzilishi" },
    ],
  },
  {
    id: "texnik",
    index: "05",
    title: "Texnik Arxitektura va Dasturlash Asosi",
    short: "Texnik",
    subs: [
      { id: "5-1", num: "5.1", label: "State Machine" },
      { id: "5-2", num: "5.2", label: "Muhit skaneri" },
      { id: "5-3", num: "5.3", label: "Reachability solver" },
      { id: "5-4", num: "5.4", label: "Dvigatel parametrlari" },
      { id: "5-5", num: "5.5", label: "Tuning kalkulyatori" },
      { id: "5-6", num: "5.6", label: "Unreal / Unity" },
      { id: "5-7", num: "5.7", label: "Tarmoq va ghost" },
      { id: "5-8", num: "5.8", label: "Performance va QA" },
    ],
  },
  {
    id: "audio",
    index: "06",
    title: "Audio va Atmosfera",
    short: "Audio",
    subs: [
      { id: "6-1", num: "6.1", label: "Adaptiv musiqa" },
      { id: "6-2", num: "6.2", label: "Intensivlik xaritasi" },
      { id: "6-3", num: "6.3", label: "Nafas va tezlik" },
      { id: "6-4", num: "6.4", label: "Foley katalogi" },
      { id: "6-5", num: "6.5", label: "Miks va 3D" },
      { id: "6-6", num: "6.6", label: "Texnik byudjet" },
    ],
  },
  {
    id: "ishlab-chiqarish",
    index: "07",
    title: "Ishlab Chiqarish Rejasi va Xatarlar",
    short: "Reja",
    subs: [
      { id: "7-1", num: "7.1", label: "Bosqichlar" },
      { id: "7-2", num: "7.2", label: "Jamoa va rollar" },
      { id: "7-3", num: "7.3", label: "Xatar reyestri" },
      { id: "7-4", num: "7.4", label: "Tezkor cheat sheet" },
    ],
  },
  {
    id: "debug-hud",
    index: "08",
    title: "Gameplay Debug HUD va Dev Tooling",
    short: "Debug HUD",
    subs: [
      { id: "8-1", num: "8.1", label: "Maqsad va tamoyillar" },
      { id: "8-2", num: "8.2", label: "Panel joylashuvi" },
      { id: "8-3", num: "8.3", label: "Vizual qatlamlar" },
      { id: "8-4", num: "8.4", label: "Tugmalar va konsol" },
      { id: "8-5", num: "8.5", label: "Telemetriya va friction tahlili" },
      { id: "8-6", num: "8.6", label: "SplineBot integratsiyasi" },
      { id: "8-7", num: "8.7", label: "Ship xavfsizligi" },
      { id: "8-8", num: "8.8", label: "Qabul mezonlari" },
    ],
  },
];
