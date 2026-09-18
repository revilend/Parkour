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
  Sub,
  Table,
} from "../components/ui";

export default function S4Loop() {
  return (
    <Section
      id="sikl"
      index="04"
      kicker="Boʻlim 04 · Oʻyin iqtisodiyoti"
      title="Oʻyin Sikli va Rivojlanish"
    >
      <Lead>
        Parkur oʻyini “bir marta oʻtib chiqiladigan” boʻlsa — u muvaffaqiyatsiz. Uning butun qiymati{" "}
        <B>qayta oʻynashda</B>. Bu boʻlim oʻyinchining “yana bir marta” deb aytishini matematik
        jihatdan kafolatlaydigan tizimlarni belgilaydi.
      </Lead>

      {/* ------------------------------------------------------------ 4.1 */}
      <Sub id="4-1" num="4.1" title="Sikl qatlamlari" hint="4 ta vaqt masshtabi">
        <Table
          columns={[
            { key: "l", label: "Qatlam" },
            { key: "t", label: "Davomiylik" },
            { key: "c", label: "Tsikl" },
            { key: "r", label: "Mukofot" },
          ]}
          rows={[
            [
              <>
                <Chip tone="tracer">MICRO</Chip>
              </>,
              "3–12 sek",
              "Oʻqish → Qaror → Bajarish → Bogʻlash (Link)",
              "Tezlik saqlanadi, KC oshadi, musiqa qatlami koʻtariladi",
            ],
            [
              <>
                <Chip tone="flux">MESO</Chip>
              </>,
              "45–120 sek",
              "Segment yugurish → Baho → Qayta urinish",
              "Segment reytingi, ghost yangilanadi, “yana 0.8 sek” maqsadi",
            ],
            [
              "MACRO",
              "8–20 daq",
              "Missiya (yetkazish) → Baho → Mukofot → Yangi marshrut",
              "Shard, koʻnikma ochkosi, yangi qisqa yoʻl ochilishi",
            ],
            [
              "META",
              "kunlar / haftalar",
              "Kaskad Shift (haftalik oʻzgaruvchi) → Reyting → Mavsumiy sovrin",
              "Global leaderboard oʻrni, kosmetik, “Author” medali",
            ],
          ]}
          caption="Jadval 4.1 — Toʻrt qatlam. Har bir qatlam keyingisini “oziqlantiradi”."
        />

        <Callout tone="tracer" label="Dizayn qoidasi" title="Har 12 sekundda bitta qaror">
          <p>
            Micro sikl — oʻyinning yuragi. Agar 12 sekund ichida oʻyinchi kamida bitta{" "}
            <B>maʼnoli qaror</B> qabul qilmasa (qaysi yoʻl, qachon sakrash, KC sarflashmi yoki
            yoʻq), segment juda boʻsh. Bu QA tomonidan oʻlchanadi: <K>decisions_per_beat ≥ 1.0</K>.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 4.2 */}
      <Sub id="4-2" num="4.2" title="Line Grade" hint="Yagona baholash tizimi">
        <P>
          Har bir yugurish oxirida oʻyinchi <B>bitta raqam va bitta harf</B> oladi. Bu — butun
          qayta oʻynash motivatsiyasining matematik asosi. Tizim shaffof: oʻyinchi nima uchun A
          olganini aniq koʻradi (replay + komponent paneli).
        </P>

        <CodeBlock
          file="line_grade.cpp — Baholash formulasi"
          code={`// Komponentlar (0..1 ga normallashtirilgan)
//   T = par_time / actual_time           (1.0 = par vaqt)
//   F = flow_time  / total_time          (Flow ulushi)
//   L = links      / possible_links      (bog'lanish zichligi)
//   R = danger_time / total_time         (xatarli yo'l ulushi)
//   P = 1 - (hardLandings*0.25 + snags*0.15).clamp(0,1)   (aniqlik)

rawScore = 1000 * clamp(T, 0, 1.35)
         +  400 * F
         +  250 * L
         +  300 * R
         +  150 * P
         -  penalties;

score = rawScore * (bInFlowAtFinish ? 1.05 : 1.0);   // yakuniy Flow bonusi

// "S" bahosi uchun maxsus darvoza (gate):
canGradeS = (R >= 0.60) && (hardLandings <= 1) && (snags == 0);`}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="label-mono mb-3 text-flux">Ogʻirliklar</p>
            <Table
              columns={[
                { key: "c", label: "Komponent" },
                { key: "w", label: "Maks", align: "right" },
                { key: "n", label: "Nima oʻlchaydi" },
              ]}
              compact
              rows={[
                ["T · Time", "1000", "Par vaqtga nisbatan tezlik (1.35× gacha bonus)"],
                ["F · Flow", "400", "Yugurishning qancha qismi Flow holatida"],
                ["L · Link", "250", "Harakatlar orasidagi 0.4 sek ichidagi bogʻlanish"],
                ["R · Risk", "300", "Danger yoʻlda oʻtkazilgan vaqt ulushi"],
                ["P · Precision", "150", "Hard Landing va Snag yoʻqligi"],
              ]}
              caption="Jadval 4.2 — Ball komponentlari. Jami maks. 2100 (Flow bonusi bilan 2205)."
            />
          </div>
          <div>
            <p className="label-mono mb-3 text-alarm">Jarimalar (kumulyativ)</p>
            <Table
              columns={[
                { key: "e", label: "Hodisa" },
                { key: "p", label: "Jarima", align: "right" },
              ]}
              compact
              rows={[
                ["Hard Landing", "−60"],
                ["Snag (0.4 s dan ortiq turib qolish)", "−40"],
                ["Toʻliq toʻxtash (1.4 s+)", "−90"],
                ["Voidga tushish", "−90"],
                ["Dron tomonidan aniqlanish", "−120 (har takrorda ×1.5)"],
                ["Majburiy pauza (eshik, yuk)", "−15"],
                ["Xato marshrutga kirish (qaytish)", "−50"],
              ]}
              caption="Jadval 4.3 — Jarimalar. Maksimal jami jarima −500 bilan cheklanadi (0 dan pastga tushmaydi)."
            />
          </div>
        </div>

        <Table
          columns={[
            { key: "g", label: "Baho" },
            { key: "s", label: "Ball oraligʻi", align: "right" },
            { key: "d", label: "Maʼnosi" },
            { key: "u", label: "Ochiladigan narsa" },
          ]}
          compact
          rows={[
            [
              <>
                <Chip tone="hazard">S</Chip>
              </>,
              "≥ 2205",
              "Deyarli mukammal: tez, xatarli, uzluksiz",
              "Global leaderboard, “Line Master” kosmetikasi",
            ],
            [
              <>
                <Chip tone="flux">A</Chip>
              </>,
              "1850 – 2204",
              "Juda yaxshi: asosiy yoʻl toza, ozgina zaxira bor",
              "Yangi shard bonus, ghost yuklash",
            ],
            [
              <>
                <Chip tone="tracer">B</Chip>
              </>,
              "1400 – 1849",
              "Yaxshi: marshrut toʻgʻri, lekin sekin joylar bor",
              "Missiya mukofoti (toʻliq)",
            ],
            ["C", "900 – 1399", "Tugatildi, lekin koʻp xato bilan", "Qisman mukofot (60%)"],
            ["D", "< 900", "Marshrutni qayta oʻrganish kerak", "Qayta urinish tavsiyasi koʻrsatiladi"],
          ]}
          caption="Jadval 4.4 — Baho jadvali. “S” faqat Danger yoʻl bilan olinadi (R ≥ 0.60 darvozasi)."
        />

        <Callout tone="hazard" label="Nega bu muhim" title="Baho — oʻyinchi uchun “keyingi qadam” xaritasi">
          <p>
            Yugurish oxirida ekran <B>uchta eng katta yoʻqotishni</B> koʻrsatadi: “3-segmentda 0.9
            sekund yoʻqotdingiz (snag)”, “Flow 62% — A darajasi uchun 78% kerak”, “Danger yoʻl
            ishlatilmadi”. Yaʼni oʻyinchi <B>nima qilishni aniq biladi</B>. “Yaxshilanish hissi”
            shu yerdan tugʻiladi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 4.3 */}
      <Sub id="4-3" num="4.3" title="Qayta oʻynash mexanizmlari" hint="“Yana bir marta” tugmasi">
        <Table
          columns={[
            { key: "m", label: "Mexanizm" },
            { key: "h", label: "Qanday ishlaydi" },
            { key: "w", label: "Nega qaytaradi" },
          ]}
          compact
          rows={[
            [
              "Instant Restart",
              "R tugmasi: 0.15 sekund ichida qayta boshlash, hech qanday yuklash yoʻq",
              "Urinish narxi nolga tushadi — bu eng kuchli motivator",
            ],
            [
              "Local Ghost",
              "Har yugurish 30 Hz da yozib olinadi; siz oʻz “eng yaxshi” nusxangizga qarshi yugurasiz",
              "Siz raqibingiz — oʻzingiz. Bu adolatli va shaxsiy",
            ],
            [
              "Global Weekly Ghost",
              "Har hafta global 1-oʻrin egasining ghosti yuklanadi",
              "Ijtimoiy bosim + oʻrganish manbai (ular qanday yugurishini koʻrasiz)",
            ],
            [
              "Segment Splits",
              "Marshrut 6–10 segmentga boʻlinadi, har biri uchun split va farq koʻrsatiladi",
              "Aniq maqsad: “faqat shu segmentda 0.4 sek yaxshilash”",
            ],
            [
              "Chain Challenge",
              "“40 sekund yerga tegmaslik”, “10 ta Wall Jump zanjiri” kabi qoʻshimcha topshiriqlar",
              "Boshqa koʻnikmani talab qiladi — yangi oʻynash usuli",
            ],
            [
              "Daily Trial",
              "Har kuni avtomatik generatsiya qilingan 3 marshrut + 1 modifier",
              "Cheklangan vaqt — bu odat (habit) shakllantiradi",
            ],
            [
              "Sector Run (endless)",
              "Cheksiz protsedurali tomlar, faqat tezlik va omon qolish",
              "“Yugurish” refleksini mashq qildiradi, qizib olish uchun",
            ],
            [
              "Author Medal",
              "Har marshrutda par vaqtdan 5% tez natija uchun maxsus medal",
              "Dizaynerning shaxsiy “imzosi” — eng qiyin maqsad",
            ],
          ]}
          caption="Jadval 4.5 — Qayta oʻynash tizimlari. Bir oʻyinchiga 3 tadan koʻp taklif koʻrsatilmaydi (paradoks tanlov)."
        />

        <Metrics
          items={[
            { value: "0.15", unit: "sek", label: "Restart vaqti" },
            { value: "30", unit: "Hz", label: "Ghost yozish" },
            { value: "6–10", label: "Segment / marshrut" },
            { value: "−5", unit: "%", label: "Author medal par" },
          ]}
        />
      </Sub>

      {/* ------------------------------------------------------------ 4.4 */}
      <Sub id="4-4" num="4.4" title="Skill Tree" hint="Kuch emas — ifoda erkinligi">
        <P>
          <B>Asosiy qoida:</B> hech bir koʻnikma majburiy boʻlmasin. Barcha koʻnikmalarsiz ham
          oʻyinchi <B>S baho olishi mumkin</B> — faqat ancha qiyinroq. Koʻnikmalar “quvvat”
          qoʻshmaydi, ular <B>yangi ifoda usullari</B> qoʻshadi.
        </P>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="label-mono mb-3 text-flux">A daraxti · Kinetics (harakat)</p>
            <Table
              columns={[
                { key: "s", label: "Koʻnikma" },
                { key: "c", label: "SP", align: "right" },
                { key: "e", label: "Effekt" },
              ]}
              compact
              rows={[
                ["T1 · Kick-off", "2", "Vault saqlashi 0.92 → 0.97"],
                ["T1 · Soft Knees", "2", "Roll chegarasi 9.0 → 7.5 m/s"],
                ["T2 · Persistent Flow", "3", "Flow bagʻrikengligi 1.4 → 2.0 sek"],
                ["T2 · Wall Affinity", "3", "Wall Run davomiyligi 2.2 → 3.0 sek, +0.5 m/s"],
                ["T2 · Air Brake+", "3", "Burilish 55° → 80°, narx 10 → 6 KC"],
                ["T3 · Kinetic Reservoir", "4", "KC maks. 100 → 140, tiklash ×1.25"],
                ["T3 · Speed Vault", "4", "Mantle → Speed Vault bekor qilish (×0.88)"],
                ["T4 · Surge Mastery", "6", "Surge narxi 40 → 24 KC, +0.5 sek tezlik saqlanadi"],
                ["T4 · Chain Link", "6", "3-link zanjir → 1.5 sek +12% tezlik bonusi"],
                [
                  <>
                    <B>T5 · APEX</B> <Chip tone="hazard">capstone</Chip>
                  </>,
                  "10",
                  "Havoda qoʻshimcha qadam (Air Step), 1 zaryad / 8 sek, narx 35 KC",
                ],
              ]}
              caption="Jadval 4.6 — Kinetics daraxti (jami 43 SP)"
            />
          </div>

          <div>
            <p className="label-mono mb-3 text-tracer">B daraxti · Orientation (yoʻl topish)</p>
            <Table
              columns={[
                { key: "s", label: "Koʻnikma" },
                { key: "c", label: "SP", align: "right" },
                { key: "e", label: "Effekt" },
              ]}
              compact
              rows={[
                ["T1 · Tracer Sense", "2", "6 m radiusda yashirin marshrutlar 12% yorqinlashadi"],
                ["T1 · Pulse Map", "2", "2 sek puls: yaqin anchor nuqtalarni koʻrsatadi"],
                ["T2 · Ghost Anchor", "3", "Oldingi yugurishingizdan xavfli nuqtalarda xira ghost"],
                ["T2 · Shard Scanner", "3", "Yigʻiladigan qismlarni kuchli kontur bilan belgilaydi"],
                ["T3 · Heat Sink", "4", "Dron “Heat” soʻnishi ×1.5 tez"],
                ["T3 · Resilience", "4", "Hard Landing jarimasi −50%"],
                ["T4 · Second Wind", "6", "Void tushishdan keyin KC 60% saqlanadi (40% emas)"],
                ["T5 · Pathfinder", "8", "Chapter boshida 1.5 sek “marshrut xaritasi” proyeksiyasi"],
              ]}
              caption="Jadval 4.7 — Orientation daraxti (jami 32 SP). Toʻliq Accessibility uchun ham ishlatiladi."
            />
          </div>
        </div>

        <Callout tone="alarm" label="Balans nazorati" title="“Quvvat creep” oldini olish">
          <Bullets
            tone="alarm"
            items={[
              <>
                Koʻnikmalar <B>tezlik shiftini (retention)</B> 1.0 dan yuqoriga chiqara olmaydi —
                faqat yoʻqotishni kamaytiradi.
              </>,
              <>
                Yangi <B>majburiy</B> harakat ochilmaydi (Air Step — istisno, lekin u ham
                “qulaylik”, chunki asosiy marshrutlar usiz ham oʻtiladi).
              </>,
              <>
                Har bir Actʼda SP jami <B>maksimal 12</B> — oʻyinchi hammasini ola olmaydi. Bu{" "}
                <B>tanlov</B> yaratadi va qayta oʻynashga sabab beradi (respec bepul).
              </>,
            ]}
          />
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 4.5 */}
      <Sub id="4-5" num="4.5" title="Ochilish darvozalari" hint="Act tuzilishi">
        <Table
          columns={[
            { key: "a", label: "Act" },
            { key: "m", label: "Ochiladigan harakatlar" },
            { key: "g", label: "Yangi toʻsiqlar" },
            { key: "d", label: "Davomiylik" },
          ]}
          compact
          rows={[
            [
              "ACT I — Kanallar",
              "Run, Jump, Vault, Slide, Wall Run, Mantle, Roll",
              "Qulovchi tom, harakatlanuvchi platforma",
              "90 daq",
            ],
            [
              "ACT II — Servis qatlami",
              "Rail, Air Brake, Impact Break, Surge",
              "Ventilyator, bugʻ, sinadigan shisha",
              "120 daq",
            ],
            [
              "ACT III — Ofis minoralari",
              "Phase Dash, Wall-to-wall chain",
              "Regulyator nuri, dron tarmogʻi, yomgʻir",
              "140 daq",
            ],
            [
              "ACT IV — Antenna maydoni",
              "Air Step (skill orqali), yuqori tezlik zanjirlari",
              "Kuchli shamol, tor shpil geometriyasi",
              "110 daq",
            ],
            [
              "ACT V — Shpil / Final",
              "Barcha harakatlar kombinatsiyasi",
              "Aralash: barcha toʻsiqlar + vaqt bosimi",
              "60 daq",
            ],
          ]}
          caption="Jadval 4.8 — Act tuzilishi. Har bir Act yangi harakatni 1 dona ochadi (kognitiv yuklamani cheklash)."
        />
      </Sub>

      {/* ------------------------------------------------------------ 4.6 */}
      <Sub id="4-6" num="4.6" title="Kontent tuzilishi" hint="Miqdor rejasi">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              t: "Kampaniya",
              tone: "flux" as const,
              items: [
                "5 Act, 32 missiya",
                "8–10 soat birinchi oʻtish",
                "Har Actʼda 1 yangi hudud (jami 5 zona)",
                "Har missiyada 3 ta yashirin qisqa yoʻl",
              ],
            },
            {
              t: "Time Trial",
              tone: "tracer" as const,
              items: [
                "220 ta marshrut (bazaviy)",
                "Har hafta +3 (Kaskad Shift)",
                "Segment splitlar bilan",
                "Global + doʻstlar leaderboardi",
              ],
            },
            {
              t: "Doimiy kontent",
              tone: "hazard" as const,
              items: [
                "Sector Run (endless, 12 xil generatsiya)",
                "Ghost Racing (4 oʻyinchi, real vaqt)",
                "Seasonal Shift (3 oylik mavsum)",
                "Workshop marshrut muharriri (post-launch)",
              ],
            },
          ].map((block) => (
            <Panel key={block.t}>
              <PanelTitle tone={block.tone}>{block.t}</PanelTitle>
              <Bullets tone={block.tone} items={block.items} />
            </Panel>
          ))}
        </div>

        <P className="label-mono text-slag">
          Ushbu boʻlim natijasi: Line Grade formulasi, 8 ta qayta oʻynash tizimi, 6 darajali
          koʻnikma daraxti va 220 marshrutlik kontent rejasi.
        </P>
      </Sub>
    </Section>
  );
}
