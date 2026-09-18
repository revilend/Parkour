import {
  B,
  Bullets,
  Callout,
  Chip,
  Lead,
  Metrics,
  P,
  Panel,
  PanelTitle,
  Section,
  Sub,
  Table,
} from "../components/ui";

export default function S7Production() {
  return (
    <Section
      id="ishlab-chiqarish"
      index="07"
      kicker="Boʻlim 07 · Ishlab chiqarish"
      title="Reja, Jamoa va Xatarlar"
    >
      <Lead>
        Harakat tizimi — bu loyihaning <B>eng qimmat va eng xatarli</B> qismi. U toʻgʻri chiqmasa,
        qolgan hamma narsa (art, level, audio) maʼnosiz boʻladi. Shu sabab ishlab chiqarish rejasi{" "}
        <B>“feel-first”</B> tamoyiliga qurilgan: avval harakat, keyin hamma narsa.
      </Lead>

      {/* ------------------------------------------------------------ 7.1 */}
      <Sub id="7-1" num="7.1" title="Bosqichlar" hint="22 oy, 6 gate">
        <Table
          columns={[
            { key: "m", label: "Bosqich" },
            { key: "d", label: "Davomiylik", align: "right" },
            { key: "g", label: "Maqsad" },
            { key: "e", label: "Chiqish mezoni (gate)" },
          ]}
          compact
          rows={[
            [
              "M0 · Concept",
              "4 hafta",
              "Hujjat, blockout kit, Tracer Language art testi",
              "Game Director + Tech Director imzosi",
            ],
            [
              "M1 · Movement Prototype",
              "10 hafta",
              "“Grey Box Gym” — faqat harakat, 1 qahramon, 1 sirt",
              <>
                <Chip tone="hazard">Feel Index ≥ 5.5 / 7</Chip>
              </>,
            ],
            [
              "M2 · Vertical Slice",
              "16 hafta",
              "1 zona, 3 marshrut, art direction, adaptiv audio prototipi",
              <>
                <Chip tone="hazard">Tashqi playtest: 80% tugatadi</Chip>
              </>,
            ],
            [
              "M3 · Alpha",
              "24 hafta",
              "5 zona, 60% marshrut, Skill Tree, Line Grade, ghost",
              "Barcha tizimlar “content-complete”",
            ],
            [
              "M4 · Beta",
              "20 hafta",
              "100% kontent, telemetriya asosida tuning, optimizatsiya",
              "60 FPS barqaror (min. spec), Feel Index ≥ 5.8",
            ],
            [
              "M5 · Launch + post",
              "12 hafta",
              "Launch, Workshop muharriri, mavsumiy Shift tizimi",
              "D1 retention ≥ 35%, D7 ≥ 14%",
            ],
          ]}
          caption="Jadval 7.1 — Ishlab chiqarish bosqichlari (jami ~22 oy). Qizil gateʼlar — loyiha toʻxtatilishi mumkin boʻlgan nuqtalar."
        />

        <Callout tone="alarm" label="Kritik qoida" title="M1 gate — “feature creep” toʻsigʻi">
          <p>
            Harakat hissi (Feel Index) 5.5 dan oshmaguncha <B>hech qanday</B> yangi xususiyat
            qoʻshilmaydi: na hikoya, na jang, na ochiq dunyo, na onlayn. Bu qoida yozma ravishda
            Producer tomonidan nazorat qilinadi. Loyihalarning 70% i aynan shu bosqichda
            “chalgʻish” sababli barbod boʻladi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 7.2 */}
      <Sub id="7-2" num="7.2" title="Jamoa va rollar" hint="Peak: 32 kishi">
        <Table
          columns={[
            { key: "r", label: "Rol" },
            { key: "n", label: "Soni", align: "right" },
            { key: "d", label: "Asosiy masʼuliyat" },
          ]}
          compact
          rows={[
            ["Game Director", "1", "Vizyon, ustunlar, ustuvorlik qarorlari"],
            [
              <>
                <B>Lead Game Designer (Movement)</B>
              </>,
              "1",
              "Harakat tizimi, tuning, Feel Index egasi — eng muhim rol",
            ],
            ["Level Designers", "4", "Blockout metrikasi, Tracer Language, marshrutlar"],
            [
              <>
                <B>Technical Director</B>
              </>,
              "1",
              "State Machine, probe tizimi, network, byudjet",
            ],
            ["Gameplay Programmers", "3", "Harakat kod, qobiliyatlar, replay/ghost"],
            ["Engine/Tools Programmer", "1", "Tuning vositasi, debug HUD, SplineBot"],
            ["Animators (FPP)", "2", "Qoʻl IK, root motion, procedural tuzatish"],
            ["Technical Artist", "2", "Tracer materiallar, VFX, shader, perf"],
            ["Environment Artists", "5", "5 zona arxitekturasi, Nanite asset"],
            ["VFX Artist", "1", "Harakat VFX, ekran effektlari"],
            ["Audio Designer", "2", "Foley, adaptiv tizim, miks"],
            ["Composer", "1", "4 stemlik adaptiv saundtrek (5 zona)"],
            ["UI/UX Designer", "1", "Minimal HUD, Grade ekrani, sozlamalar"],
            ["QA Testers", "3", "SplineBot natijalari, feel testlar, regressiya"],
            ["Producer", "1", "Gate nazorati, scope himoyasi"],
          ]}
          caption="Jadval 7.2 — Jamoa tarkibi (peak). Movement boʻyicha 2 kishi (Lead + TD) loyihaning butun muvaffaqiyatini belgilaydi."
        />
      </Sub>

      {/* ------------------------------------------------------------ 7.3 */}
      <Sub id="7-3" num="7.3" title="Xatar reyestri" hint="Ehtimol × taʼsir">
        <Table
          columns={[
            { key: "r", label: "Xatar" },
            { key: "p", label: "Ehtimol", align: "center" },
            { key: "i", label: "Taʼsir", align: "center" },
            { key: "m", label: "Yumshatish chorasi" },
          ]}
          compact
          rows={[
            [
              "Harakat hissi “toʻgʻri” chiqmaydi",
              "Yuqori",
              "Kritik",
              "M1 da 10 hafta faqat shunga; Feel Index gate; tashqi playtest har 3 haftada",
            ],
            [
              "Kontent hajmi (220 marshrut) yetib borilmaydi",
              "Oʻrta",
              "Yuqori",
              "Protsedural yordamchi generatsiya + Workshop muharriri + segment qayta ishlatish",
            ],
            [
              "Baland tezlikda performance tushadi",
              "Oʻrta",
              "Yuqori",
              "Nanite + HLOD + impostorlar; har sprintda streaming budget 2× zaxira",
            ],
            [
              "Harakat kasalligi (motion sickness)",
              "Oʻrta",
              "Yuqori",
              "FOV 90–102 (keng), silkinishni oʻchirish, head bob slider, roll cheklovi 12°",
            ],
            [
              "Adaptiv musiqa tizimi juda murakkab",
              "Oʻrta",
              "Oʻrta",
              "Faqat 4 qatlam; bar-kvantizatsiya qatʼiy; Wwiseʼda bitta State grafigi",
            ],
            [
              "Speedrun ekspluatlari (cheksiz tezlanish)",
              "Yuqori",
              "Oʻrta",
              "Soft cap drag formulasi; har buildda SplineBot + ekspluat skaneri",
            ],
            [
              "Scope creep (jang, hikoya, open world qoʻshilishi)",
              "Yuqori",
              "Kritik",
              "P1–P4 ustunlari filtri; Gate M1 qoidasi; Producer veto huquqi",
            ],
            [
              "IP/taqqoslash bosimi (Mirrorʼs Edge)",
              "Yuqori",
              "Past",
              "Kommunikatsiya: USP 1–3 ni oldinga chiqarish, “fail-forward” farqini koʻrsatish",
            ],
            [
              "Localization sifat (UZ va boshqalar)",
              "Oʻrta",
              "Past",
              "Matn minimal (oʻyin deyarli matnsiz) — bu tabiiy himoya",
            ],
          ]}
          caption="Jadval 7.3 — Xatar reyestri. Har chorakda qayta koʻrib chiqiladi."
        />

        <Metrics
          items={[
            { value: "22", unit: "oy", label: "Ishlab chiqarish" },
            { value: "32", label: "Peak jamoa" },
            { value: "9", label: "Asosiy xatar" },
            { value: "6", label: "Qaror gate" },
          ]}
        />
      </Sub>

      {/* ------------------------------------------------------------ 7.4 */}
      <Sub id="7-4" num="7.4" title="Tezkor cheat sheet" hint="Bir varaq — butun tuning">
        <P>
          Bu varaqni chop etib, ish stoli yoniga qoʻyish mumkin. Bu — oʻyinning barcha “sehrli
          sonlari”.
        </P>

        <div className="grid gap-5 md:grid-cols-2">
          <Panel className="border-t-2 border-t-tracer">
            <PanelTitle tone="tracer">Harakat</PanelTitle>
            <div className="space-y-1.5 font-mono text-[12px]">
              {[
                ["Yugurish", "7.5 m/s"],
                ["Sprint", "11.0 m/s (ramp 1.2 s)"],
                ["Soft / hard cap", "11.0 / 15.0 m/s"],
                ["Sakrash balandligi", "1.05 m"],
                ["Havo vaqti", "0.655 s"],
                ["Gap (yugurish / sprint)", "4.91 / 7.20 m"],
                ["Standart gap", "5.5 m"],
                ["Slayd", "μ 0.08, 0.45–1.6 s"],
                ["Wall run", "2.2 s, 0.55 m stick"],
                ["Wall jump", "×1.05 (bonus)"],
                ["Vault / Mantle / Roll", "×0.92 / ×0.70 / ×0.92"],
                ["Hard landing", "≥ 14 m/s, ×0.35, 0.9 s"],
              ].map((row) => (
                <div key={row[0]} className="flex justify-between gap-4 border-b border-line-soft/50 pb-1.5 last:border-0">
                  <span className="text-slag">{row[0]}</span>
                  <span className="text-chalk">{row[1]}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-t-2 border-t-flux">
            <PanelTitle tone="flux">Tizimlar</PanelTitle>
            <div className="space-y-1.5 font-mono text-[12px]">
              {[
                ["Coyote / Buffer", "0.120 / 0.150 s"],
                ["Flow kirish", "2.5 s uzluksiz ≥ 4.5 m/s"],
                ["Flow grace", "1.4 s"],
                ["KC maks / tiklash", "100 / 6.0–10.8 per s"],
                ["Surge narxi", "40 KC"],
                ["FOV", "90° → 102° (0.25 s)"],
                ["Devor roll", "12°"],
                ["Kamera silkinishi", "0.30 s soʻnish"],
                ["Musiqa BPM", "84 → 132"],
                ["LPF (tezlik)", "400 Hz → 12 kHz"],
                ["Restart", "0.15 s (R)"],
                ["Ghost", "30 Hz, 9 bayt"],
              ].map((row) => (
                <div key={row[0]} className="flex justify-between gap-4 border-b border-line-soft/50 pb-1.5 last:border-0">
                  <span className="text-slag">{row[0]}</span>
                  <span className="text-chalk">{row[1]}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Callout tone="hazard" label="Besh qoida" title="Har bir bahsni hal qiladigan besh gap">
          <Bullets
            tone="hazard"
            items={[
              <>
                <B>Tezlik — resurs.</B> Har mexanika KC ishlab chiqarishi yoki sarflashi kerak.
              </>,
              <>
                <B>Xato — narx, oʻlim emas.</B> Har xatoning narxi 3–5 sekund, tuzatish yoʻli 2
                sekunddan tez.
              </>,
              <>
                <B>Yoʻl koʻrinadi yoki yoʻq.</B> Agar oʻyinchi 1 sekundda tushunmasa — dizayn
                qaytariladi.
              </>,
              <>
                <B>Uch kanal, bitta xabar.</B> Vizual + audio + mexanik — bir vaqtda.
              </>,
              <>
                <B>“Yana bir marta”.</B> Agar yangi xususiyat qayta oʻynashga chorlamasa — u
                kontent emas, shovqin.
              </>,
            ]}
          />
        </Callout>

        <div className="panel border-l-2 border-l-tracer p-6">
          <p className="label-mono text-tracer">Xulosa</p>
          <p className="mt-3 max-w-[76ch] leading-relaxed text-chalk/90">
            <B>SPIRELINE</B> — bu tezlikni pul birligiga aylantirgan, xatoni jazoga emas narxga
            aylantirgan va yoʻlni matnsiz oʻqitadigan parkur oʻyini. Uning texnik asosi —{" "}
            <B>postura bayroqlariga tayangan HFSM</B>, <B>9 probeli skaner</B>,{" "}
            <B>analitik reachability solver</B> va <B>bar-kvantizatsiyalangan adaptiv audio</B>.
            Uning dizayn asosi esa — toʻrtta ustun: <B>Never Stop, Recoverable, Legible, Risk
            Pays</B>. Shu toʻrtlik buzilmasa, bu oʻyin ishlaydi.
          </p>
        </div>
      </Sub>
    </Section>
  );
}
