import {
  B,
  Bullets,
  Callout,
  Chip,
  CodeBlock,
  K,
  Lead,
  Metrics,
  P,
  Panel,
  PanelTitle,
  Section,
  Steps,
  Sub,
  Table,
  cn,
} from "../components/ui";

/* ------------------------------------------------------------ HUD layout mock */

type PanelSpec = {
  id: string;
  name: string;
  sample: string;
  tone: "flux" | "tracer" | "hazard" | "alarm" | "neutral";
  /** foizda: chapdan, yuqoridan, kenglik, balandlik */
  box: [number, number, number, number];
};

const PANELS: PanelSpec[] = [
  {
    id: "P2",
    name: "State",
    sample: "WallRunL · t+0.84/2.20 · prio 40",
    tone: "tracer",
    box: [3, 6, 24, 12],
  },
  {
    id: "P3",
    name: "Movement Vitals",
    sample: "v 9.11 · coyote ▓▓▓░░ · buffer ░░░\nKC 62 · flow 78% (t+3.1)",
    tone: "flux",
    box: [3, 20, 24, 22],
  },
  {
    id: "P1",
    name: "Speed Graph (2 sek)",
    sample: "grafik",
    tone: "tracer",
    box: [3, 70, 31, 26],
  },
  {
    id: "P7",
    name: "Decision Tracker",
    sample: "keyingi qaror: 12.4 m · MAIN yoʻl",
    tone: "hazard",
    box: [38, 6, 24, 10],
  },
  {
    id: "P8",
    name: "Audio State",
    sample: "I 0.78 · 121 BPM · Bed+Pulse+Drive\nLPF 8.7 kHz",
    tone: "neutral",
    box: [75, 6, 22, 19],
  },
  {
    id: "P4",
    name: "Retention Log",
    sample: "grafik",
    tone: "flux",
    box: [75, 28, 22, 29],
  },
  {
    id: "P6",
    name: "Frame / Trace Budget",
    sample: "CPU 12.1 ms · trace 0.14 ms\n472 draw · 3.1 M tri",
    tone: "neutral",
    box: [75, 60, 22, 15],
  },
  {
    id: "P5",
    name: "Input Latency",
    sample: "47 ms · 3 kadr",
    tone: "hazard",
    box: [75, 78, 22, 18],
  },
];

const TONE_BORDER: Record<PanelSpec["tone"], string> = {
  flux: "border-flux/50",
  tracer: "border-tracer/50",
  hazard: "border-hazard/50",
  alarm: "border-alarm/50",
  neutral: "border-line",
};

const TONE_TEXT: Record<PanelSpec["tone"], string> = {
  flux: "text-flux",
  tracer: "text-tracer",
  hazard: "text-hazard",
  alarm: "text-alarm",
  neutral: "text-slag",
};

const SPEED_TRACE =
  "0,100 11.8,81.3 23.5,53.1 35.3,31.3 47.1,31.3 58.8,36.9 70.6,41.9 82.4,41.9 94.1,38.8 105.9,43.8 117.6,30 129.4,35 141.2,35 152.9,46.9 164.7,75.6 176.5,75.6 188.2,53.1 200,31.3";

const RETENTION_ROWS = [
  ["12.4 s", "Vault", "×0.92", "10.12", "text-mist"],
  ["13.1 s", "WallJump", "×1.05", "10.63", "text-tracer"],
  ["14.6 s", "AirBrake 30°", "×0.94", "9.99", "text-mist"],
  ["16.2 s", "Rail exit", "+2.00", "11.99", "text-tracer"],
  ["17.9 s", "PerfectLink", "+0.35", "12.34", "text-tracer"],
  ["18.4 s", "Roll", "×0.92", "11.35", "text-mist"],
  ["21.0 s", "HARD LAND", "×0.35", "3.97", "text-alarm"],
] as const;

function SpeedGraphMock() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="h-full w-full">
      {/* maqsad polosalari: 7.5 / 11.0 / 15.0 m/s */}
      {[
        { y: 53.1, label: "7.5", color: "#64748b" },
        { y: 31.3, label: "11.0", color: "#FF6A1F" },
        { y: 6.3, label: "15.0", color: "#FFC53D" },
      ].map((band) => (
        <g key={band.label}>
          <line x1="0" x2="200" y1={band.y} y2={band.y} stroke={band.color} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5" />
          <text x="2" y={band.y - 2} fontSize="5" fill={band.color} fontFamily="IBM Plex Mono, monospace" opacity="0.85">
            {band.label}
          </text>
        </g>
      ))}
      <polyline points={SPEED_TRACE} fill="none" stroke="#2FE0C4" strokeWidth="1.2" />
      {/* hodisa belgilari */}
      <circle cx="94.1" cy="38.8" r="1.8" fill="#2FE0C4" />
      <circle cx="117.6" cy="30" r="1.8" fill="#FF6A1F" />
      <circle cx="164.7" cy="75.6" r="2.2" fill="#FF3D5A" />
      <rect x="160" y="79" width="9" height="9" fill="none" stroke="#FF3D5A" strokeWidth="0.6" />
    </svg>
  );
}

function HudLayoutMock() {
  return (
    <div className="rounded-lg border border-line-soft bg-ink-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
        <p className="label-mono text-tracer">Sxema 8.2.1 · Debug HUD joylashuvi (L2 darajasi)</p>
        <span className="label-mono text-slag">1920 × 1080 · xavfsiz zona 8%</span>
      </div>

      <div className="p-4 md:p-5">
        <div className="relative aspect-video w-full overflow-hidden rounded border border-line-soft bg-ink-950">
          <div className="mesh-grid absolute inset-0 opacity-25" />

          {/* xavfsiz zona */}
          <div className="absolute inset-[8%] rounded-sm border border-dashed border-line-soft" />

          {/* nishon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-4 w-4">
              <span className="absolute top-1/2 left-0 h-px w-1.5 bg-tracer/70" />
              <span className="absolute top-1/2 right-0 h-px w-1.5 bg-tracer/70" />
              <span className="absolute top-0 left-1/2 h-1.5 w-px bg-tracer/70" />
              <span className="absolute bottom-0 left-1/2 h-1.5 w-px bg-tracer/70" />
            </div>
          </div>

          {/* panellar */}
          {PANELS.map((panel) => (
            <div
              key={panel.id}
              className={cn(
                "absolute flex flex-col gap-1 rounded-sm border bg-ink-900/90 px-1.5 py-1.5 backdrop-blur-sm",
                TONE_BORDER[panel.tone],
              )}
              style={{
                left: `${panel.box[0]}%`,
                top: `${panel.box[1]}%`,
                width: `${panel.box[2]}%`,
                height: `${panel.box[3]}%`,
              }}
            >
              <div className="flex shrink-0 items-center gap-1.5">
                <span className={cn("font-mono text-[8px] font-semibold", TONE_TEXT[panel.tone])}>
                  {panel.id}
                </span>
                <span className="truncate font-mono text-[8px] text-chalk">{panel.name}</span>
              </div>

              {panel.id === "P1" ? (
                <div className="min-h-0 flex-1">
                  <SpeedGraphMock />
                </div>
              ) : panel.id === "P4" ? (
                <div className="min-h-0 flex-1 space-y-[2px] overflow-hidden font-mono text-[7.5px] leading-tight">
                  {RETENTION_ROWS.map((row, i) => (
                    <div key={i} className="flex justify-between gap-1">
                      <span className="text-slag">{row[0]}</span>
                      <span className="truncate text-mist">{row[1]}</span>
                      <span className={row[4]}>{row[2]}</span>
                      <span className="text-chalk">{row[3]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="min-h-0 flex-1 font-mono text-[7.5px] leading-tight whitespace-pre-line text-mist">
                  {panel.sample}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="label-mono mt-3.5 text-slag">
          Markaz boʻsh qoladi — nishon va qaror zonasi hech qachon panel bilan qoplanmaydi (oʻyin
          oʻynash imkoniyati saqlanadi).
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- section */

export default function S8DebugHud() {
  return (
    <Section
      id="debug-hud"
      index="08"
      kicker="Boʻlim 08 · Dev tooling"
      title="Gameplay Debug HUD va Dev Tooling"
    >
      <Lead>
        Bu boʻlim ixtiyoriy emas. Harakat tizimini tuning qilish uchun dasturchi <B>har kadrda
        nima sodir boʻlayotganini koʻrishi</B> shart. Harakat-tuning vaqtining 60% i aynan shu
        ekranda oʻtadi — shuning uchun HUD loyihaning <B>asosiy vositalaridan biri</B> hisoblanadi
        va u M1 bosqichida (7.1-boʻlim) qahramon bilan bir vaqtda quriladi.
      </Lead>

      {/* ------------------------------------------------------------ 8.1 */}
      <Sub id="8-1" num="8.1" title="Maqsad va tamoyillar" hint="HUD — maʼlumot kanali">
        <Metrics
          items={[
            { value: "0.40", unit: "ms", label: "CPU byudjet (L2)" },
            { value: "0.05", unit: "ms", label: "CPU byudjet (L0)" },
            { value: "0", label: "Kadrda ajratilgan xotira" },
            { value: "4", label: "Koʻrinish darajasi" },
          ]}
        />

        <P>
          HUD “chiroyli panel” emas. U <B>haqiqatni koʻrsatuvchi asbob</B>: hech qanday smoothing,
          hech qanday kechikish, hech qanday yumaloqlash yoʻq. Agar ekranda <K>9.11 m/s</K> yozilgan
          boʻlsa — kodda ham aynan <K>9.11 m/s</K>.
        </P>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              n: "T1",
              t: "Instant",
              d: "Har bir panel bitta tugma bilan yoqiladi. Menyu yoʻq, sozlamalar ekrani yoʻq, sichqoncha talab qilinmaydi.",
              tone: "tracer" as const,
            },
            {
              n: "T2",
              t: "Honest",
              d: "Qiymatlar xom (raw) koʻrsatiladi. Filtrlangan, tekislangan yoki kechiktirilgan raqam — taqiqlanadi.",
              tone: "flux" as const,
            },
            {
              n: "T3",
              t: "Comparable",
              d: "Joylashuv buildʼdan buildʼga oʻzgarmaydi — ikkita skrinshotni yonma-yon qoʻyib solishtirish mumkin.",
              tone: "hazard" as const,
            },
            {
              n: "T4",
              t: "Free when off",
              d: "Oʻchirilgan holatda narx nol. Barcha debug chizmalar va panel kodlari shipping buildʼdan butunlay olib tashlanadi (8.7).",
              tone: "neutral" as const,
            },
          ].map((item) => (
            <Panel key={item.n}>
              <PanelTitle tone={item.tone}>
                {item.n} · {item.t}
              </PanelTitle>
              <p className="text-sm leading-relaxed">{item.d}</p>
            </Panel>
          ))}
        </div>

        <Callout tone="alarm" label="Qoida" title="HUD oʻyinchi uchun emas">
          <p>
            Debug HUD hech qachon <B>oʻyin ichidagi</B> HUD bilan aralashmaydi: alohida canvas
            qatlami, alohida shrift (mono 8–11 px), alohida rang palitrasi. Oʻyin HUD diegetik
            (kurtkadagi LED), debug HUD esa <B>ataylab xunuk</B> — chalkashtirish imkonsiz boʻlishi
            kerak.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 8.2 */}
      <Sub id="8-2" num="8.2" title="Panel joylashuvi" hint="8 panel, 3 daraja">
        <P>
          Panellar <B>ekran chetlariga</B> joylashadi — markaz boʻsh qoladi, chunki oʻyinchi aynan
          markazga qaraydi. Quyidagi sxema 16:9 nisbatda (1920×1080) real joylashuvni koʻrsatadi:
        </P>

        <HudLayoutMock />

        <Table
          columns={[
            { key: "p", label: "Panel" },
            { key: "n", label: "Nomi" },
            { key: "c", label: "Tarkibi" },
            { key: "r", label: "Yangilanish" },
          ]}
          compact
          rows={[
            [
              <>
                <B>P1</B> <Chip tone="tracer">L1</Chip>
              </>,
              "Speed Graph",
              "2 sekundlik aylanuvchi tezlik grafigi + maqsad polosalari (7.5 / 11.0 / 15.0) + hodisa belgilari",
              "Har kadr (60 Hz)",
            ],
            [
              <>
                <B>P2</B> <Chip tone="tracer">L1</Chip>
              </>,
              "State",
              "Joriy holat nomi, holatdagi vaqt / maks. davomiylik, oxirgi oʻtishning ustuvorligi",
              "Faqat oʻtishda",
            ],
            [
              <>
                <B>P3</B> <Chip tone="flux">L1</Chip>
              </>,
              "Movement Vitals",
              "Tezlik, tezlik vektori, bGrounded, coyote taymeri (7 kadrli bar), buffer taymeri, KC, Flow % va taymer",
              "Har kadr",
            ],
            [
              <>
                <B>P4</B> <Chip tone="flux">L2</Chip>
              </>,
              "Retention Log",
              "Oxirgi 12 saqlash hodisasi: vaqt, harakat nomi, koʻpaytiruvchi, natijaviy tezlik. “Tezlik qayerga ketdi?” paneli",
              "Hodisada",
            ],
            [
              <>
                <B>P5</B> <Chip tone="hazard">L1</Chip>
              </>,
              "Input Latency",
              "Kirish → piksel kechikishi, oxirgi 2 sekunddagi kadr vaqti grafigi",
              "Har kadr",
            ],
            [
              <>
                <B>P6</B> <Chip tone="neutral">L2</Chip>
              </>,
              "Frame / Trace Budget",
              "Subsistema boʻyicha CPU ms, probe soni va vaqti, draw call, uchburchaklar",
              "Har 10 kadr",
            ],
            [
              <>
                <B>P7</B> <Chip tone="hazard">L2</Chip>
              </>,
              "Decision Tracker",
              "Keyingi qaror nuqtasigacha masofa, marshrut toifasi (SAFE / MAIN / DANGER), void chegarasigacha masofa",
              "Har kadr",
            ],
            [
              <>
                <B>P8</B> <Chip tone="neutral">L2</Chip>
              </>,
              "Audio State",
              "Intensivlik I, BPM, faol qatlamlar va gainlar, LPF kesish, ovozlar soni, nafas chastotasi",
              "Har 10 kadr",
            ],
          ]}
          caption="Jadval 8.1 — Panellar. L1 = asosiy (standart), L2 = toʻliq diagnostika."
        />

        <Table
          columns={[
            { key: "l", label: "Daraja" },
            { key: "k", label: "Nima koʻrinadi" },
            { key: "u", label: "Kim ishlatadi" },
          ]}
          compact
          rows={[
            [
              <>
                <Chip tone="neutral">L0</Chip> Oʻchiq
              </>,
              "Hech narsa (0.05 ms — faqat taymer)",
              "Shipping default, QA regressiya testlari",
            ],
            [
              <>
                <Chip tone="tracer">L1</Chip> Asosiy
              </>,
              "P1, P2, P3, P5",
              "Level dizayneri, animator, har kungi ish",
            ],
            [
              <>
                <Chip tone="flux">L2</Chip> Toʻliq
              </>,
              "Barcha 8 panel + dunyo chizmalari (8.3)",
              "Lead Game Designer, Technical Director, tuning sessiyalari",
            ],
            [
              <>
                <Chip tone="hazard">L3</Chip> Diagnostika
              </>,
              "L2 + probe geometriyasi, reachability yoylari, ghost overlay, bot holati",
              "Troubleshooting, SplineBot natijalarini tekshirish",
            ],
          ]}
          caption="Jadval 8.2 — Koʻrinish darajalari. L3 eng ogʻir rejim — 0.4 ms byudjet faqat shunga tegishli."
        />
      </Sub>

      {/* ------------------------------------------------------------ 8.3 */}
      <Sub id="8-3" num="8.3" title="Vizual qatlamlar" hint="Dunyo fazosidagi debug chizmalar">
        <P>
          Panellar raqamlarni koʻrsatadi; dunyo chizmalari esa <B>kod nima “koʻrayotganini”</B>{" "}
          koʻrsatadi. Har bir probe oʻz rangiga ega va bu rang butun loyiha boʻylab oʻzgarmaydi.
        </P>

        <Table
          columns={[
            { key: "l", label: "Qatlam" },
            { key: "c", label: "Rang" },
            { key: "d", label: "Nima chizadi" },
            { key: "k", label: "Tugma" },
          ]}
          compact
          rows={[
            [
              "GroundProbe",
              <span key="g" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#3DE07A" }} />
                <span className="font-mono text-[11px]">#3DE07A</span>
              </span>,
              "Zamin sweep hajmi, normal vektori, yurish mumkin / mumkin emas",
              <K key="gk">F3</K>,
            ],
            [
              "WallProbe L/R",
              <span key="w" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#3D9BFF" }} />
                <span className="font-mono text-[11px]">#3D9BFF</span>
              </span>,
              "3 balandlikdagi devor nurlari, normal, yopishish radiusi",
              <K key="wk">F3</K>,
            ],
            [
              "VaultProbe",
              <span key="v" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#FF6A1F" }} />
                <span className="font-mono text-[11px]">#FF6A1F</span>
              </span>,
              "Box sweep yoʻli, aniqlangan toʻsiq balandligi (raqam bilan)",
              <K key="vk">F3</K>,
            ],
            [
              "ClearanceProbe",
              <span key="c" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#FFC53D" }} />
                <span className="font-mono text-[11px]">#FFC53D</span>
              </span>,
              "Toʻsiq ustidagi boʻsh hajm — yashil (boʻsh) yoki qizil (toʻla)",
              <K key="ck">F3</K>,
            ],
            [
              "LedgeProbe",
              <span key="l" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#2FE0C4" }} />
                <span className="font-mono text-[11px]">#2FE0C4</span>
              </span>,
              "Koʻkrak/bosh nurlari, qirra balandligi, mantle valid zonasi",
              <K key="lk">F3</K>,
            ],
            [
              "Reachability arc",
              <span key="r" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#FF3D5A" }} />
                <span className="font-mono text-[11px]">#FF3D5A</span>
              </span>,
              "Ballistik parabola (yashil = yetib boriladi, qizil = yoʻq), qoʻnish nuqtasi",
              <K key="rk">F4</K>,
            ],
            [
              "Route splines",
              <span key="s" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#B98CFF" }} />
                <span className="font-mono text-[11px]">#B98CFF</span>
              </span>,
              "Dizayner marshruti (SAFE/MAIN/DANGER ranglari bilan), SplineBot yoʻli",
              <K key="sk">F3</K>,
            ],
            [
              "Volumes",
              <span key="vo" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#FF3D5A" }} />
                <span className="font-mono text-[11px]">#FF3D5A</span>
              </span>,
              "Void zonalari, xatar hajmlari, dron skaner konuslari, checkpoint chegaralari",
              <K key="vok">F3</K>,
            ],
            [
              "Traversal channel",
              <span key="tc" className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#96A4B5" }} />
                <span className="font-mono text-[11px]">#96A4B5</span>
              </span>,
              "Qaysi geometriya ECC_Traversal kanalida ekanini wireframe bilan koʻrsatadi",
              <K key="tck">Shift+F3</K>,
            ],
          ]}
          caption="Jadval 8.3 — Dunyo chizmalari. Barcha chizmalar depth-testʼsiz (doim ustida) va 1 px qalinlikda."
        />

        <Callout tone="tracer" label="Amaliy foyda" title="“Nega sakramadi?” — 20 sekundda javob">
          <p>
            Eng koʻp uchraydigan savol: “oʻyinchi sakrashni bosdi, lekin sakramadi”. L3 da javob bir
            qarashda koʻrinadi: <B>GroundProbe yashilmi?</B> (yoʻq — coyote ishlamaydi),{" "}
            <B>VaultProbe toʻsiqni koʻrganmi?</B> (ha, lekin ClearanceProbe qizil — usti boʻsh
            emas), <B>WallProbe devorni topganmi?</B> (ha, lekin <K>dot(normal, right) = −0.28</K>,{" "}
            yaʼni −0.35 chegarasidan oʻtmagan). Bu uch holat butun “sakramaydi” buglarining{" "}
            <B>90%</B> ini tashkil qiladi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 8.4 */}
      <Sub id="8-4" num="8.4" title="Tugmalar va konsol buyruqlari" hint="Klaviatura birinchi">
        <P>
          Qoida: <B>hech qanday sozlama sichqoncha talab qilmasin</B>. Har bir panel va har bir
          tuning amali bitta tugma yoki bitta konsol buyrugʻi bilan bajariladi. Funksiya tugmalari
          oʻyin bindlaridan mustaqil rezervatsiya qilingan.
        </P>

        <Table
          columns={[
            { key: "k", label: "Tugma" },
            { key: "a", label: "Amali" },
            { key: "n", label: "Izoh" },
          ]}
          compact
          rows={[
            [<K key="f1">F1</K>, "HUD darajasini aylantirish (L0 → L1 → L2 → L3 → L0)", "Eng koʻp ishlatiladigan tugma"],
            [<K key="f2">F2</K>, "Speed Graph panelini alohida yoqish/oʻchirish", "L1 dan mustaqil"],
            [<K key="f3">F3</K>, "Dunyo chizmalari: probe → splines → volumes → hammasi", "Sikl tartibida"],
            [<K key="f4">F4</K>, "Reachability yoyini koʻrsatish (oldinga prognoz)", "Qoʻnish nuqtasi bilan"],
            [<K key="f5">F5</K>, "Retention log va telemetriya panelini ochish", "8.5 bilan birga"],
            [<K key="f6">F6</K>, "Telemetriya yozuvini boshlash / toʻxtatish", "Yozuv indikatori yonadi"],
            [<K key="f7">F7</K>, "Ghost saqlash / solishtirish rejimi", "Ikkita ghost yonma-yon"],
            [<K key="f8">F8</K>, "Erkin kamera + vaqt masshtabi 0.1× (slow-mo)", "Harakatni sekin tahlil qilish"],
            [<K key="f9">F9</K>, "Fizikani muzlatish; qadam <K>.</K> va <K>,</K> bilan", "Kadrma-kadr tahlil"],
            [<K key="f10">F10</K>, "Tuning DataAssetʼini qayta yuklash", "Kod qayta kompilyatsiyasiz"],
            [<K key="f11">F11</K>, "Deterministik qayta oʻynash: oxirgi 10 sekund", "Bugni takrorlash uchun"],
            [<K key="f12">F12</K>, "Bot panelini yoqish (SplineBot holati)", "8.6 bilan birga"],
          ]}
          caption="Jadval 8.4 — Funksiya tugmalari. Barchasi qayta tayinlanadi (remap), lekin boʻsh slot yoʻq."
        />

        <CodeBlock
          file="spire.console — buyruq katalogi"
          tone="tracer"
          code={`// ---- Tuning ----
spire.tune JumpVelocity 6.60          // bir paramni o'zgartirish
spire.tune GravityScale 2.05 --dry    // natijani chop etadi, qo'llamaydi
spire.diff                            // standart qiymatlardan farqni ko'rsatadi
spire.preset standard                 // standard | assisted | hardcore
spire.save MovementTuning_v14         // DataAsset'ga yozadi

// ---- Debug ----
spire.hud 2                           // L2 darajasini yoqish
spire.probe Ground on                 // alohida probeni majburiy ko'rsatish
spire.coyote 0.25                     // vaqtincha "adolat" oynasini cho'zish (test)
spire.flow.lock                       // Flow holatini majburan ushlab turish
spire.godspeed 15                     // tezlikni qulflash (chegara testi)
spire.trace.budget                    // probe vaqtini 100 kadr o'rtacha

// ---- Marshrut / bot ----
spire.route R-014 replay              // marshrutni qayta o'ynash
spire.bot R-014 --runs=20 --hud=2     // bot 20 marta yuguradi
spire.bot.heatmap                     // muvaffaqiyatsizlik nuqtalarini chizadi

// ---- Telemetriya ----
spire.telemetry start best-line
spire.telemetry stop
spire.telemetry.dump flows            // Flow uzilish nuqtalarini yig'adi
spire.telemetry.report                // friction top-10 ro'yxati

// ---- Tekshiruv ----
spire.validate.assets                 // data asset sxemalarini tekshirish
spire.validate.routes R-0*            // marshrutlar balansini hisoblash
spire.shipcheck                       // shipping build "tozaligi" auditi (8.7)`}
        />

        <Panel className="border-l-2 border-l-tracer">
          <PanelTitle tone="tracer">Tipik tuning sessiyasi (12 daqiqa)</PanelTitle>
          <Steps
            items={[
              {
                title: "0:00 · Muammoni uch o'lchamda qayd qilish",
                body: (
                  <span>
                    <K>spire.hud 2</K> → Speed Graph va Retention Log yoqiladi. Muammo halokatga
                    bir marta yuguriladi.
                  </span>
                ),
              },
              {
                title: "0:40 · Sababni panelda topish",
                body: (
                  <span>
                    Retention Log shuni koʻrsatadi: “Vault ×0.92 → keyin darhol Mantle ×0.70”.
                    Yaʼni oʻyinchi Vault oʻrniga Mantleʼga tushgan — toʻsiq balandligi chegarada
                    (1.25 m).
                  </span>
                ),
              },
              {
                title: "3:00 · Gipotezani tekshirish",
                body: (
                  <span>
                    <K>spire.probe Vault on</K> → toʻsiq balandligi 1.31 m ekani koʻrinadi. Demak
                    muammo parametrda emas, <B>level geometriyasida</B> (0.06 m farq).
                  </span>
                ),
              },
              {
                title: "5:00 · Qarorni ajratish",
                body: (
                  <span>
                    Ikki variant: (a) <K>spire.tune VaultMaxHeight 1.35</K> — global oʻzgarish;
                    (b) leveldagi toʻsiqni 1.20 m ga tushirish. Qoida: <B>avval level, keyin kod</B>{" "}
                    — chunki global parametr boshqa 200 marshrutga taʼsir qiladi.
                  </span>
                ),
              },
              {
                title: "9:00 · Tasdiqlash",
                body: (
                  <span>
                    <K>spire.bot R-014 --runs=20</K> → bot 20/20 marta muammosiz oʻtdi.{" "}
                    <K>spire.diff</K> → boshqa parametr oʻzgargani yoʻq. Yozuv: telemetriya fayli +
                    HUD skrinshoti (L2).
                  </span>
                ),
              },
            ]}
          />
        </Panel>
      </Sub>

      {/* ------------------------------------------------------------ 8.5 */}
      <Sub id="8-5" num="8.5" title="Telemetriya va friction tahlili" hint="HUD → maʼlumot → qaror">
        <P>
          HUD — real vaqt uchun, telemetriya esa <B>tahlil</B> uchun. Ikkisi bir xil manbadan
          oziqlanadi: HUD koʻrsatadigan har bir qiymat telemetriya yozuvida ham mavjud boʻlishi
          shart. Aks holda “ekranda koʻrdim, lekin isbotlay olmayman” holati yuzaga keladi.
        </P>

        <Table
          columns={[
            { key: "g", label: "Guruh" },
            { key: "f", label: "Maydonlar" },
            { key: "t", label: "Tip" },
          ]}
          compact
          rows={[
            [
              "Frame",
              [<K key="1">t</K>, " · ", <K key="2">frame</K>, " · ", <K key="3">build</K>, " · ", <K key="4">zone</K>, " · ", <K key="5">route</K>].map((x, i) => (
                <span key={i}>{x}</span>
              )),
              "header",
            ],
            ["Kinematics", [<K key="1">pos.x/y/z</K>, " · ", <K key="2">vel</K>, " · ", <K key="3">speed</K>, " · ", <K key="4">yaw/pitch</K>].map((x, i) => <span key={i}>{x}</span>), "float32×6"],
            ["State", [<K key="1">state</K>, " · ", <K key="2">stateTime</K>, " · ", <K key="3">flags</K>, " · ", <K key="4">lastPrio</K>].map((x, i) => <span key={i}>{x}</span>), "enum + u8"],
            ["Assist", [<K key="1">coyoteTimer</K>, " · ", <K key="2">bufferTimer</K>, " · ", <K key="3">snapDelta</K>].map((x, i) => <span key={i}>{x}</span>), "float32×3"],
            ["Economy", [<K key="1">kc</K>, " · ", <K key="2">flow</K>, " · ", <K key="3">flowTimer</K>, " · ", <K key="4">stacks</K>].map((x, i) => <span key={i}>{x}</span>), "float32×4"],
            ["Probes", [<K key="1">ground</K>, " · ", <K key="2">wallL</K>, " · ", <K key="3">wallR</K>, " · ", <K key="4">vaultH</K>, " · ", <K key="5">clearance</K>, " · ", <K key="6">traceMs</K>].map((x, i) => <span key={i}>{x}</span>), "bitfield + f32"],
            ["Audio", [<K key="1">intensity</K>, " · ", <K key="2">bpm</K>, " · ", <K key="3">layers</K>, " · ", <K key="4">breathRate</K>].map((x, i) => <span key={i}>{x}</span>), "f32 + mask"],
            ["Perf", [<K key="1">cpuMs</K>, " · ", <K key="2">frameMs</K>, " · ", <K key="3">draws</K>, " · ", <K key="4">tris</K>].map((x, i) => <span key={i}>{x}</span>), "f32 + u32"],
          ]}
          caption="Jadval 8.5 — Har bir sample (60 Hz, JSONL). Oʻlcham: ~380 bayt / sample ≈ 23 KB / sekund."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="label-mono mb-3 text-alarm">Hodisa oqimi (event stream)</p>
            <Table
              columns={[
                { key: "e", label: "Hodisa" },
                { key: "d", label: "Yoziladigan maʼlumot" },
              ]}
              compact
              rows={[
                ["vault", "kirish tezligi, toʻsiq balandligi, davomiylik"],
                ["mantle", "qirra balandligi, kirish/chiqish tezligi"],
                ["roll / hard_land", "impact v, balandlik, lock davomiyligi"],
                ["snag", "davomiylik, assist ishladi/ishlamadi, pozitsiya"],
                ["flow_break", "sabab (speed / hard_land / detected), uzilish nuqtasi"],
                ["kc_spend", "qobiliyat nomi, narx, oldingi/keyingi KC"],
                ["link", "ikkita harakat orasidagi Δt, bonus"],
                ["void_fall", "tushish balandligi, qayta tiklash nuqtasi, yoʻqotilgan vaqt"],
                ["detected", "dron id, masofa, konus burchagi, Heat qiymati"],
                ["wall_retry", "bir joyda ketma-ket urinishlar soni (≥3 → friction)"],
              ]}
              caption="Jadval 8.6 — Hodisalar. “friction” tahlilining xom materiali."
            />
          </div>
          <div>
            <p className="label-mono mb-3 text-tracer">Friction top-10 — asosiy hisobot</p>
            <Panel>
              <p className="text-sm leading-relaxed">
                Telemetriya yozuvlari avtomatik yigʻiladi va har hafta <B>friction hisoboti</B>{" "}
                chiqadi: oʻyinchilar eng koʻp qayerda toʻxtaydi. Hisobot level dizayneriga{" "}
                <B>nuqta koordinatalari</B> bilan beriladi, umumiy gap bilan emas.
              </p>
              <div className="mt-4 space-y-2 font-mono text-[11.5px]">
                {[
                  ["01", "R-014", "Z2", "x 412, y 88, z −1204", "3 retry / 20 yugurish"],
                  ["02", "R-031", "Z3", "x 988, y 44, z −870", "2 retry / 20 yugurish"],
                  ["03", "R-007", "Z1", "x −210, y 12, z −455", "2 retry / 20 yugurish"],
                ].map((row) => (
                  <div key={row[0]} className="flex flex-wrap gap-x-3 border-b border-line-soft/60 pb-2 last:border-0">
                    <span className="text-flux">{row[0]}</span>
                    <span className="text-chalk">{row[1]}</span>
                    <span className="text-slag">{row[2]}</span>
                    <span className="text-mist">{row[3]}</span>
                    <span className="ml-auto text-hazard">{row[4]}</span>
                  </div>
                ))}
              </div>
              <p className="label-mono mt-4 text-slag">
                Mezon: 20 yugurishda ≥ 2 marta urinish = friction nuqtasi → level qayta koʻriladi.
              </p>
            </Panel>
          </div>
        </div>

        <Callout tone="neutral" label="Maxfiylik va etika" title="Telemetriya faqat dev va ruxsatli playtest">
          <p>
            Telemetriya <B>faqat</B> ichki buildlarda va ochiq rozilik olgan playtest sessiyalarida
            yoqiladi. Yozuvda shaxsni aniqlovchi maʼlumot yoʻq (faqat anonim sessiya ID). Shipping
            buildda telemetriya kodi umuman mavjud emas (8.7) — bu ham xavfsizlik, ham ishonch
            masalasi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 8.6 */}
      <Sub id="8-6" num="8.6" title="SplineBot integratsiyasi" hint="HUD botni ham koʻrsatadi">
        <P>
          5.8-boʻlimdagi <K>SplineBot</K> avtomatik QA tizimi HUD bilan bir xil maʼlumot kanalidan
          foydalanadi. Bot ham <B>toʻliq qatnashchi</B>: uning holati, tezligi va xato sababi xuddi
          oʻyinchiniki kabi koʻrsatiladi. Shu sabab bugni <B>bot yugurishida</B> ham tahlil qilish
          mumkin.
        </P>

        <Table
          columns={[
            { key: "p", label: "Bot paneli maydoni" },
            { key: "d", label: "Maʼnosi" },
          ]}
          compact
          rows={[
            ["waypoint", "Joriy nishon nuqtasi indeksi (spline ustida)"],
            ["deviation", "Splinedan ogʻish, metrda — 2.0 m dan oshsa “drift” belgisi"],
            ["retry", "Shu segmentda ketma-ket urinishlar soni (≥ 3 → level bug)"],
            ["failReason", "Bevosita sabab: NO_PATH · TOO_LOW_SPEED · PROBE_MISS · BLOCKED · VOID"],
            ["trajectory", "Botning oxirgi 2 sekunddagi tezlik grafigi (oʻyinchi grafigi bilan bir oʻqda)"],
            ["deltaVsPar", "Par vaqtga nisbatan farq, segment boʻyicha"],
          ]}
          caption="Jadval 8.7 — Bot paneli. Xato sababi kod darajasida yoziladi — “bot qandaydir sababdan oʻtolmadi” degan yozuv taqiqlanadi."
        />

        <Callout tone="hazard" label="Regressiya testi" title="HUD skrinshoti ham regressiya qilinadi">
          <p>
            Har kecha SplineBot yugurishida <B>HUD L2 skrinshoti</B> olinadi va oldingi build
            bilan piksel-diff qilinadi (tolerantlik 2%). Sabab: agar paneldagi raqamlar keskin
            oʻzgargan boʻlsa (masalan, coyote taymeri koʻrinmay qolsa) — bu kod regressiyasi,
            garchi marshrut oʻtilsa ham. Shuning uchun HUD joylashuvi va shrift oʻlchamlari{" "}
            <B>qatʼiy belgilangan</B> (T3 tamoyili).
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 8.7 */}
      <Sub id="8-7" num="8.7" title="Ship xavfsizligi" hint="Debug kod shipping buildga chiqmaydi">
        <P>
          Bu — boʻlimning eng muhim qismi. Debug HUD <B>nazoratsiz</B> qolsa: (1) performance
          yoʻqoladi, (2) <K>spire.</K> konsol buyruqlari orqali oʻyin buziladi, (3) anti-cheat
          zaiflashadi. Shuning uchun himoya uch qatlamli.
        </P>

        <CodeBlock
          file="ship_safety.txt — uch qatlamli himoya"
          tone="alarm"
          code={`// ---- 1-QATLAM: kompilyatsiya bayrog'i ----
#define SPIRE_WITH_DEBUG_HUD  (UE_BUILD_SHIPPING == 0)
#if SPIRE_WITH_DEBUG_HUD
    DrawDebugHud(Dt);
    Traversal->DrawProbes();
#endif
// Shipping'da bu blok umuman kompilyatsiya qilinmaydi -> 0 bayt, 0 ms

// ---- 2-QATLAM: konsol buyruqlari ro'yxatga olinmaydi ----
#if !UE_BUILD_SHIPPING
    FAutoConsoleCommand CmdTune(TEXT("spire.tune"), ...);
    FAutoConsoleCommand CmdBot (TEXT("spire.bot"),  ...);
#endif
// Shipping buildda "spire." prefiksi bilan hech qanday buyruq mavjud emas

// ---- 3-QATLAM: CI avtomatik auditi (har build) ----
//  a) strings <binary> | grep -c "spire\\."  -> 0 bo'lishi shart
//  b) HUD yoqilgan build vs o'chirilgan build CPU farqi <= 0.05 ms
//  c) telemetriya yozuv funksiyasi binary'da mavjud emasligi tekshiriladi
//  d) DrawDebug* chaqiruvlari ship buildda nolga teng (nm/objdump bilan)

// ---- Qo'shimcha: "debug-only" ma'lumotlar ----
// Ghost fayllari, telemetriya, tuning dump — bular Shipping'da
// hech qanday yo'l bilan yozilmaydi (fayl tizimi ham chaqirilmaydi).`}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="alarm">Nima taqiqlanadi</PanelTitle>
            <Bullets
              tone="alarm"
              items={[
                <>
                  Runtimeʼda <K>if (bDebug)</K> tekshiruvi bilan qoldirilgan debug chizmalar —
                  faqat kompilyatsiya bayrogʻi.
                </>,
                <>
                  Shippingʼda roʻyxatdan oʻtadigan konsol buyruqlari (hatto “oʻchirilgan” holatda
                  ham).
                </>,
                <>
                  HUD matnini <B>lokalizatsiya tizimiga</B> qoʻshish — u hech qachon tarjima
                  qilinmaydi va qilinmasligi kerak.
                </>,
                <>
                  Debug HUDʼga tayangan <B>oʻyin mexanikasi</B> (masalan, qoʻnish nuqtasini
                  koʻrsatish) — bu oʻyin dizaynining ishi, asbobning emas.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="tracer">Shippingʼda nima qoladi</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                "Yuqori darajali “stat” tizimi (faqat dev buildda koʻrinadi, lekin kod mavjud)",
                "Accessibility uchun vizual audio indikatori (oʻyinchi sozlamasida)",
                "Foto rejim / replay HUD (oʻyin elementlari, debug emas)",
                "Konsol: faqat <K>help</K>, <K>quit</K>, <K>r.screenpercentage</K> kabi xavfsizlari",
              ]}
            />
          </Panel>
        </div>

        <Callout tone="flux" label="Tekshiruv buyrug'i" title="spire.shipcheck">
          <p>
            Har bir release candidate <K>spire.shipcheck</K> orqali oʻtadi. U toʻrt narsani
            tekshiradi va natijani CI logiga yozadi: (1) shipping binaryda <K>spire.</K> buyruq
            yoʻqligi, (2) HUD kodining kompilyatsiyadan chiqarilgani, (3) CPU farqining 0.05 ms dan
            kam ekani, (4) telemetriya yozuv yoʻlining yoʻqligi. <B>Toʻrttasi ham “ha” boʻlmasa —
            build chiqarilmaydi.</B>
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 8.8 */}
      <Sub id="8-8" num="8.8" title="Qabul mezonlari" hint="Definition of Done">
        <Table
          columns={[
            { key: "n", label: "№" },
            { key: "c", label: "Mezon" },
            { key: "v", label: "Oʻlchov" },
          ]}
          compact
          rows={[
            ["1", "CPU narxi (L0 / L2 / L3)", "≤ 0.05 / 0.40 / 0.60 ms"],
            ["2", "Chizma narxi (L3, 1080p)", "≤ 0.15 ms"],
            ["3", "Kadrda ajratilgan xotira", "0 (barcha buferlar oldindan tayyorlangan)"],
            ["4", "Qiymatlar aniqligi", "Runtime bilan 1 kadr ichida mos keladi"],
            ["5", "Har bir panel bitta tugmada", "100% (menyusiz)"],
            ["6", "L3 barcha 5 zonada ishlaydi", "Shuningdek replay va ghost rejimida"],
            ["7", "HUD matni 1080p da 1 m masofada oʻqiladi", "Minimal shrift 8 px mono"],
            ["8", "Tugmalar gameplay bindlari bilan toʻqnashmaydi", "F1–F12 rezervatsiya qilingan"],
            ["9", "SplineBot holati koʻrsatiladi", "Xato sababi kod darajasida"],
            ["10", "Shipping buildda iz qolmaydi", "spire.shipcheck → 4/4 “ha”"],
            ["11", "HUD pozitsiyalari buildʼdan buildʼga oʻzgarmaydi", "Piksel-diff tolerantligi 2%"],
            ["12", "Telemetriya HUD bilan bir xil manbadan", "Har HUD qiymati yozuvda mavjud"],
          ]}
          caption="Jadval 8.8 — Qabul mezonlari. 1–3 va 10 majburiy; qolganlari M2 gateʼidan keyin majburiy."
        />

        <Callout tone="hazard" label="Bogʻliqlik" title="Bu boʻlim qaysi boʻlimlar bilan bogʻlangan">
          <Bullets
            tone="hazard"
            items={[
              <>
                <B>5.1 (State Machine)</B> — HUD holat nomi va oxirgi oʻtish ustuvorligini koʻrsatadi.
              </>,
              <>
                <B>5.2 (Muhit skaneri)</B> — probe chizmalari aynan oʻsha 9 probeni vizuallashtiradi.
              </>,
              <>
                <B>5.3 (Reachability)</B> — yoy chizmalari <K>PredictGap()</K> natijasini koʻrsatadi.
              </>,
              <>
                <B>5.8 (Performance va QA)</B> — SplineBot paneli va telemetriya shu boʻlimda
                kengaytiriladi.
              </>,
              <>
                <B>7.1 (Bosqichlar)</B> — HUD M1 gateʼining bir qismi: hujjatsiz tuning qabul
                qilinmaydi.
              </>,
            ]}
          />
        </Callout>
      </Sub>
    </Section>
  );
}
