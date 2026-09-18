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
  Steps,
  Sub,
  Table,
} from "../components/ui";

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="h-5 w-5 shrink-0 rounded-sm border border-white/10"
        style={{ backgroundColor: hex }}
      />
      <span className="font-mono text-[11.5px] text-mist">{hex}</span>
      <span className="text-chalk">{name}</span>
    </span>
  );
}

export default function S3Level() {
  return (
    <Section
      id="level"
      index="03"
      kicker="Boʻlim 03 · Level dizayni"
      title="Level Design va Yoʻl Topish"
    >
      <Lead>
        Level dizaynerining vazifasi — “chiroyli joy qurish” emas, balki{" "}
        <B>matnsiz tushunarli, lekin takrorlanmaydigan yoʻl qurish</B>. Bu boʻlimda biz vizual tilning
        qatʼiy grammatikasi va oʻlchov metrikasini belgilaymiz.
      </Lead>

      {/* ------------------------------------------------------------ 3.1 */}
      <Sub id="3-1" num="3.1" title="Tracer Language" hint="Toʻrt elementli vizual grammatika">
        <P>
          Oʻyinchi HUD oʻqimaydi. U <B>rang va shaklni oʻqiydi</B>. Shu sabab butun oʻyin boʻylab
          faqat toʻrtta element ishlatiladi — na bir dona koʻproq. Har bir yangi vizual element Game
          Director tasdiqidan oʻtishi shart.
        </P>

        <Table
          columns={[
            { key: "e", label: "Element" },
            { key: "c", label: "Rang / shakl" },
            { key: "m", label: "Maʼnosi" },
            { key: "u", label: "Ishlatilishi" },
          ]}
          rows={[
            [
              <B key="1">FLUX</B>,
              <Swatch key="s1" hex="#FF6A1F" name="Kuygan toʻq sariq" />,
              "Harakat nuqtasi — bu yerga tegish mumkin",
              "Vault qirralari, tutqichlar, panjara uchlari, mantel moʻljallari",
            ],
            [
              <B key="2">TRACER</B>,
              <Swatch key="s2" hex="#2FE0C4" name="Oqim moviysi" />,
              "Marshrut oqimi — asosiy yoʻl shu tomonda",
              "Quvurlar, kabellar, boʻyoq izlari, yoritilgan chiziqlar, gradient oqim",
            ],
            [
              <B key="3">HAZARD</B>,
              <Swatch key="s3" hex="#FFC53D" name="Ogohlantirish sariqi" />,
              "Xatar — mumkin, lekin qimmat",
              "Sinadigan shisha, qulovchi tom, elektr panellari, bugʻ",
            ],
            [
              <B key="4">VOID</B>,
              <Swatch key="s4" hex="#05070A" name="Mat qora" />,
              "Oʻlim zonasi — hech qachon asosiy yoʻlda emas",
              "Chuqurlik, boʻshliq, uzilish; faqat “qisqa kesish” yoʻllari ustidan",
            ],
          ]}
          caption="Jadval 3.1 — Tracer Language. Toʻrt element = butun oʻyinning vizual lugʻati."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="flux">Mutlaq qoidalar</PanelTitle>
            <Bullets
              items={[
                <>
                  <B>FLUX faqat harakatlanadigan narsada.</B> Agar obyekt Flux rangida boʻlsa, u{" "}
                  <B>albatta</B> ishlashi kerak. “Aldov rang” — taqiqlanadi.
                </>,
                <>
                  <B>Bir hududda bitta ustun issiq rang.</B> Yaʼni hudud ichida ikkita raqobatchi
                  Flux ohangi boʻlmaydi.
                </>,
                <>
                  <B>Tracer har doim harakatlanadi.</B> Statik chiziq — bu ziddiyat. Oqim animatsiyasi
                  0.6–1.4 m/s tezlikda siljiydi.
                </>,
                <>
                  <B>Void hech qachon Tracer bilan kesishmaydi.</B> Kesishsa — dizayner xatosi, level
                  QA tomonidan avtomatik belgilanadi.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="tracer">Qoʻshimcha (yordamchi) belgilar</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                <>
                  <B>BREADCRUMB:</B> orqaga qaytish yoʻlida Flux ohangi{" "}
                  <span className="text-flux">30% toʻyinganlikka</span> tushadi. Oʻyinchi “men orqaga
                  ketyapman” deb tushunadi.
                </>,
                <>
                  <B>TEMPO:</B> panellar orasidagi masofa tezlikka mos — hudud qanchalik tez boʻlsa,
                  qadamlar shunchalik uzun.
                </>,
                <>
                  <B>HEAT:</B> Regulyator droni koʻrgan hududda pol tekisligi{" "}
                  <span className="text-alarm">qizil toʻr</span> bilan belgilanadi (3.4-boʻlim).
                </>,
                <>
                  <B>SILENT:</B> tinglash imkoniyati uchun har bir xatarli element oʻz{" "}
                  <B>tovush imzosiga</B> ega (6-boʻlim) — koʻzi ojiz oʻyinchilar uchun ham.
                </>,
              ]}
            />
          </Panel>
        </div>
      </Sub>

      {/* ------------------------------------------------------------ 3.2 */}
      <Sub id="3-2" num="3.2" title="Matnsiz yoʻnaltirish" hint="Signposting qoidalari">
        <P>
          “Qaerga sakrash kerak?” — bu savol hech qachon ovozda aytilmasligi kerak. Quyidagi 10
          qoida — level QA roʻyxati. Har bir level shu roʻyxatdan oʻtadi.
        </P>

        <Table
          columns={[
            { key: "n", label: "№" },
            { key: "r", label: "Qoida" },
            { key: "v", label: "Oʻlchov" },
          ]}
          compact
          rows={[
            ["1", "Yorqinlik gradienti: keyingi platforma atrofi 15% yorqinroq", "ΔL ≥ 15%"],
            ["2", "Kontrast: harakat nuqtasi fondan aniq ajralib turadi", "kontrast ≥ 3:1"],
            ["3", "Siluet oʻqilishi: asosiy yoʻl fon osmonida siluet sifatida koʻrinadi", "kadrning ≥ 40%"],
            ["4", "Rang ierarxiyasi: bir kadrda 2 dan ortiq toʻyingan rang boʻlmasin", "maks 2 ohang"],
            ["5", "Harakat signali: statik obyekt emas, har doim sekin animatsiya", "0.6–1.4 m/s"],
            ["6", "Masofa gradatsiyasi: har 5.5 m da bitta qaror nuqtasi", "3–8 m oraligʻi"],
            ["7", "Vertikal kesim: kamera tik pastga qaraganda pol koʻrinadi", "kamera pitch −35° da ham"],
            ["8", "Shovqin byudjeti: fon geometriyasi sahna maydonining 60%dan oshmasin", "≤ 60%"],
            ["9", "Xatodan keyin yoʻl: har bir muvaffaqiyatsiz sakrashdan keyin 2 alternativ koʻrinadi", "≥ 2 yoʻl"],
            ["10", "Ovozli tasdiq: har bir muhim qaror nuqtasida nozik diegetik signal", "1 signal / 12 m"],
          ]}
          caption="Jadval 3.2 — Signposting nazorat roʻyxati (level QA “Definition of Done”)."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Nima ishlaydi",
              tone: "tracer" as const,
              items: [
                "Yorugʻlik chizigʻi — devor boʻylab yugurib ketadi",
                "Har xil material — har xil oqim (beton mat, metall yaltiroq)",
                "Arxitektura chizigʻi — peshtoq burchagi koʻzni yoʻnaltiradi",
                "Orqa fondagi harakat (parvoz, kran) — diqqatni yoʻnaltiruvchi ishora",
              ],
            },
            {
              t: "Nima ishlamaydi",
              tone: "alarm" as const,
              items: [
                "Strelka yoki marker (UI his qilinadi)",
                "Yorqin qizil “sakrash shu yerga” oynasi",
                "Sunʼiy “ghost” belgilar (oʻyinchining oʻz izi boʻlmasa)",
                "Ovozli “bu yerga” degan ovoz",
              ],
            },
            {
              t: "Chegara holatlar",
              tone: "hazard" as const,
              items: [
                "Tuman / yomgʻir — Tracer intensivligi ×1.3",
                "Tunda — Flux issiq nur manbai boʻladi",
                "Ichki makon — oqim shiftga koʻchadi (har doim koʻrinadigan sirt)",
                "Koʻp qavatli shaft — oqim yuqoriga yoʻnaltiriladi",
              ],
            },
          ].map((block) => (
            <Panel key={block.t}>
              <PanelTitle tone={block.tone}>{block.t}</PanelTitle>
              <Bullets tone={block.tone} items={block.items} />
            </Panel>
          ))}
        </div>
      </Sub>

      {/* ------------------------------------------------------------ 3.3 */}
      <Sub id="3-3" num="3.3" title="Marshrut strukturasi: Risk vs Reward" hint="Uch qatlamli yoʻl">
        <P>
          Har bir “beat” (12–18 sekundlik segment) kamida <B>uchta yoʻl</B> taklif qiladi. Bu P4
          ustunining amaliy koʻrinishi: xavfsiz yoʻl bor, lekin u hech qachon eng yaxshi ball
          bermaydi.
        </P>

        <Table
          columns={[
            { key: "r", label: "Yoʻl turi" },
            { key: "w", label: "Kenglik / sharoit" },
            { key: "t", label: "Vaqt farqi" },
            { key: "c", label: "Grade shift" },
            { key: "k", label: "KC mukofoti" },
          ]}
          rows={[
            [
              <>
                <Chip tone="tracer">SAFE · C yoʻl</Chip>
              </>,
              "Keng (≥ 3.5 m), yorugʻ, Vault/Mantle bilan",
              "+2.0 … +4.0 sek",
              "Maks B",
              "Past (×0.8)",
            ],
            [
              <>
                <Chip tone="flux">MAIN · B/A yoʻl</Chip>
              </>,
              "Tracer bilan belgilangan, Flow uzluksiz",
              "par vaqt",
              "A",
              "Oʻrta (×1.0)",
            ],
            [
              <>
                <Chip tone="hazard">DANGER · S yoʻl</Chip>
              </>,
              "Tor (0.6–1.0 m), bitta urinish, Void ustida",
              "−1.5 … −3.5 sek",
              "S (faqat shu yerda)",
              "Yuqori (×1.6) + risk koʻpaytiruvchisi",
            ],
          ]}
          caption="Jadval 3.3 — Uch qatlam. Har bir beatda kamida bittadan boʻlishi majburiy."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="hazard">Darvozalar (skill gates)</PanelTitle>
            <Bullets
              tone="hazard"
              items={[
                <>
                  <B>Wall chain gate:</B> 2 devor orasida 3 m boʻshliq — ketma-ket Wall Jump.
                  Talab: Wall Jump oʻzlashtirilgan.
                </>,
                <>
                  <B>Rail hop gate:</B> ikkita rel orasida 4 m — chiqish bonusisiz oʻtib boʻlmaydi.
                  Talab: Rail timing.
                </>,
                <>
                  <B>Phase gate:</B> 5.5 m boʻshliq + dron nuri. Faqat Phase Dash (−25 KC) bilan.
                  Talab: Act III.
                </>,
                <>
                  <B>Break gate:</B> sinadigan shisha orqasida qisqa yoʻl. Impact Break talab
                  qiladi.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="flux">Segment balansi qoidasi</PanelTitle>
            <Bullets
              items={[
                <>
                  Danger yoʻli <B>umumiy vaqtning 25–35%</B> ini tashkil qilsin. Undan koʻp boʻlsa —
                  oʻyin “stress simulator”ga aylanadi.
                </>,
                <>
                  Har bir Danger yoʻl <B>2 sekunddan uzoq</B> boʻlmasin — qisqa, aniq xatar.
                </>,
                <>
                  Danger yoʻl <B>har doim</B> vizual koʻrinadi (hech qachon “yashirin” emas). Sir —
                  bu uning mavjudligi emas, balki <B>foydalanish qarori</B>.
                </>,
                <>
                  Muvaffaqiyatsizlik holatida Danger yoʻl <B>Main yoʻlga</B> qaytaradi (2 sekund
                  yoʻqotish bilan), Voidga emas.
                </>,
              ]}
            />
          </Panel>
        </div>
      </Sub>

      {/* ------------------------------------------------------------ 3.4 */}
      <Sub id="3-4" num="3.4" title="Toʻsiqlar katalogi" hint="Dinamik elementlar">
        <P>
          Har bir toʻsiq <B>ritmga ega</B> — u metronom kabi ishlaydi. Oʻyinchi toʻsiqni “kutmaydi”,
          u bilan <B>sinxronlashadi</B>. Shu sabab barcha davriy toʻsiqlarning sikllari musiqa
          tempiga boʻysunadi (6.1-boʻlim).
        </P>

        <Table
          columns={[
            { key: "o", label: "Toʻsiq" },
            { key: "b", label: "Xatti-harakati" },
            { key: "p", label: "Texnik parametr" },
            { key: "a", label: "Oʻyinchi javobi" },
          ]}
          compact
          rows={[
            [
              "Moving Platform (servis kran)",
              "Chiziqli yoki aylanma harakat",
              "2.4 m/s, 4 m yoʻl, cycle 3.2 s, phase offset 0 / 0.8 / 1.6",
              "Momentum uzatiladi: platform tezligi oʻyinchi tezligiga qoʻshiladi",
            ],
            [
              "Collapsing Roof (chirigan tom)",
              "Tegishdan 0.6 sek keyin qulaydi",
              "Respawn 3.0 s, vazn chegarasi 1 qadam, tovush ogohlantirish 0.6 s",
              "Ustidan tez yugurish yoki butunlay chetlab oʻtish",
            ],
            [
              "Rotating Turbine (ventilyator)",
              "Aylanadigan parrak",
              "Period 3.2 s, ochiq oyna 1.1 s, radius 2.2 m",
              "Ritmga moslab oʻtish; tegilsa 0.4 s knockback",
            ],
            [
              "Updraft (havo oqimi)",
              "Vertikal koʻtarish",
              "8.0 m/s vertikal, radius 2.0 m, balandlik 5 m",
              "Uchish emas — koʻtarilish; chiqishda FOV +4°",
            ],
            [
              "Regulyator nuri",
              "Lazer panjara, yoqiladi/oʻchadi",
              "On 1.5 s / Off 1.0 s, cycle 2.5 s",
              "Kutish yoki Phase Dash bilan kesib oʻtish",
            ],
            [
              "Sliding Container",
              "Gorizontal siljiydigan yuk",
              "3.0 m/s, 6 m yoʻl, sekundiga 1 marta",
              "Ustiga sakrab, undan keyingi platformaga otilish",
            ],
            [
              "Breakable Glass",
              "Sinadigan shisha panel",
              "Impact Break (−30 KC) yoki slayd orqali (≥ 9 m/s)",
              "Tez yoʻl: sindirib oʻtish. Sekin yoʻl: aylanib oʻtish",
            ],
            [
              "Steam Vent",
              "Bugʻ chiqaradi, koʻtaradi",
              "Launch +16 m/s, cycle 4.0 s, signal 0.5 s oldin",
              "Yuqoriga chiqishning yagona yoʻli",
            ],
            [
              "Magnetic Rail",
              "Grind qilinadigan rel",
              "Radius 0.8 m, chiqish +2.0 m/s (1.5 sekdan keyin)",
              "Rail jack — tezlikni saqlash va oshirish",
            ],
            [
              "Scanner Drone",
              "Patrul + konus skaner",
              "Koʻrish konusi 45°, masofa 12 m, patrul 8 m",
              "Heat +100 (Flow uziladi), 6 sekunddan keyin qaytadi",
            ],
            [
              "Rain / Wet Surface",
              "Sirt ishqalanishi oʻzgaradi",
              "μ +0.20, slayd uzunligi ×1.35, ovoz filtri +400 Hz",
              "Tezroq, lekin kamroq nazorat — asosiy risk qatlami",
            ],
            [
              "Spinning Signboard",
              "Aylanadigan reklama paneli",
              "0.9 rad/s, radius 1.4 m, mass 120 kg",
              "Harakatlanuvchi platforma sifatida ishlatiladi; momentum uzatadi",
            ],
          ]}
          caption="Jadval 3.4 — Toʻsiqlar katalogi (12 ta asosiy element). Har birining audio imzosi majburiy."
        />

        <Callout tone="hazard" label="Qatʼiy qoida" title="“Oʻqish vaqti” (Read Time)">
          <p>
            Har bir dinamik toʻsiq birinchi marta koʻringanidan keyin oʻyinchi kamida{" "}
            <B>0.8 sekund</B> kuzatish imkoniyatiga ega boʻlishi shart. Yaʼni toʻsiq koʻrinish
            chegarasidan <B>tezlik × 0.8</B> metr <B>oldin</B> koʻrinishi kerak. 11 m/s da bu{" "}
            <B>8.8 metr</B>. Bu qoida buzilsa, oʻyin “adolatsiz” his qilinadi va bu — eng tez-tez
            uchraydigan yangi dizayner xatosi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 3.5 */}
      <Sub id="3-5" num="3.5" title="Blockout metrikasi" hint="“Goldilocks” sonlar">
        <P>
          Level dizayneri kulrang bloklar (blockout) bilan ishlaydi va faqat shu sonlarga tayanadi.
          Qiymatlar 2-boʻlimdagi fizika parametrlaridan <B>matematik hisoblanadi</B> — “taxminiy”
          emas.
        </P>

        <Metrics
          items={[
            { value: "5.5", unit: "m", label: "Standart gap" },
            { value: "3.5", unit: "m", label: "Koridor kengligi" },
            { value: "8", unit: "m", label: "Devor yugurish uzunligi" },
            { value: "12", unit: "m", label: "Rel uzunligi" },
          ]}
        />

        <Table
          columns={[
            { key: "m", label: "Metrika" },
            { key: "v", label: "Qiymat" },
            { key: "why", label: "Hisob / izoh" },
          ]}
          compact
          rows={[
            ["Standart tom orasi (gap)", "5.5 m", "Sprint 11 m/s × 0.655 s = 7.2 m; 5.5 m = 76% zaxira"],
            ["Maksimal Main-line gap", "7.0 m", "11 m/s da 97% — deyarli chegara, mahorat talab"],
            ["Danger-line gap", "7.5–9.5 m", "Air Brake / Phase Dash talab qiladi"],
            ["Koridor kengligi", "3.5 m", "Kapsula radiusi 0.32 m → 2.8 m erkin harakat zonasi"],
            ["Tor yoʻl (Danger)", "0.6–1.0 m", "Faqat stansiya rejimida, Flow faol"],
            ["Devor yugurish devori", "≥ 8.0 m uzunlik, ≥ 3.0 m balandlik", "2.2 sek × 9.5 m/s = 20 m nazariy; 8 m — xavfsiz"],
            ["Rel uzunligi", "12 m (10–18 m)", "+2.0 m/s bonus uchun 1.5 sek yetarli (16.5 m)"],
            ["Shaft diametri", "6.0 m", "Vertikal zanjir uchun (3 devor navbati)"],
            ["Qavat balandligi", "3.6 m (devor 3.0 m + plita 0.6 m)", "Standart arxitektura moduli"],
            ["Platforma balandlik farqi", "+0.9 / +1.3 / +2.2 m", "Yugurish / sprint / launch chegaralari"],
            ["Qoʻnish zonasi minimal", "1.8 × 1.8 m", "Landing Snap 1.2 m + kapsula 0.64 m"],
            ["Qadam balandligi", "0.45 m (avtomatik), 0.5 m (step-up)", "Kod bilan qulflangan"],
          ]}
          caption="Jadval 3.5 — Blockout metrikasi. Blockout kitʼi shu oʻlchamlarda tayyorlanadi."
        />

        <Panel className="border-l-2 border-l-tracer">
          <PanelTitle tone="tracer">Masofa ierarxiyasi (masofa → talab)</PanelTitle>
          <div className="space-y-2.5 font-mono text-[12.5px]">
            {[
              ["≤ 4.5 m", "Yugurishdan oson", "text-tracer"],
              ["4.5 – 5.5 m", "Sprint talab", "text-tracer"],
              ["5.5 – 7.0 m", "Sprint + toza timing", "text-flux"],
              ["7.0 – 7.5 m", "Wall Jump / Rail bonus kerak", "text-flux"],
              ["7.5 – 9.5 m", "Air Brake yoki Phase Dash", "text-hazard"],
              ["≥ 9.5 m", "Faqat Launch yoki zanjir", "text-alarm"],
            ].map((row) => (
              <div key={row[0]} className="flex items-baseline gap-4 border-b border-line-soft/60 pb-2 last:border-0">
                <span className="w-28 shrink-0 text-chalk">{row[0]}</span>
                <span className={row[2]}>{row[1]}</span>
              </div>
            ))}
          </div>
        </Panel>
      </Sub>

      {/* ------------------------------------------------------------ 3.6 */}
      <Sub id="3-6" num="3.6" title="Ritm va pacing" hint="Level “grammatikasi”">
        <Steps
          items={[
            {
              title: "Teach (oʻrgatish) — 6–10 sek",
              body: (
                <span>
                  Yangi mexanika <B>faqat bitta</B> xavfsiz vaziyatda koʻrsatiladi. Hech qanday
                  jarima yoʻq. Ekranda matn yoʻq — faqat Tracer oqimi va yorugʻlik.
                </span>
              ),
            },
            {
              title: "Test — 15–25 sek",
              body: (
                <span>
                  Ayni shu mexanika ikki marta, turli kontekstda talab qilinadi. Xato qilinsa —
                  qutqaruv yoʻli ochiq (P2 ustuni).
                </span>
              ),
            },
            {
              title: "Twist — 8–12 sek",
              body: (
                <span>
                  Mexanika xatarli element bilan birlashtiriladi (nur, yomgʻir, qulovchi tom). Shu
                  yerda Danger yoʻl ochiladi.
                </span>
              ),
            },
            {
              title: "Mastery — 20–40 sek",
              body: (
                <span>
                  Mexanika boshqa 2 mexanika bilan birga talab qilinadi. Bu — chapter finali
                  (masalan: Wall Run → Rail → Phase Dash zanjiri).
                </span>
              ),
            },
          ]}
        />

        <Table
          columns={[
            { key: "b", label: "Birlik" },
            { key: "d", label: "Davomiylik" },
            { key: "c", label: "Tarkibi" },
          ]}
          compact
          rows={[
            ["Beat (oʻlchov birligi)", "12–18 sek", "1 asosiy qaror + 1 xatarli tanlov"],
            ["Phrase", "3–4 beat (45–70 sek)", "Teach → Test → Twist"],
            ["Chapter", "2–3 phrase (90–210 sek)", "Mastery bilan yakunlanadi"],
            ["Mission", "4–6 chapter (8–20 daq)", "1 yetkazib berish + 1 qochish sekvensi"],
          ]}
          caption="Jadval 3.6 — Ritmik tuzilma. “Rest point” yoʻq — faqat “sekin beat” bor (Rail yoki skaner)."
        />

        <Callout tone="alarm" label="Anti-pattern" title="Uchta dizayner xatosi — qatʼiyan taqiqlanadi">
          <Bullets
            tone="alarm"
            items={[
              <>
                <B>“Kutish” toʻsiqlari.</B> Oʻyinchi platformani kutishi kerak boʻlsa — oʻyin
                toʻxtadi. Yechim: platforma har doim <B>harakatda</B>, oʻyinchi unga “sakrab
                minadi”.
              </>,
              <>
                <B>Koʻrinmas devor.</B> Hech qachon. Faqat jismoniy toʻsiq yoki ochiq Void.
              </>,
              <>
                <B>Bir martalik xato = qaytadan boshlash.</B> Uzoq segment (30 sek+) hech qachon
                bitta xatoga bogʻlanmaydi — oraliq “tiklash nuqtasi” har 12–18 sekundda mavjud
                (lekin u checkpoint emas, u <B>geometrik qutqaruv yoʻli</B>).
              </>,
            ]}
          />
        </Callout>

        <P className="label-mono text-slag">
          Ushbu boʻlim natijasi: 40+ marshrut uchun yagona blockout kitʼi, 12 ta toʻsiq
          prefabrikasi va Tracer Language material toʻplami (4 ta master material).
        </P>
      </Sub>
    </Section>
  );
}
