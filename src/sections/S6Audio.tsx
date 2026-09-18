import {
  B,
  Bullets,
  Callout,
  Chip,
  CodeBlock,
  Lead,
  Metrics,
  P,
  Panel,
  PanelTitle,
  Section,
  Sub,
  Table,
} from "../components/ui";

export default function S6Audio() {
  return (
    <Section
      id="audio"
      index="06"
      kicker="Boʻlim 06 · Tovush"
      title="Audio va Atmosfera"
    >
      <Lead>
        Parkur oʻyinida audio <B>tezlik oʻlchovi</B>dir. Oʻyinchi koʻzini ekrandan uzmasdan,
        tovushdan “hozir 11 m/s daman” yoki “Flow uzildi” ekanini bilishi kerak. Shuning uchun bu
        boʻlim musiqa nazariyasi emas — <B>tizim dizayni</B>.
      </Lead>

      {/* ------------------------------------------------------------ 6.1 */}
      <Sub id="6-1" num="6.1" title="Adaptiv saundtrek tizimi" hint="Vertikal qatlamlash + gorizontal resegmentatsiya">
        <P>
          Musiqa — <B>toʻrtta mustaqil qatlam</B> (stem) va bitta diegetik qatlam. Barcha stemlar
          <B> bir xil uzunlikda (32 bar)</B> va bir vaqtda boshlanadi, shuning uchun ular hech qachon
          fazadan chiqmaydi. Qatlamlar <B>faqat bar chegarasida</B> kiradi/chiqadi.
        </P>

        <Table
          columns={[
            { key: "l", label: "Qatlam" },
            { key: "r", label: "Rol" },
            { key: "c", label: "Tarkibi" },
            { key: "w", label: "Qachon eshitiladi" },
          ]}
          compact
          rows={[
            [
              <>
                <Chip tone="tracer">BED</Chip>
              </>,
              "Poydevor — hech qachon oʻchmaydi",
              "Pad, sub-drone, shahar xumori (60–220 Hz)",
              "Har doim: I ≥ 0.00",
            ],
            [
              <>
                <Chip tone="tracer">PULSE</Chip>
              </>,
              "Harakat pulsini beradi",
              "Zarbli asboblar, xat, subtaktil bass (kick)",
              "I ≥ 0.25 (qadamlar bilan sinxron)",
            ],
            [
              <>
                <Chip tone="flux">DRIVE</Chip>
              </>,
              "Tezlikni “haydaydi”",
              "Bass liniya, arpeggio, sintezator riff",
              "I ≥ 0.50 (sprint)",
            ],
            [
              <>
                <Chip tone="hazard">OVERDRIVE</Chip>
              </>,
              "Choʻqqi — xatar va ustalik",
              "Riser, xor, distortion gitara, tovush qatlami",
              "I ≥ 0.75 (Danger line)",
            ],
            [
              <>
                <Chip tone="neutral">BREATH</Chip> <span className="label-mono text-slag">diegetik</span>
              </>,
              "Oʻyinchining oʻz tanasi",
              "Nafas olish/chiqarish, yutish, qadam ostidagi shovqin",
              "Har doim (6.3-boʻlim)",
            ],
          ]}
          caption="Jadval 6.1 — Musiqa qatlamlari. Overdrive — hech qachon “fon” emas, u faqat xatarli yoʻlda ochiladi."
        />

        <CodeBlock
          file="audio_intensity.cpp — Musiqa intensivligi"
          tone="tracer"
          code={`// ---- 6.1.1  Intensivlik (0..1) ----
float speedNorm = FMath::Clamp(Speed / 13.f, 0.f, 1.f);      // 13 m/s = "to'yingan"
float flowNorm  = bInFlow ? FMath::Clamp(flowMeter / 100.f, 0.f, 1.f) : 0.f;
float riskNorm  = DangerZoneBlend;                            // Danger yo'lda 0..1

I = 0.50f * speedNorm + 0.30f * flowNorm + 0.20f * riskNorm;

// ---- 6.1.2  Layerlarni boshqarish (chiziqli emas, "zinapoya") ----
bedGain       = 0.f;                                          // doim
pulseGain     = SmoothStep(0.25f, 0.40f, I);                  // -inf -> -6 dB
driveGain     = SmoothStep(0.50f, 0.65f, I);                  // -inf -> -4 dB
overdriveGain = SmoothStep(0.75f, 0.90f, I);                  // -inf -> -5 dB

// ---- 6.1.3  Tempo ----
bpm = FMath::Lerp(84.f, 132.f, I);                            // stemlar time-stretch (0.92 - 1.08)

// ---- 6.1.4  Dinamik filtr va reverb ----
lowPassCutoff = FMath::Lerp(400.f, 12000.f, FMath::Clamp(Speed / 15.f, 0.f, 1.f));
reverbSend    = FMath::Lerp(0.35f, 0.08f, flowNorm);           // tezlikda "ochiq havo"

// ---- 6.1.5  Bar-kvantizatsiya (o'tish faqat bar chegarasida) ----
if (bInFlow != bPrevInFlow) QueueLayerChange(quantize: EBars::One);`}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="tracer">Vertikal qatlamlash vs Gorizontal resegmentatsiya</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                <>
                  <B>Vertikal (zona ichida):</B> bir xil akkord/ritm, faqat qatlamlar qoʻshiladi.
                  Bu “tezlik hissi” uchun ishlatiladi.
                </>,
                <>
                  <B>Gorizontal (zona orasida):</B> yangi hududga kirganda butun musiqa{" "}
                  <B>bar chegarasida</B> almashadi (Safehouse → Tomlar → Ichki makon). Bu
                  “joy oʻzgardi” hissini beradi.
                </>,
                <>
                  <B>Crossfade:</B> 1 bar (2.3 sek @132 BPM). Hech qachon hard cut — faqat oʻlim va
                  qoʻlga olinishda.
                </>,
                <>
                  <B>Stingerlar:</B> Spot, Close Call, Surge, Grade Reveal, Capture — 5 ta, har biri
                  0.6–2.4 sek, eng yaqin bar chegarasiga kvantlanadi.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="hazard">Jimjitlik — dizayn vositasi</PanelTitle>
            <Bullets
              tone="hazard"
              items={[
                "Hard Landing yoki qoʻlga olinishdan keyin 1.2 sek faqat ambient + yurak urishi",
                "Musiqa qaytishi Flow tiklanganda sodir boʻladi — bu mukofot",
                "Shu 1.2 sekund oʻyinchi uchun “men nima qildim?” refleksiya lahzasi",
                "Xatosiz liniyada esa musiqa hech qachon toʻxtamaydi — bu eng katta ragʻbat",
              ]}
            />
          </Panel>
        </div>

        <Callout tone="flux" label="Dizayn qoidasi" title="Musiqa hech qachon yolgʻon gapirmaydi">
          <p>
            Agar musiqa “choʻqqiga chiqsa” (Overdrive), demak oʻyinchi <B>albatta</B> xavfli
            holatda. Overdrive qatlami “shunchaki chiroyli” boʻlsa, oʻyinchi uni signal sifatida
            oʻqishni oʻrganmaydi va butun tizim maʼnosini yoʻqotadi. Shu sabab Overdrive{" "}
            <B>faqat</B> Danger yoʻl, yoki 11+ m/s, yoki dron aniqlashiga bogʻlanadi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 6.2 */}
      <Sub id="6-2" num="6.2" title="Intensivlik xaritasi" hint="Holat → tovush">
        <Table
          columns={[
            { key: "s", label: "Oʻyin holati" },
            { key: "i", label: "I", align: "right" },
            { key: "l", label: "Qatlamlar" },
            { key: "b", label: "BPM", align: "right" },
            { key: "f", label: "LPF / Reverb" },
          ]}
          compact
          rows={[
            ["Toʻxtab turish (idle)", "0.00", "Bed", "84", "400 Hz / 0.35"],
            ["Yurish (3 m/s)", "0.15", "Bed", "87", "2.7 kHz / 0.32"],
            ["Yugurish (7.5 m/s)", "0.38", "Bed + Pulse (−6 dB)", "102", "6.2 kHz / 0.22"],
            ["Sprint (10 m/s)", "0.62", "Bed + Pulse + Drive", "114", "7.9 kHz / 0.15"],
            ["Sprint + Flow (11 m/s)", "0.78", "All + Overdrive (−5 dB)", "121", "8.7 kHz / 0.09"],
            ["Danger line (11 m/s + Void)", "0.94", "Toʻliq + riser", "129", "9.3 kHz / 0.08"],
            ["Choʻqqi (14 m/s, Rail exit)", "1.00", "Toʻliq + xor stab", "132", "12 kHz / 0.08"],
            ["Flow uzilib, sekinlashuv", "0.30 →", "Bed + Pulse fade out", "132 → 84", "2.4 kHz / 0.30"],
            ["Hard Landing (lock)", "0.00", "Jimjitlik (1.2 s)", "—", "900 Hz / 0.45"],
            ["Dron aniqladi (Heat)", "0.70", "Pulse + alarm ostinato", "108", "5.0 kHz / 0.18"],
          ]}
          caption="Jadval 6.2 — Holat → tovush xaritasi. Bu jadval Wwise/FMOD da “State” grafigi sifatida aynan koʻchiriladi."
        />

        <Metrics
          items={[
            { value: "4", label: "Musiqa qatlami" },
            { value: "84–132", label: "BPM oraligʻi" },
            { value: "32", unit: "bar", label: "Stem uzunligi" },
            { value: "5", label: "Stinger" },
          ]}
        />
      </Sub>

      {/* ------------------------------------------------------------ 6.3 */}
      <Sub id="6-3" num="6.3" title="Nafas va tezlik" hint="Diegetik tezlik oʻlchovi">
        <P>
          Nafas — bu <B>bilinmagan qahramon</B> gapiradigan yagona ovoz. U hech qachon gapirmaydi,
          lekin oʻyinchi uning charchaganini, qoʻrqqanini va <B>“zonaga kirganini”</B> eshitadi.
        </P>

        <Table
          columns={[
            { key: "s", label: "Tezlik" },
            { key: "r", label: "Nafas chastotasi" },
            { key: "c", label: "Xarakteri" },
            { key: "m", label: "Musiqa bilan bogʻliqlik" },
          ]}
          compact
          rows={[
            ["0 m/s", "12 / daq", "Chuqur, tinch, ammo tayyor", "Erkin (rubato)"],
            ["3 m/s", "18 / daq", "Bir oz tezlashgan", "Erkin"],
            ["7.5 m/s", "26 / daq", "Ritmik, yengil zoʻriqish", "Pulse bilan yumshoq sinxron"],
            ["11 m/s", "34 / daq", "Qisqa, tez chiqarish", "Bar chegaralariga qulflanadi"],
            ["13+ m/s (Flow)", "38 / daq", "Chuqur, aniq, ritmik — nazorat hissi", "1/4 taktga toʻliq qulflangan"],
            ["Hard Landing", "—", "Boʻgʻilgan chiqarish + yutish", "Jimjitlikda yagona ovoz"],
            ["Void tushish", "—", "Uzun inhale (qoʻrquv)", "Musiqa toʻxtaydi"],
          ]}
          caption="Jadval 6.3 — Nafas tizimi. Flow holatida nafas musiqa tempasiga qulflanadi — bu subliminal “sen zonadasan” signali."
        />

        <Callout tone="tracer" label="Nega bu ishlaydi" title="Subliminal tasdiq">
          <p>
            Flow holatida nafas <B>1/4 taktga</B> qulflanadi (132 BPM da 113 ms). Oʻyinchi buni
            ongli ravishda sezmaydi, lekin miya “bu bir xil tizim” deb qabul qiladi. Natijada
            tezlik <B>qulay</B> his qilinadi va oʻyinchi tezroq yugurishga tayyor boʻladi. Bu —
            eng nozik va eng samarali juice texnikalaridan biri.
          </p>
        </Callout>

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="tracer">Shamol tizimi (3 obyekt)</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                <>
                  <B>Near gust (0–2 m):</B> kurtkaning hilpirashi, mato flapping, 0.4–2 kHz.
                  Tezlik bilan logarifmik oshadi.
                </>,
                <>
                  <B>Mid flow (2–40 m):</B> havo oqimi “whoosh” — pitch 200 → 900 Hz (tezlikka
                  proporsional). Sprintda asosiy ovoz.
                </>,
                <>
                  <B>Far city hum (40 m+):</B> shahar xumori, transport, dronlar. Atmosfera fonini
                  beradi va balandlikni “oʻlchaydi”.
                </>,
                <>
                  <B>Doppler pass:</B> 12+ m/s da yaqin obyektlardan oʻtishda qisqa pitch shift —
                  tezlikni juda kuchli sezdiradi.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="hazard">Ob-havo qatlami</PanelTitle>
            <Bullets
              tone="hazard"
              items={[
                "Yomgʻir: 3 intensivlik pogʻonasi; sirt ishqalanishiga taʼsir qiladi (μ +0.20)",
                "Yomgʻir ovozi sirt materialiga qarab oʻzgaradi (metall = tin-roof hissi)",
                "Shamol: 4 pogʻona; yuqori pogʻona Danger yoʻllarni vaqtincha yopadi",
                "Tuman: audio LPF 1.2 kHz ga tushadi — “koʻrinmaslik” hissi",
                "Ob-havo musiqaga taʼsir qilmaydi, lekin <B>LPF va reverb</B> ga taʼsir qiladi",
              ]}
            />
          </Panel>
        </div>
      </Sub>

      {/* ------------------------------------------------------------ 6.4 */}
      <Sub id="6-4" num="6.4" title="Foley katalogi" hint="Sirtga bogʻliq tovush dizayni">
        <P>
          Har bir qadam <B>toʻrt qatlamdan</B> yigʻiladi: <B>Attack</B> (zarba transiyenti),{" "}
          <B>Body</B> (material ovozi), <B>Scuff</B> (ishqalanish, tezlikka bogʻliq) va{" "}
          <B>Tail</B> (xona aks-sadosi). Qatlamlar nisbati tezlikka qarab oʻzgaradi — 11 m/s da
          Scuff va shamol ustunlik qiladi.
        </P>

        <Table
          columns={[
            { key: "m", label: "Sirt" },
            { key: "a", label: "Attack" },
            { key: "b", label: "Body" },
            { key: "s", label: "Scuff / Tail" },
            { key: "n", label: "Yozish izohi" },
          ]}
          compact
          rows={[
            [
              "Beton",
              "2–6 kHz slap, 4 ms",
              "60–120 Hz thump",
              "1.5–3 kHz / 0.35 s xona",
              "Kontakt mikrofon 0.3 m; 3 varianta har tezlik uchun",
            ],
            [
              "Temir / poʻlat",
              "1–3 kHz zarba",
              "500 Hz + 2.4 kHz metall qism",
              "2–5 kHz / 0.9 s uzun ring",
              "Ring modulyatsiya bilan; tomlarda eng koʻp ishlatiladi",
            ],
            [
              "Shisha",
              "4–9 kHz tinkle",
              "1.2 kHz yupqa rezonans",
              "6–10 kHz / 0.2 s, moʻrt",
              "Ehtiyotkorlik: shisha koʻp — 2 xil qalinlik varianti",
            ],
            [
              "Yogʻoch",
              "1–2 kHz",
              "180–400 Hz ichi boʻsh ton",
              "0.8–2 kHz / 0.25 s",
              "Taxta va faner ajratiladi (ichki makon uchun)",
            ],
            [
              "Brezent / tarp",
              "Transiyent yoʻq!",
              "300–900 Hz mato burst (0.12 s)",
              "1–3 kHz yumshoq shovqin",
              "Yumshoq, “jimgina” — bu sirt tezlikni <B>pasaytiradi</B> (−6%)",
            ],
            [
              "Shagʻal",
              "2–8 kHz granulali shovqin",
              "Tonal body yoʻq",
              "0.15 s tarqoq tail",
              "6 varianta; har qadamda randomizatsiya majburiy",
            ],
            [
              "Suv / hoʻl sirt",
              "1–6 kHz splash",
              "3–8 kHz drip (har 3-qadamda)",
              "0.3 s nam tail",
              "Yomgʻir bilan birga ishlaydi (qatlam ikki marta boʻlmasin)",
            ],
            [
              "Kafel / marmar",
              "3–7 kHz oʻtkir",
              "220 Hz xona rezonansi",
              "0.18 s qisqa, yuqori Q",
              "Ichki koridorlar uchun; “boy uy” hududida",
            ],
          ]}
          caption="Jadval 6.4 — Foley matritsasi. 8 sirt × 3 tezlik pogʻonasi × 6 variant = 144 sample."
        />

        <Table
          columns={[
            { key: "e", label: "Qoʻshimcha foley (harakatga bogʻliq)" },
            { key: "d", label: "Dizayn" },
            { key: "t", label: "Trigger" },
          ]}
          compact
          rows={[
            ["Hand-plant (devor teginish)", "Charm terisi + gips changi + qisqa grunt", "Wall Run boshlanishi (0.12 s animatsiya bilan)"],
            ["Devor ishqalanishi (loop)", "Uzluksiz shovqin, pitch tezlikka bogʻliq, 1.2 kHz markaz", "Wall Run davomida"],
            ["Vault zarbasi", "Kaft + etik + mato, 3 qatlam sinxron", "Vault 60% nuqtasida"],
            ["Mantle tortilishi", "Zanglagan metall + charm + nafas chiqarish", "Mantle boshida"],
            ["Slayd ishqalanishi (loop)", "Granulali friksiya + uchqun (metall sirtda)", "Slayd davomida, sirtga qarab"],
            ["Rail grind (loop)", "Metall gʻijirlash, ohang tezlikka bogʻliq", "Zipline/rel davomida"],
            ["Roll", "Mato + qum + tugma jiringlashi", "Roll boshida"],
            ["Kurtka hilpirash", "Yumshoq flapping (LPF 2 kHz), tezlikda kuchayadi", "Sprint ≥ 9 m/s"],
            ["Qoʻlqop gʻijirlashi", "Charm creak + fermuar jiringlashi", "Har qoʻl harakatida (0.5–2 s interval)"],
            ["Sumka / straplar", "Tasmalar tortilishi, metall toka", "Vault, Roll, Mantle"],
            ["Yuk (shard) signali", "Nozik piezo jiringlash (sogʻlom holat)", "Har 4 sekundda, shikastlanganda tezlashadi"],
            ["Impact Break (shisha)", "Shisha sinishi + charx zarralari + 0.4 s keyin qoldiq", "Break trigger"],
          ]}
          caption="Jadval 6.5 — Harakat foley katalogi. Har bir harakat uchun audio imzo majburiy (P3 ustuni)."
        />
      </Sub>

      {/* ------------------------------------------------------------ 6.5 */}
      <Sub id="6-5" num="6.5" title="Miks va 3D pozitsiyalash" hint="Ovoz arxitekturasi">
        <CodeBlock
          file="mix_buses.txt — Bus arxitekturasi"
          tone="hazard"
          code={`MASTER
 ├─ MUSIC                  (Bed / Pulse / Drive / Overdrive submix)
 │    └─ duck(target: -4.5 dB, source: IMPACT, attack 0.02 s, release 0.45 s)
 ├─ SFX_DIEGETIC
 │    ├─ FOLEY_FOOTSTEP     (sidechain: MUSIC -2.0 dB)
 │    ├─ FOLEY_ACTION       (hand plant, vault, roll)
 │    ├─ CLOTH              (kurtka, qo'lqop, strap)
 │    └─ WORLD              (dinamik obyektlar, dronlar, mexanizmlar)
 ├─ AMBIENCE               (shahar, yomg'ir, shamol, ichki havo)
 │    └─ duck(target: -1.5 dB, source: MUSIC, threshold: -18 dB)
 ├─ INTERFACE              (faqat Grade Reveal ekranida)
 └─ VOICE_BREATH           (nafas — har doim eshitiladi, duck targetlardan tashqarida)

// Sidechain qoidalari:
//  1. FOLEY_FOOTSTEP -> MUSIC (2.0 dB)  | qadam har doim eshitiladi
//  2. IMPACT         -> MUSIC (4.5 dB)  | zarba muhim
//  3. MUSIC          -> AMBIENCE (1.5 dB) | musiqa fonni "yutmaydi"
//  4. BREATH         -> hech qachon duck qilinmaydi (diegetik uzluksizlik)`}
        />

        <Table
          columns={[
            { key: "s", label: "Manba" },
            { key: "a", label: "Attenuation" },
            { key: "o", label: "Okklyuziya" },
            { key: "r", label: "Reverb" },
          ]}
          compact
          rows={[
            ["Qadamlar", "Log, 0–25 m (juda yaqin)", "Yoʻq (oʻz tanasi)", "Zona reverb send 0.35"],
            ["Devor/toʻsiq tovushi", "Log, 0–40 m", "Yoʻq", "0.45 (beton shaft katta)"],
            ["Dron / mashina", "Kompensatsiyalangan, 0–120 m", "Bor (LPF 1.2 kHz)", "0.25"],
            ["Shahar ambiensi", "2D + kichik 3D qatlam", "Yoʻq", "0.40"],
            ["Regulyator nuri", "Log, 0–60 m + HUD falsafasi yoʻq", "Yoʻq", "0.16"],
            ["Musiqa", "2D (3D boʻlmaydi)", "—", "Stem ichida, master reverb bilan"],
          ]}
          caption="Jadval 6.6 — 3D pozitsiyalash. Musiqa hech qachon 3D boʻlmaydi — u “ovoz beruvchi” emas, “hissiyot”."
        />

        <Callout tone="neutral" label="Accessibility" title="Audio sozlamalari (majburiy)">
          <p>
            (1) <B>Musiqa intensivligi</B> — 0 ga tushirilganda ham barcha holat signallari qoladi;
            (2) <B>Foley ustuvorligi</B> — qadamlar va harakat tovushlari alohida slider;
            (3) <B>Mono miks</B> — barcha 3D manbalar uchun; (4) <B>Vizual ekvivalent</B> — audio
            signalning vizual koʻrinishi (ekran chetida spektr indikatori, oʻchirilishi mumkin); (5) <B>Subtitr</B> — faqat stingerlar uchun emoji-belgilar bilan.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 6.6 */}
      <Sub id="6-6" num="6.6" title="Texnik byudjet" hint="Xotira va ovozlar">
        <Table
          columns={[
            { key: "p", label: "Parametr" },
            { key: "v", label: "Qiymat", align: "right" },
            { key: "n", label: "Izoh" },
          ]}
          compact
          rows={[
            ["Maksimal ovozlar (PC)", "32", "Onlayn jang yoʻq — bu yetarli"],
            ["Maksimal ovozlar (konsol)", "24", "Virtual voice + prioritet tizimi"],
            ["Musiqa stemlari", "6 (stereo)", "4 vertikal + 2 gorizontal zona varianti"],
            ["Stem formati", "Vorbis 160 kbps, 48 kHz", "Time-stretch 0.92–1.08 (Wwise/FMOD)"],
            ["Foley namunalari", "24-bit / 48 kHz WAV", "Runtimeʼda Vorbis 130 kbps"],
            ["Foley byudjeti", "≤ 2 MB / sirt", "144 sample, looplar alohida (streaming)"],
            ["Musiqa byudjeti", "≤ 12 MB / zona", "5 zona = 60 MB (streaming, decompress on load)"],
            ["Umumiy audio byudjet", "≤ 180 MB", "Kompressed on disk"],
            ["Kechikish (audio → chiqish)", "≤ 20 ms", "Buffer 256 sample @48 kHz = 5.3 ms, 2 buffer"],
            ["Middleware", "Wwise (asosiy) / FMOD (Unity varianti)", "Ikkovi ham bir xil State grafigini talab qiladi"],
          ]}
          caption="Jadval 6.7 — Audio texnik byudjeti."
        />

        <Callout tone="tracer" label="Ovoz dizayneri uchun qoida" title="Miks “qiziqarli” emas, “oʻqiladigan” boʻlishi kerak">
          <Bullets
            tone="tracer"
            items={[
              <>
                <B>Chastota ierarxiyasi:</B> sub-bass (shahar) → body (foley) → mid (musiqa) →
                high (shamol, uchqun). Har bir qatlam oʻz polosidagi ishni qiladi.
              </>,
              <>
                <B>Dinamik diapazon 18 dB</B> — jimjitlikdan choʻqqigacha. Undan kam boʻlsa —
                “hammasi bir xil baland”, undan koʻp boʻlsa — “nimadir buzildi”.
              </>,
              <>
                <B>Har 8 sekundda bitta “belgi”</B> tovush (stinger, signals, oʻzgarish) boʻlishi
                kerak — aks holda ovoz “fon shovqiniga” aylanadi.
              </>,
            ]}
          />
        </Callout>
      </Sub>
    </Section>
  );
}
