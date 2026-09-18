import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SECTIONS } from "../data/nav";

/* --------------------------------------------------------------- primitives */

function Badge({ children, tone = "flux" }: { children: ReactNode; tone?: "flux" | "tracer" | "hazard" }) {
  const map = {
    flux: "border-flux/40 bg-flux/[0.07] text-flux",
    tracer: "border-tracer/40 bg-tracer/[0.06] text-tracer",
    hazard: "border-hazard/40 bg-hazard/[0.06] text-hazard",
  };
  return (
    <span className={`label-mono inline-flex items-center rounded border px-2.5 py-1.5 leading-none ${map[tone]}`}>
      {children}
    </span>
  );
}

function Heading({
  kicker,
  title,
  lead,
  tone = "flux",
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "flux" | "tracer" | "hazard";
}) {
  const color = tone === "flux" ? "text-flux" : tone === "tracer" ? "text-tracer" : "text-hazard";
  return (
    <div className="max-w-3xl">
      <p className={`label-mono ${color}`}>{kicker}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-[70ch] leading-relaxed text-mist">{lead}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ skyline */

const BUILDINGS = [42, 68, 34, 88, 56, 100, 46, 74, 30, 92, 62, 38, 80, 52, 96, 44, 70, 36, 86, 58];

function Skyline() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="mesh-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[46%] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-1.5 px-2 opacity-[0.55]">
          {BUILDINGS.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-ink-700/0 via-ink-700/60 to-ink-600/60"
              style={{ height: `${h * 1.4}px` }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>
      <div className="absolute inset-x-0 top-[38%] h-px bg-gradient-to-r from-transparent via-tracer/60 to-transparent">
        <div className="h-px w-1/3 animate-sweep bg-gradient-to-r from-transparent via-tracer to-transparent" />
      </div>
      <div className="absolute inset-x-0 top-0 h-full opacity-[0.07]">
        <div className="animate-drift h-full w-full bg-[repeating-linear-gradient(0deg,transparent_0_54px,#2FE0C4_54px_56px)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- movement line */

const CHAIN: Array<[string, string, string, number]> = [
  ["01", "Sprint ramp", "11.00 m/s", 11],
  ["02", "Slayd 0.9 s", "×0.90 → 9.90", 9.9],
  ["03", "Vault", "×0.92 → 9.11", 9.11],
  ["04", "Wall Run 1.2 s", "×1.00 → 9.11", 9.11],
  ["05", "Wall Jump", "×1.05 → 9.57", 9.57],
  ["06", "Air Brake 30°", "×0.94 → 9.00", 9.0],
  ["07", "Rail 1.6 s", "→ 11.00 (+2.0)", 11],
  ["08", "Perfect Link + Roll", "×0.92 → 10.44", 10.44],
];

function MovementLine() {
  return (
    <div className="rounded-xl border border-line-soft bg-ink-900/70 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
        <p className="label-mono text-tracer">8 harakatli “toza liniya” · saqlash 95%</p>
        <span className="label-mono text-slag">2.4-boʻlim</span>
      </div>
      <div className="space-y-2.5 p-5">
        {CHAIN.map(([idx, name, value, speed]) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slag">{idx}</span>
            <span className="w-[124px] shrink-0 truncate text-[12.5px] text-chalk">{name}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-750">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-tracer-dim to-tracer"
                style={{ width: `${(speed / 12) * 100}%` }}
              />
            </span>
            <span className="w-[92px] shrink-0 text-right font-mono text-[11.5px] text-mist">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-soft px-5 py-3.5">
        <span className="label-mono text-slag">
          Kirish <span className="text-chalk">11.00 m/s</span>
        </span>
        <span className="label-mono text-slag">
          Chiqish <span className="text-flux">10.44 m/s</span>
        </span>
        <span className="label-mono text-slag">
          Yoʻqotish <span className="text-tracer">5%</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- zones */

const ZONES = [
  { id: "Z0", name: "Kanallar", range: "0 – 80 m", gate: "Run · Jump · Vault" },
  { id: "Z1", name: "Bozor qatlami", range: "80 – 350 m", gate: "Slide · Wall Run" },
  { id: "Z2", name: "Servis / Zavod", range: "350 – 700 m", gate: "Rail · Air Brake" },
  { id: "Z3", name: "Ofis minoralari", range: "700 – 1200 m", gate: "Phase Dash · nur" },
  { id: "Z4", name: "Antenna maydoni", range: "1200 – 1700 m", gate: "Air Step · shamol" },
  { id: "Z5", name: "Shpil", range: "1700 – 2100 m", gate: "Barcha zanjirlar" },
];

function Zones() {
  return (
    <div className="relative rounded-xl border border-line-soft bg-ink-900/60 p-5 md:p-7">
      <div className="absolute inset-y-6 left-[68px] hidden w-px bg-gradient-to-b from-flux via-tracer to-transparent md:block" />
      <ul className="space-y-4">
        {ZONES.map((z, i) => (
          <li key={z.id} className="flex items-start gap-4 md:gap-6">
            <span className="w-10 shrink-0 pt-0.5 font-mono text-[13px] text-flux">{z.id}</span>
            <span className="mt-2 hidden h-1.5 w-1.5 shrink-0 rounded-full bg-tracer md:block" />
            <div className="min-w-0 flex-1 md:flex md:items-baseline md:gap-5">
              <p className="w-44 shrink-0 font-display text-base font-semibold text-chalk">{z.name}</p>
              <p className="w-28 shrink-0 font-mono text-[12px] text-mist">{z.range}</p>
              <p className="label-mono text-slag">{z.gate}</p>
            </div>
            <span className="hidden font-mono text-[11px] text-ink-600 lg:block">
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------- page */

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-950">
      {/* ------------------------------------------------------------ nav */}
      <header className="sticky top-0 z-40 border-b border-line-soft/80 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-5 px-5 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-[3px] border border-flux/60" />
              <span className="h-2.5 w-0.5 bg-flux" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.22em] text-chalk">SPIRELINE</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-7 md:flex">
            <a href="#konsepsiya" className="label-mono text-mist transition-colors hover:text-chalk">
              Konsepsiya
            </a>
            <a href="#mexanika" className="label-mono text-mist transition-colors hover:text-chalk">
              Mexanika
            </a>
            <a href="#tuzilma" className="label-mono text-mist transition-colors hover:text-chalk">
              Hujjat tuzilmasi
            </a>
          </nav>
          <Link
            to="/hujjat"
            className="label-mono ml-auto rounded border border-flux/50 bg-flux/[0.08] px-3.5 py-2 text-flux transition-colors hover:bg-flux/20 md:ml-0"
          >
            Hujjatni ochish
          </Link>
        </div>
      </header>

      {/* ----------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-line-soft">
        <Skyline />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-20 pb-24 md:px-8 md:pt-28">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="animate-rise">
              <Badge>Parkour o'yini · Konsepsiya va texnik hujjat</Badge>
              <h1 className="mt-7 font-display text-[3.4rem] leading-[0.9] font-bold tracking-tight text-chalk md:text-[5.5rem]">
                SPIRELINE
              </h1>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-mist">
                2087-yil. <span className="text-chalk">Kaskad</span> — ikki kilometr balandlikka
                qurilgan vertikal megapolis. Siz Liniya Kuryerisiz va{" "}
                <span className="text-chalk">harakat — yagona qurolingiz</span>.
              </p>
              <p className="mt-5 max-w-[62ch] leading-relaxed text-mist/90">
                Tezlik pul birligi, xato — oʻlim emas, narx. Bu hujjat oʻyinni noldan ishlab
                chiqarish uchun zarur boʻlgan barcha parametr, qoida va arxitekturani oʻz ichiga
                oladi.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/hujjat"
                  className="label-mono rounded bg-flux px-6 py-3.5 text-ink-950 transition-transform hover:-translate-y-0.5"
                >
                  To'liq hujjatni ochish
                </Link>
                <a
                  href="#mexanika"
                  className="label-mono rounded border border-line px-6 py-3.5 text-mist transition-colors hover:border-tracer/50 hover:text-tracer"
                >
                  Harakat tizimini ko'rish
                </a>
              </div>

              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
                {[
                  ["8", "boʻlim"],
                  ["41", "texnik parametr"],
                  ["0", "Game Over ekrani"],
                  ["4", "dizayn ustuni"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-mono text-2xl font-semibold text-chalk">{v}</dt>
                    <dd className="label-mono mt-1.5 text-slag">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-rise" style={{ animationDelay: "120ms" }}>
              <MovementLine />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ konsepsiya */}
      <section id="konsepsiya" className="border-b border-line-soft">
        <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-24">
          <Heading
            kicker="01 · Core Fantasy"
            title="Oʻyinchi oʻzini kim deb his qiladi"
            lead="Core fantasy — marketing shiori emas, balki har bir kadr tasdiqlanishi kerak boʻlgan vaʼda. Bizning vaʼda: “Men bu shaharda toʻxtamaydigan yagona narsaman.”"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "I",
                t: "Kinestetik erkinlik",
                d: "Shahar passiv fon emas — u sizning maydonchangiz. Har bir qirra va quvur potensial harakat nuqtasi.",
                m: "≥ 1 harakat nuqtasi / 6 m",
              },
              {
                n: "II",
                t: "Koʻrinmas, ammo qoʻlga tushmas",
                d: "Sizni koʻradilar va kuzatadilar, lekin ushlay olmaydilar. Bosim bor — oʻlim yoʻq.",
                m: "Heat tizimi · jarima, oʻlim emas",
              },
              {
                n: "III",
                t: "Ustalik isboti",
                d: "Har yugurishdan keyin “yana bir marta” hissi. Bu tasodif emas — bu oʻlchanadigan natija.",
                m: "Line Grade S · R ≥ 0.60",
              },
            ].map((card, i) => (
              <article
                key={card.n}
                className="group rounded-xl border border-line-soft bg-ink-900/50 p-6 transition-colors hover:border-line hover:bg-ink-900"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-4xl font-semibold text-ink-600 transition-colors group-hover:text-ink-600">
                    {card.n}
                  </span>
                  <span className="font-mono text-[11px] text-slag">{String(i + 1).padStart(2, "0")}/03</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-chalk">{card.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{card.d}</p>
                <p className="label-mono mt-6 border-t border-line-soft pt-4 text-tracer-dim">{card.m}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-8 rounded-xl border border-line-soft bg-ink-900/40 p-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-9">
            <div>
              <Badge tone="hazard">Anti-fantasy</Badge>
              <h3 className="mt-5 font-display text-2xl font-semibold text-chalk">
                Oʻyinchi his qilmasligi shart
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Superqahramon emas. Qotil emas. Qurbon emas. Har bir ajoyib harakat ortida
                oʻyinchining aniq qarori turishi kerak.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Ikki marta sakrash yoʻq, uchish yoʻq, kuch maydoni yoʻq",
                "Qurollar, oʻldirish va toʻqnashuv yoʻq — faqat aylanib oʻtish",
                "Kamera hech qachon nazoratni tortib olmaydi (0.4 sekunddan ortiq)",
                "Tabiat tanlagani yoʻq: harakat = qaror natijasi",
              ].map((item) => (
                <li key={item} className="flex gap-3.5 rounded-lg border border-line-soft/70 bg-ink-950/60 p-3.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-alarm" />
                  <span className="text-mist">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- mexanika */}
      <section id="mexanika" className="border-b border-line-soft">
        <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-24">
          <Heading
            kicker="02 · Uchta USP"
            tone="tracer"
            title="Nega aynan bu parkur oʻyini"
            lead="Uchta tizim birgalikda koʻchirib boʻlmaydigan yadroni tashkil qiladi: tezlik resursga, xato narxga, yoʻl esa tushunarli tilga aylanadi."
          />

          <div className="mt-12 space-y-5">
            {[
              {
                tag: "USP 1",
                tone: "flux" as const,
                title: "Kinetik Zaryad — tezlik pul birligi sifatida",
                points: [
                  "Yugurish, slayd, devor yugurishi va xavfli qoʻnishlar KC ishlab chiqaradi",
                  "KC: Air Brake (−10) · Impact Break (−30) · Phase Dash (−25) · Surge (−40)",
                  "Toʻxtash — eng qimmat xatti-harakat: sekundiga −8 KC",
                  "Maksimal tiklash 10.8 / sek → Surge 3.7 sekund xolis harakat talab qiladi",
                ],
              },
              {
                tag: "USP 2",
                tone: "tracer" as const,
                title: "Fail-Forward — xato oʻlim emas, narx",
                points: [
                  "Hard Landing: 0.9 sek blok, KC −15 — lekin hayot yoʻqolmaydi",
                  "Snag Assist: 0.4 sek harakatsizlik → avtomatik Mantle",
                  "Chasm Catch: chuqurlikka tushish 1.5 sekundda tiklаnadi",
                  "Har xatoning narxi 3–5 sekund, tuzatish yoʻli 2 sekunddan tez",
                ],
              },
              {
                tag: "USP 3",
                tone: "hazard" as const,
                title: "Tracer Language — UIʼsiz yoʻl tili",
                points: [
                  "FLUX #FF6A1F — harakat nuqtasi (faqat ishlaydigan qirralar)",
                  "TRACER #2FE0C4 — marshrut oqimi (doim harakatlanadi)",
                  "HAZARD #FFC53D — xatarli element, VOID #05070A — oʻlim zonasi",
                  "Yangi hudud 4 sekund ichida oʻqiladi — matn ham, marker ham yoʻq",
                ],
              },
            ].map((usp) => (
              <article
                key={usp.tag}
                className="grid gap-6 rounded-xl border border-line-soft bg-ink-900/50 p-6 md:grid-cols-[240px_minmax(0,1fr)] md:p-8"
              >
                <div>
                  <Badge tone={usp.tone}>{usp.tag}</Badge>
                  <h3 className="mt-5 font-display text-xl leading-snug font-semibold text-chalk">
                    {usp.title}
                  </h3>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {usp.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed">
                      <span
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                          usp.tone === "flux" ? "bg-flux" : usp.tone === "tracer" ? "bg-tracer" : "bg-hazard"
                        }`}
                      />
                      <span className="text-mist">{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["7.5 / 11.0", "Yugurish / sprint (m/s)"],
              ["0.120 / 0.150", "Coyote / Buffer (s)"],
              ["90° → 102°", "FOV dinamikasi"],
              ["84 → 132", "Adaptiv musiqa BPM"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-line-soft bg-ink-900/50 p-5">
                <p className="font-mono text-lg font-semibold text-chalk">{v}</p>
                <p className="label-mono mt-2 text-slag">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- zonas */}
      <section className="border-b border-line-soft">
        <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-24">
          <Heading
            kicker="Level dizayni"
            tone="hazard"
            title="Kaskad vertikali — 0 dan 2100 metrgacha"
            lead="Har bir zona yangi toʻsiq va bitta yangi harakat ochadi. Kognitiv yuklama cheklangan: bir vaqtda faqat bitta yangi tushuncha."
          />
          <div className="mt-12">
            <Zones />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- tuzilma */}
      <section id="tuzilma" className="border-b border-line-soft">
        <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-24">
          <Heading
            kicker="Hujjat tuzilmasi · 8 boʻlim"
            title="Sakkiz boʻlim, bir manba"
            lead="Hujjat studiya ichida yagona haqiqat manbai sifatida ishlatiladi. Har boʻlim oʻz auditoriyasiga qaratilgan va amaliy natija beradi."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Link
                key={section.id}
                to="/hujjat"
                className="group flex flex-col rounded-xl border border-line-soft bg-ink-900/50 p-5 transition-colors hover:border-flux/40 hover:bg-ink-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-flux">{section.index}</span>
                  <span className="label-mono text-[10px] text-slag">{section.subs.length} kichik boʻlim</span>
                </div>
                <h3 className="mt-4 font-display text-base leading-snug font-semibold text-chalk">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-1.5">
                  {section.subs.slice(0, 4).map((sub) => (
                    <li key={sub.id} className="flex gap-2 text-[13px] text-slag">
                      <span className="font-mono text-[11px] text-ink-600">{sub.num}</span>
                      <span className="truncate">{sub.label}</span>
                    </li>
                  ))}
                  {section.subs.length > 4 ? (
                    <li className="label-mono pt-1 text-[10px] text-ink-600">
                      +{section.subs.length - 4} ta yana
                    </li>
                  ) : null}
                </ul>
                <span className="label-mono mt-5 text-slag transition-colors group-hover:text-flux">
                  Ochish →
                </span>
              </Link>
            ))}

            <div className="flex flex-col justify-between rounded-xl border border-flux/40 bg-gradient-to-br from-flux/[0.10] to-ink-900/60 p-5">
              <div>
                <span className="label-mono text-flux">Tezkor varaq</span>
                <h3 className="mt-4 font-display text-base font-semibold text-chalk">
                  Butun tuning bir sahifada
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-mist">
                  Barcha “sehrli sonlar”: sakrash, coyote, retention, KC, FOV, BPM va beshta
                  hal qiluvchi qoida.
                </p>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["1.05 m", "Sakrash"],
                  ["0.655 s", "Havo vaqti"],
                  ["5.5 m", "Gap"],
                  ["×0.92", "Vault"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-mono text-sm text-chalk">{v}</dt>
                    <dd className="label-mono text-[10px] text-slag">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden">
        <div className="mesh-grid absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-[1240px] px-5 py-24 text-center md:px-8 md:py-28">
          <Badge>Hujjat v1.4 · 18.09.2026 · Ichki · NDA</Badge>
          <h2 className="mx-auto mt-7 max-w-3xl font-display text-3xl leading-tight font-semibold text-chalk md:text-5xl">
            Toʻliq hujjatni oching
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-mist">
            Har bir parametr, formula, state machine sxemasi, level metrikasi va audio xaritasi —
            bir joyda, chop etishga tayyor koʻrinishda.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/hujjat"
              className="label-mono rounded bg-flux px-7 py-4 text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              SPIRELINE GDD ni ochish
            </Link>
            <Link
              to="/hujjat"
              className="label-mono rounded border border-line px-7 py-4 text-mist transition-colors hover:border-tracer/50 hover:text-tracer"
            >
              Interaktiv kalkulyatorlar
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line-soft">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-[3px] border border-flux/60" />
              <span className="h-2 w-0.5 bg-flux" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.22em] text-chalk">SPIRELINE</span>
          </div>
          <p className="label-mono text-slag">
            Parkour Oʻyini Konsepsiyasi va Texnik Hujjati · Maxfiy · Nusxalash taqiqlanadi
          </p>
        </div>
      </footer>
    </div>
  );
}
