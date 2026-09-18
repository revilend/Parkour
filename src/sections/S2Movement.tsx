import FlowSimulator from "../components/FlowSimulator";
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
} from "../components/ui";

export default function S2Movement() {
  return (
    <Section
      id="harakat"
      index="02"
      kicker="Boʻlim 02 · Yadro tizimi"
      title="Harakat Mexanikasi va Dinamika"
    >
      <Lead>
        Bu — oʻyinning yuragi. Bu boʻlimdagi har bir son Engineʼdagi{" "}
        <K>DT_MovementTuning</K> DataTableʼga <B>aynan koʻchiriladi</B>. Sonlar “taxminan” emas —
        ular tuning sikllari natijasi va oʻzgarish faqat oʻlchov bilan asoslanadi.
      </Lead>

      {/* ------------------------------------------------------------ 2.1 */}
      <Sub id="2-1" num="2.1" title="Fizika asoslari" hint="Oʻlcham va qoidalar">
        <Metrics
          items={[
            { value: "1.72", unit: "m", label: "Qahramon boʻyi" },
            { value: "60", unit: "Hz", label: "Fizika tick" },
            { value: "19.6", unit: "m/s²", label: "Gravitatsiya" },
            { value: "46", unit: "°", label: "Yurish mumkin qiyalik" },
          ]}
        />

        <Table
          columns={[
            { key: "p", label: "Parametr" },
            { key: "v", label: "Qiymat", align: "right" },
            { key: "why", label: "Nega aynan shunday" },
          ]}
          rows={[
            ["Kapsula radiusi", "0.32 m", "Tor koridor (0.8 m) va quvur ichidan oʻtish uchun"],
            ["Kapsula yarim boʻyi", "0.86 m", "Past shift ostidan slaydda oʻtish: 1.05 m"],
            ["Kamera balandligi", "1.68 m (crouch 1.05 m)", "Balandlik qoʻrquvi va qadam hissi balansi"],
            ["Qadam balandligi (step offset)", "0.45 m", "Kichik toʻsiqlar “tormoz” boʻlmasin"],
            ["Kuchli yurish (step-up)", "0.50 m", "Faqat yugurish holatida, KS sarflamaydi"],
            ["Massa", "78 kg", "Faqat fizik obyektlar bilan oʻzaro taʼsirda ishlatiladi"],
            ["Terminal tezlik", "45 m/s", "Yiqilishda nazoratni yoʻqotmaslik uchun"],
            ["Gravitatsiya (base)", "19.6 m/s² (2.0× real)", "“Responsive, ammo ogʻir” hissi — Titanfall 2 referensi"],
          ]}
          caption="Jadval 2.1 — Qahramon oʻlchamlari. Bu qiymatlar level blockout metrikasi (3.5-boʻlim) bilan qulflangan."
        />

        <Bullets
          items={[
            <>
              <B>Kinematik xarakter, Rigidbody emas.</B> Qahramon kuchlar orqali emas, kod orqali
              harakatlanadi. Bu determinizm va tarmoqda rollback uchun zarur.
            </>,
            <>
              <B>Asimmetrik gravitatsiya.</B> Koʻtarilish <K>×1.00</K>, tushish <K>×1.15</K>, apex
              atrofida 0.18 sek <K>×0.85</K>. Bu “osmon etagida osilib qolish” hissini yoʻq qiladi va
              sakrash choʻqqisida qaror qabul qilish uchun vaqt beradi.
            </>,
            <>
              <B>Ishqalanish eksponensial.</B> <K>v *= 1 / (1 + μ · dt · k)</K> — chiziqli emas. Shu
              sabab tezlik “yopishib” qolmaydi, silliq soʻnadi.
            </>,
            <>
              <B>Fixed tick, interpolatsiyali render.</B> Fizika <K>0.01667 s</K> qadamda, render
              erkin. <K>DeltaTime</K> maksimum <K>0.05 s</K> (3 substep) — tab oʻzgartirilganda
              oʻyinchi devordan oʻtib ketmasin.
            </>,
            <>
              <B>Qiyalikdan tezlik.</B> Nishabda pastga: <K>a = g · sin(θ) · 0.35</K>. 20° nishabda
              sekundiga <K>+2.35 m/s</K> — slayd bilan birga bu asosiy “boost” usuli.
            </>,
          ]}
        />
      </Sub>

      {/* ------------------------------------------------------------ 2.2 */}
      <Sub id="2-2" num="2.2" title="Harakat katalogi" hint="Toʻliq texnik spetsifikatsiya">
        <P>
          Asosiy harakatlar. <B>Chiqish tezligi</B> — harakat tugagach saqlanadigan tezlik;{" "}
          <B>Kirish sharti (Can Enter)</B> — holatga oʻtish uchun qatʼiy predikat. Har bir harakat
          State Machineʼdagi (5.1-boʻlim) alohida holat.
        </P>

        <Table
          columns={[
            { key: "m", label: "Harakat" },
            { key: "i", label: "Kirish" },
            { key: "v", label: "Tezlik / kuch" },
            { key: "d", label: "Davomiylik" },
            { key: "r", label: "Qoida va cheklov" },
          ]}
          compact
          rows={[
            [
              "Run",
              "W / chap stik ushlab turish",
              "0 → 7.5 m/s",
              "—",
              "Accel 45 m/s², decel 22 m/s². Bazaviy harakat holati.",
            ],
            [
              "Sprint (Kinetic Build-up)",
              "Run holatida 1.2 sek uzluksiz",
              "7.5 → 11.0 m/s",
              "ramp 1.2 sek",
              "Eksponensial ramp. Toʻsiq yoki slayd rampni 0.35 sek ichida saqlaydi.",
            ],
            [
              "Slide",
              "Crouch, tezlik ≥ 6.0 m/s",
              "11.0 → 9.9 m/s",
              "0.45–1.6 sek",
              "μ = 0.08. Nishabda tezlik ortadi. Boshqarish 30°/s. Tepada shift boʻlsa ham ishlaydi.",
            ],
            [
              "Wall Run",
              "Devorga yopishib Jump (yoki avtomatik)",
              "9.0 → 11.5 m/s (clamp)",
              "maks 2.2 sek",
              "Devor ogʻishi ≤ 25° vertikaldan. Yopishish masofasi 0.55 m. Faqat bir tomonda ikki marta emas — almashish shart.",
            ],
            [
              "Wall Climb",
              "Wall Run + yuqoriga kirish",
              "+6.5 m/s vertikal",
              "maks 0.6 sek",
              "Kinetik zaryadni 18/s sarflaydi. Devor tepasiga chiqish uchun.",
            ],
            [
              "Wall Jump",
              "Wall Run holatida Jump",
              "×1.05 (bonus!)",
              "0.45 sek lock",
              "Yagona harakat — tezlikni oshiradi. Shu sabab “devor zanjiri” — asosiy speedrun texnikasi.",
            ],
            [
              "Vault",
              "Oldinga + Jump, toʻsiq balandligi 0.4–1.25 m",
              "×0.92 (kirish tezligidan)",
              "0.28–0.42 sek",
              "Balans va tezlikka qarab avtomatik tanlanadi. Orqasida boʻsh joy (Clearance) boʻlishi shart.",
            ],
            [
              "Speed Vault",
              "Vault paytida Sprint kirishi",
              "×0.88, +0.4 m uzunroq",
              "0.30 sek",
              "Skill Tree “Speed Vault” talab qiladi (4.4-boʻlim).",
            ],
            [
              "Mantle (Ledge Grab)",
              "Havoda, qirra balandligi 1.2–2.4 m",
              "×0.70",
              "0.35 sek",
              "Qutqaruv harakati — tezlik emas. “Speed Vault” bilan bekor qilinsa ×0.88.",
            ],
            [
              "Roll",
              "Qoʻnish, tezlik ≥ 9.0 m/s va balandlik ≥ 3.5 m",
              "×0.92",
              "0.55 sek",
              "Hard Landingʼning yagona oldini olish usuli. Roll paytida KC 8/s tiklanadi.",
            ],
            [
              "Rail / Zipline",
              "Interact, relsdan 0.8 m radiusda",
              "8.0 m/s → 12.0 m/s",
              "uzunlikka bogʻliq",
              <>
                1.5 sekunddan ortiq uchsa chiqishda <b>+2.0 m/s</b>. Kamera roll ±4°.
              </>,
            ],
            [
              "Launch (Plank / Steam)",
              "Ustiga qadam bosish",
              "+16.0 m/s vertikal",
              "lahzali",
              "Balandlik: 6.5 m. Balandroq obyektga chiqishning yagona yoʻli.",
            ],
            [
              "Landing (nazoratli)",
              "Yerga teginish",
              "×1.00 (impact < 8 m/s)",
              "0.12 sek",
              "Yumshoq qoʻnish. Speed 8–14 m/s → ×0.85 va “ogʻir” animatsiya.",
            ],
            [
              "Hard Landing",
              "Qoʻnish, impact ≥ 14 m/s",
              "×0.35",
              "0.90 sek lock",
              "KC −15, kamera zarbasi 0.4, musiqa −4.5 dB duck. Oʻlim emas — narx.",
            ],
          ]}
          caption="Jadval 2.2 — Asosiy harakat katalogi. Barcha “×” qiymatlari kirish tezligiga nisbatan koʻpaytiruvchi."
        />

        <Callout tone="tracer" label="Dizayn qoidasi" title="Tezlikni oshiradigan faqat 2 harakat bor">
          <p>
            <B>Wall Jump (×1.05)</B> va <B>Rail exit (+2.0 m/s)</B>. Qolgan hamma harakat tezlikni
            yutadi. Bu ataylab: tezlik <B>faqat</B> xavfli harakatlar orqali tiklanadi. Shu sabab
            yaxshi oʻyinchi “devor zanjiri” izlaydi — bu oʻyinning asosiy strategiyasi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 2.3 */}
      <Sub id="2-3" num="2.3" title="Kinetik Zaryad (KC)" hint="Tezlik — pul birligi">
        <P>
          <K>Kinetic Charge</K> — 0..100 oraliqdagi resurs. <B>Diegetik UI:</B> ekranda bar yoʻq;
          KC qahramonning kurtkasidagi LED chizigʻi va qoʻlqop halqasi orqali koʻrsatiladi. Bu
          birinchi shaxs immersionini saqlaydi (P3: Legible — chalgʻituvchi HUD emas).
        </P>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="label-mono mb-3 text-tracer">Ishlab chiqarish (generation)</p>
            <Table
              columns={[
                { key: "a", label: "Harakat" },
                { key: "k", label: "KC", align: "right" },
                { key: "c", label: "Shart" },
              ]}
              compact
              rows={[
                ["Yugurish (7.5+ m/s)", "+6.0 / sek", "Flow faolsiz"],
                ["Yugurish (Flow faol)", "+10.8 / sek", "Flow ×1.8, 2.x-boʻlim"],
                ["Slayd", "+9.0 / sek", "Faqat nishabda"],
                ["Devor yugurishi", "+7.0 / sek", "Yopishgan holda"],
                ["Wall Jump", "+12", "Har bir sakrash"],
                ["Rail / Zipline", "+5.0 / sek", "1.5 sekdan keyin"],
                ["Vault", "+8", "Toza bajarilsa (bloklanmasa)"],
                ["Roll qoʻnish", "+8.0 / sek", "Roll davomida"],
                ["Perfect Link", "+10", "0.4 sek ichida keyingi harakat"],
                ["Hard Landing", "−15", "Jarima"],
                ["Toʻliq toʻxtash", "−8.0 / sek", "2.0 sekdan ortiq harakatsiz"],
              ]}
              caption="Jadval 2.3 — KC manbalari"
            />
          </div>

          <div>
            <p className="label-mono mb-3 text-flux">Sarflash (consumption)</p>
            <Table
              columns={[
                { key: "a", label: "Qobiliyat" },
                { key: "k", label: "KC", align: "right" },
                { key: "c", label: "Effekt" },
              ]}
              compact
              rows={[
                ["Air Brake", "10", "Havoda 55° gacha yoʻnalish oʻzgarishi, tezlik ×0.94"],
                ["Surge", "40", "Har qanday holatdan 11.0 m/s ga tezkor tiklash (0.4 sek)"],
                ["Impact Break", "30", "Shisha, panjara, panellarni sindirish"],
                ["Phase Dash", "25", "6 m oldinga sakrash, 0.22 sek, dron nuridan oʻtish"],
                ["Wall Climb", "18 / sek", "Devor boʻylab yuqoriga koʻtarilish"],
                ["Extra Air Step", "35", "Skill Tree capstone: havodagi qoʻshimcha qadam"],
              ]}
              caption="Jadval 2.4 — KC sarfi"
            />
          </div>
        </div>

        <Panel>
          <PanelTitle tone="hazard">Iqtisodiy muvozanat qoidalari</PanelTitle>
          <Bullets
            tone="hazard"
            items={[
              <>
                <B>Tiklash tezligi sarfdan past.</B> 10.8/s maksimal tiklashda Surge (40 KC){" "}
                <B>3.7 sek</B> xolis harakat talab qiladi. Yaʼni kuch ishlatish “hozir yoki hech
                qachon” qarori boʻladi.
              </>,
              <>
                <B>Toʻxtash — eng qimmat xatti-harakat.</B> 2 sekund toʻxtash 16 KC yoʻqotadi, yaʼni
                qayta toʻplash 1.5 sekund. “Turib oʻylash” matematik jihatdan jazolanadi.
              </>,
              <>
                <B>Cap 100, ortiqcha “qaytarilmaydi”.</B> Toʻliq zaryadda turish — isrof. Bu
                oʻyinchini doimiy sarflashga undaydi.
              </>,
              <>
                <B>Qobiliyatlarning jami narxi 40 dan oshmaydi</B> — bir vaqtda maksimum bitta
                “katta” qaror. Bu qarorlarni tushunarli qiladi.
              </>,
            ]}
          />
        </Panel>

        <Callout tone="flux" label="Misollar" title="Tipik KC sikli (oʻyinchining real xatti-harakati)">
          <p>
            <B>Vaziyat:</B> tomdan tomga 12 metr boʻshliq, pastda 40 metr chuqurlik.
            <br />
            <B>Yechim A (xavfsiz):</B> zanjir orqali aylanib oʻtish — 6 sekund, KC 100 → 62 (devor
            yugurishi bilan).
            <br />
            <B>Yechim B (xatarli):</B> Sprint 11 m/s + Air Brake (−10 KC) + Phase Dash (−25 KC) →
            toʻgʻridan-toʻgʻri kesib oʻtish — 2.4 sekund, KC 100 → 65, lekin{" "}
            <B>Danger Line hisobi +1</B> va Line Gradeʼda ×1.4 risk koʻpaytiruvchisi.
            <br />
            Ikkalasi ham mumkin — bu P4 ustuni (Risk Pays) amalda.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 2.4 */}
      <Sub id="2-4" num="2.4" title="Momentum qoidalari" hint="Tezlik qanday saqlanadi">
        <P>
          Oʻyinchining tezligi hech qachon “qayta oʻrnatilmaydi” — u faqat <B>koʻpaytiriladi</B>.
          Quyidagi jadval butun tizim uchun yagona haqiqat manbai.
        </P>

        <Table
          columns={[
            { key: "a", label: "Hodisa" },
            { key: "m", label: "Saqlash (×)", align: "right" },
            { key: "n", label: "Izoh" },
          ]}
          compact
          rows={[
            ["Vault", "×0.92", "8% yoʻqotish — “toza” hissi uchun yetarli"],
            ["Speed Vault", "×0.88", "lekin 0.15 sek tezroq"],
            ["Mantle", "×0.70", "qutqaruv harakati"],
            ["Roll", "×0.92", "xavfsiz qoʻnishning yagona yoʻli"],
            ["Slayd chiqishi", "×0.90", "nishabda ×1.00 yoki yuqori"],
            ["Wall Run yopishish", "×1.00", "clamp [9.0, 11.5]"],
            ["Wall Jump", "×1.05", "bonus — taktika markazi"],
            ["Rail chiqishi", "×1.00 (+2.0 m/s)", "1.5 sekdan ortiq uchsa"],
            ["Air Brake (har 30°)", "×0.94", "55° gacha, KC 10"],
            ["Perfect Link", "+0.35 m/s", "0.4 sek ichida keyingi harakat"],
            ["Nazoratli qoʻnish (< 8 m/s)", "×1.00", "yoʻqotish yoʻq"],
            ["Ogʻir qoʻnish (8–14 m/s)", "×0.85", "animatsiya 0.25 sek"],
            ["Hard Landing (≥ 14 m/s)", "×0.35", "0.9 sek lock"],
          ]}
          caption="Jadval 2.5 — Momentum saqlash koʻpaytiruvchilari (yagona haqiqat manbai)"
        />

        <CodeBlock
          file="Formulalar 2.4.1–2.4.3 — Tezlik shifti"
          code={`// 2.4.1  Yumshoq chegara (soft cap) — drag
// v_soft = 11.0 m/s, k = 0.35
dragAccel(v) = k * max(0, v - v_soft)^2
//   v = 12.0 -> 0.35 m/s^2   (sezilmaydi)
//   v = 13.5 -> 2.19 m/s^2   (sezilarli)
//   v = 15.0 -> 5.60 m/s^2   (deyarli ushlab bo'lmaydi)
// Natija: barqaror maksimal tezlik ~ 13.4 m/s (rail + wall jump zanjirisiz)

// 2.4.2  Qattiq chegara (hard cap)
v = min(v, 15.0)          // faqat Launch va Rail exit bu chegaraga yaqinlashadi

// 2.4.3  Zanjir saqlash (chain retention) — bir yugurishdagi barcha harakatlar
v_out = v_in * PROD(retention_i) + SUM(linkBonus) - drag_loss`}
          caption="Bu uch formula butun harakat tizimining matematik asosi."
        />

        <Panel className="border-l-2 border-l-tracer">
          <PanelTitle tone="tracer">Ishlangan misol — 8 harakatli “toza liniya”</PanelTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse font-mono text-[12.5px]">
              <tbody>
                {[
                  ["1. Sprint ramp", "11.00 m/s", "KC 100"],
                  ["2. Slayd 0.9 sek", "×0.90 → 9.90", "KC +8"],
                  ["3. Vault", "×0.92 → 9.11", "KC +8"],
                  ["4. Wall Run 1.2 sek", "×1.00 → 9.11", "KC +12/s"],
                  ["5. Wall Jump", "×1.05 → 9.57", "KC +12"],
                  ["6. Air Brake 30°", "×0.94 → 9.00", "KC −10"],
                  ["7. Rail 1.6 sek", "→ 11.00 (+2.0)", "KC +5/s"],
                  ["8. Perfect Link + Roll", "+0.35, ×0.92 → 10.44", "KC +10"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-line-soft/60 last:border-0">
                    <td className="py-2 pr-4 text-mist">{row[0]}</td>
                    <td className="py-2 pr-4 text-tracer">{row[1]}</td>
                    <td className="py-2 text-slag">{row[2]}</td>
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <td className="py-2.5 pr-4 font-semibold text-chalk">Yakuniy natija</td>
                  <td className="py-2.5 pr-4 font-semibold text-flux">10.44 m/s</td>
                  <td className="py-2.5 text-slag">Saqlash: 95%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Sakkiz harakat, 5.1 sekund, tezlikning <B>95% saqlandi</B>. Bu — mukammal liniya. Xuddi
            shu yoʻlni Hard Landing bilan yakunlasak: <B>11.0 → 3.85 m/s</B>, qayta sprint 1.2
            sekund. Yaʼni <B>bitta xato ≈ 4.4 sekund</B> — bu juda katta farq, lekin oʻyin
            toʻxtamaydi.
          </p>
        </Panel>

        <Callout tone="neutral" label="Tuning qoidasi" title="Neytral balans">
          <p>
            Har bir yangi harakat uchun: saqlash koʻpaytiruvchisi <B>1.0 dan yuqori boʻlsa</B> —
            qoʻshimcha oqibat (KC narxi, cooldown yoki xatar) boʻlishi shart. Aks holda oʻyinchi
            “cheksiz tezlanish” zanjirini topadi va barcha marshrutlar maʼnosiz boʻlib qoladi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 2.5 */}
      <Sub id="2-5" num="2.5" title="Coyote Time va yordam tizimlari" hint="Adolat oynalari">
        <P>
          “Adolat” — bu sehrli his. U bir necha <B>millisekundlik oynalar</B> va santimetrlik
          bagʻrikenglik yigʻindisidan iborat. Bu qiymatlar qiyinlik darajasiga bogʻliq emas.
        </P>

        <Table
          columns={[
            { key: "p", label: "Tizim" },
            { key: "v", label: "Qiymat", align: "right" },
            { key: "f", label: "60 FPS kadr" },
            { key: "d", label: "Vazifasi" },
          ]}
          compact
          rows={[
            ["Coyote Time", "0.150 sek", "9 kadr", "Platformadan yugurib chiqqach sakrash mumkin"],
            ["Jump Buffer", "0.100 sek", "6 kadr", "Yerga tegishdan oldin bosilgan sakrash saqlanadi"],
            ["Ledge Forgiveness", "±0.35 m", "—", "Qirra ushlash radiusi (kapsula oldida)"],
            ["Rail Magnet", "0.80 m", "—", "Relga yopishish radiusi"],
            ["Wall Stick", "0.55 m", "—", "Devor yugurishi uchun yopishish masofasi"],
            ["Landing Snap", "1.20 m", "—", "Havoda qoʻnish nuqtasiga lateral tortish (nishab < 12°)"],
            ["Apex Hang", "0.180 sek", "11 kadr", "Choʻqqida gravitatsiya ×0.85 — qaror vaqti"],
            ["Step Assist", "0.50 m", "—", "Kichik toʻsiqdan avtomatik chiqish"],
            ["Air Rotation Assist", "±18°", "—", "Havoda kamera bilan burilish, tezlik yoʻqotmasdan"],
            ["Input Deadzone", "0.15", "—", "Stik driftiga qarshi"],
            ["Snag Timeout", "0.40 sek", "24 kadr", "Harakatsiz qolsa Snag Assist ishga tushadi"],
          ]}
          caption="Jadval 2.6 — Adolat oynalari (Standart preset)"
        />

        <Table
          columns={[
            { key: "p", label: "Preset" },
            { key: "c", label: "Coyote", align: "right" },
            { key: "b", label: "Buffer", align: "right" },
            { key: "s", label: "Snap", align: "right" },
            { key: "w", label: "Kim uchun" },
          ]}
          compact
          rows={[
            ["Standart", "0.150 s", "0.100 s", "1.20 m", "Asosiy oʻyin, barcha platformalar"],
            [
              "Assisted",
              "0.160 s",
              "0.200 s",
              "1.80 m",
              <>
                <Chip tone="tracer">Accessibility</Chip> — harakat qiyinligi sozlamasi
              </>,
            ],
            [
              "Hardcore",
              "0.080 s",
              "0.100 s",
              "0.60 m",
              <>
                <Chip tone="hazard">Speedrun</Chip> — natijalar alohida leaderboardga yoziladi
              </>,
            ],
          ]}
          caption="Jadval 2.7 — Presetlar. Assisted va Hardcore natijalari aralashmaydi."
        />

        <Callout tone="tracer" label="Nega aynan shu sonlar" title="Coyote Time izohi">
          <p>
            0.150 sek = <B>9 kadr</B>. Inson reaksiyasi (vizuall) ~180–250 ms, yaʼni coyote time
            hanuz reaksiyadan <B>qisqaroq</B>. Sabab: u reaksiyani “qutqarmaydi”, u faqat{" "}
            <B>niyatni</B> qutqaradi. Oʻyinchi sakrashni rejalashtirib bosgan boʻlsa, 9 kadr ichida
            platformadan chiqib ketgan boʻlsa ham niyati bajariladi. 0.2 sekundan oshsa — bu
            “adolat” emas, balki harakat hissini buzadigan kechikish.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 2.6 */}
      <Sub id="2-6" num="2.6" title="Flow State qoidasi" hint="Toʻxtamaslik qanday mukofotlanadi">
        <P>
          <B>Flow State</B> — 2.5 sekund davomida uzluksiz harakat natijasida yuzaga keladigan holat.
          Bu shunchaki “bonus” emas: Flow — oʻyinchini <B>toʻxtamaslikka majbur qiluvchi</B> yagona
          kuch. Har bir tizim (KC, audio, kamera, ball) unga bogʻlangan.
        </P>

        <CodeBlock
          file="flow_state.cpp — Mantiq"
          tone="tracer"
          code={`// ---- 2.6.1  Flow holatiga kirish ----
// Uzluksiz harakat taymeri (speed >= 4.5 m/s)
continuousTimer += dt;
if (speed < 4.5f) continuousTimer = 0.f;
bInFlow = (continuousTimer >= 2.5f);

// ---- 2.6.2  Flow uzilishi (Breaking) ----
// Yumshoq uzilish: sekinlashuv 1.4 sekundgacha "bag'rikenglik" oladi
if (speed < 3.0f) slowTimer += dt; else slowTimer = 0.f;
if (slowTimer > 1.4f)        { bInFlow = false; flowMeter = 0.f; }
else if (bInFlow)            { flowMeter = min(100.f, flowMeter + 22.f * dt); }

// Flow qayta tiklanishi: uzilishdan keyin 2.5 sek UZLUQSIZ, lekin
// chegarasi balandroq: speed >= 5.5 m/s (o'yinga qaytish qiyinroq)
if (!bInFlow && speed >= 5.5f) recoveryTimer += dt;
else recoveryTimer = 0.f;
if (recoveryTimer >= 2.5f) bInFlow = true;

// ---- 2.6.3  Flow samaralari ----
kcRegenRate   = bInFlow ? 10.8f : 6.0f;          // ×1.8
scoreMultiplier = bInFlow ? 1.25f : 1.0f;        // Line Grade
audioIntensity += bInFlow ? 0.25f : 0.f;
cameraFovOffset = lerp(0.f, 6.f, flowBlend);     // qo'shimcha 6°
trailVfxIntensity = bInFlow ? 1.f : 0.35f;`}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="flux">Flow beradigan narsalar</PanelTitle>
            <Bullets
              items={[
                "KC tiklash ×1.8 (6.0 → 10.8 / sek)",
                "Line Grade koʻpaytiruvchisi ×1.25",
                "FOV +6° qoʻshimcha, iz VFX toʻliq quvvat",
                "Musiqa +1 qatlam, 132 BPM gacha",
                "Nafas ritmi musiqaga qulflanadi (6.3-boʻlim)",
                "Har 3 sekundda Flow Stack: +5% Link bonus (maks 3 stack)",
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="alarm">Flow uzadigan narsalar</PanelTitle>
            <Bullets
              tone="alarm"
              items={[
                "Tezlik 3.0 m/s dan past — 1.4 sekunddan ortiq",
                "Hard Landing (0.9 sek lock) — darhol uzilish",
                "Regulyator droni tomonidan aniqlanish (Heat +100)",
                "Majburiy oʻzaro taʼsir (eshik, yuk qoʻyish) — 1.2 sek pauza",
                "Devorga 0 tezlikda urilish (dead stop)",
              ]}
            />
          </Panel>
        </div>

        <P>
          <B>Kompensatsiya qoidalari</B> — xato hech qachon “jazosiz”, lekin hech qachon
          “oʻlimga olib boruvchi” ham boʻlmasligi kerak. Quyidagi toʻrtta tizim xatoni{" "}
          <B>uzluksiz harakatga aylantiradi</B>:
        </P>

        <Steps
          items={[
            {
              title: "Snag Assist — ilashib qolishni yoʻq qiladi",
              body: (
                <span>
                  Oʻyinchi 0.40 sekund davomida harakatsiz qolsa va oldida balandligi ≤ 1.6 m toʻsiq
                  boʻlsa, tizim avtomatik <K>Mantle</K> boshlaydi. Tezlik ×0.70 bilan tiklanadi.
                  Natija: “men bu yerga sakrab oʻtolmayman” degan holat umuman yuz bermaydi.
                </span>
              ),
            },
            {
              title: "Chasm Catch — chuqurlikka tushish",
              body: (
                <span>
                  Void zonasiga tushish = 1.5 sekundlik qayta tiklash (yaqin “xavfsiz qirra”ga).
                  Hayot yoʻq, Game Over yoʻq. Jarima: <B>−90 ball, KC 40%ga tushadi, Flow uziladi</B>.
                  Tizim yaqin 3 nuqtadan eng “orqada qolmagan” variantni tanlaydi.
                </span>
              ),
            },
            {
              title: "Anti-Pin — burchakda qamalib qolish",
              body: (
                <span>
                  Agar kapsula ikki geometriya orasida 0.25 sekunddan ortiq siqilib qolsa, tizim
                  eng qisqa chiqish vektorini hisoblab, oʻyinchini 0.6 m siljitadi. Qoʻlda
                  “sakrab-sakrab chiqish” hech qachon talab qilinmaydi.
                </span>
              ),
            },
            {
              title: "Never-Wall Signalling — “qaerga?” muammosi",
              body: (
                <span>
                  Agar oʻyinchi tezligi ≥ 6 m/s boʻlib, oldida 0.2 m dan uzoqda harakatlanadigan
                  sirt <B>boʻlmasa</B>, hududdagi Tracer chizigʻi pulsatsiya qiladi (intensivlik
                  ×1.6, 1.2 sek). Bu UI emas — bu dunyoning oʻzi “bu yoʻl yopiq” deb gapiradi.
                </span>
              ),
            },
          ]}
        />

        <Callout tone="hazard" label="Muhim" title="Xatoning narxi — vaqt, hayot emas">
          <p>
            Har bir xatoning narxi <B>3–5 sekund</B> oraligʻida boʻlishi kerak. Undan kam boʻlsa —
            xato ahamiyatsiz, oʻyinchi ehtiyotsiz boʻladi. Undan koʻp boʻlsa — oʻyinchi “bu adolatsiz”
            deb his qiladi va qayta urinishni tashlaydi. Bu — butun balansning eng nozik nuqtasi va
            u telemetriya bilan nazorat qilinadi (5.8-boʻlim).
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 2.7 */}
      <Sub id="2-7" num="2.7" title="Game Juice" hint="Hissiyotni beruvchi qatlam">
        <P>
          Mexanika “toʻgʻri” boʻlishi mumkin, lekin his qilinmasligi mumkin. Juice — bu harakatni{" "}
          <B>tanada sezish</B> qatlami. Uch guruhdan iborat: kamera, vizual effektlar va animatsiya.
        </P>

        <Table
          columns={[
            { key: "p", label: "Element" },
            { key: "v", label: "Qiymat" },
            { key: "r", label: "Qoida" },
          ]}
          compact
          rows={[
            ["Base FOV", "90°", "Yugurishda ham oʻzgarmaydi — bu “normal” nuqta"],
            ["Maksimal FOV", "102°", "15 m/s da. Lerp 0.25 sek, ease-out-expo"],
            ["FOV trigger", "≥ 4.5 m/s", "Flow boshlanishi bilan sinxron — ikkisi bir xil xabar"],
            ["Surge FOV punch", "+4°, 0.20 sek", "Tezlik tiklanganda bir martalik “surish”"],
            ["Hard Landing punch", "−3°, 0.15 sek", "Oldinga kamera silkinishi"],
            ["Devor roll", "12° devor tomon", "0.18 sek lerp. Simmetrik, L/R teng"],
            ["Slayd roll", "6°", "Slayd davomida, slayd burchagiga bogʻliq"],
            ["Rail roll", "±4°", "Tebranish (sinus 0.8 sek)"],
            ["Strafe roll", "2°", "Yon harakatda doimiy, juda nozik"],
            ["Kamera silkinishi", "amp = 0.4 × (impact/14)³", "Kubik — yumshoq, darsi “ne uchun jazolanyapman” tushunarli"],
            ["Silkinish soʻnishi", "0.30 sek", "“Sweden” shovqin namunasi (perlin emas)"],
            ["Head bob", "1.8 × speed/7.5 Hz, amp 0.035 m", "Faqat yerga tegib yugurishda"],
          ]}
          caption="Jadval 2.8 — Kamera va FOV (FPP diqqat markazida)"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="tracer">Vizual effektlar</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                <>
                  <B>Speed lines:</B> 8 m/s dan boshlab, ekran chetlarida 12% opasiti, tezlikka
                  proporsional.
                </>,
                <>
                  <B>Xromatik aberratsiya:</B> 10 m/s+, faqat chetlarda, 0.6 px (juda nozik —
                  bosh ogʻrigʻi bermasligi shart).
                </>,
                <>
                  <B>Vignette:</B> 0.15 → 0.38, Flow holatida.
                </>,
                <>
                  <B>KC izi:</B> qoʻlqop va poyabzal qoldirgan yorugʻlik chizigʻi. Rangi
                  zaryadga qarab: <span className="text-tracer">tracer (100 KC)</span> →{" "}
                  <span className="text-flux">flux (0 KC)</span>.
                </>,
                <>
                  <B>Chang / uchqun:</B> qoʻnishda chang halqasi (radius 0.8 m), slaydda uchqun,
                  devor yugurishida gips zarralari — sirtga qarab almashtiriladi.
                </>,
                <>
                  <B>Yomgʻir:</B> linzalarda suv tomchilari, ekranda “oqim” effekti; bu ayni paytda
                  o'yin mexanikasi (ishqalanish +0.2).
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="hazard">Animatsiya qoidalari</PanelTitle>
            <Bullets
              tone="hazard"
              items={[
                <>
                  <B>Qoʻllar doim kadrda.</B> 2 suyakli IK + “pump” sikli. Suzish emas — har qadam
                  qoʻlni harakatga keltiradi.
                </>,
                <>
                  <B>Tana koʻrinadi:</B> slayd va roll animatsiyalarida oyoqlar/korpus kadrga
                  kiradi (FPP “body awareness”). Bu oʻyinchi tanasini “sezadi”.
                </>,
                <>
                  <B>Hand-plant:</B> devorga yopishishda 0.12 sekundlik qoʻl teginish animatsiyasi
                  + chang + tovush. Uchtasi <B>bir kadrda</B> boshlanadi.
                </>,
                <>
                  <B>Root Motion:</B> Vault va Mantle animatsiyalari root motion bilan
                  harakatlanadi (1.4–2.1 m siljish), kod tezlikni keyin “tiklaydi”.
                </>,
                <>
                  <B>Momentum vizuali:</B> tezlik oshgani sayin qadam sikli tezlashadi, qadam
                  uzunligi 0.55 m → 1.05 m gacha.
                </>,
                <>
                  <B>Qoʻnish ogʻirligi:</B> yumshoq qoʻnish — tizza 12°, ogʻir — 28°, hard —
                  45° + 0.9 sekund tik turish.
                </>,
              ]}
            />
          </Panel>
        </div>

        <Callout tone="neutral" label="Qoida" title="Uchta kanal, bitta xabar">
          <p>
            Har bir muhim holat oʻzgarishi (Flow, Hard Landing, Surge, aniqlanish) bir vaqtda{" "}
            <B>uchta kanalda</B> tasdiqlanishi shart: vizual (kamera/VFX), audio (stinger/foley) va
            mexanik (tezlik/KC). Bittasi boʻlmasa — oʻyinchi holatni tushunmaydi va “adolatsiz”
            deb his qiladi. Bu — P3 ustunining amaliy talabi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 2.8 */}
      <Sub id="2-8" num="2.8" title="Flow sinovi" hint="Interaktiv model">
        <P>
          Quyidagi model — 2.6-boʻlimdagi formulalarning ishlaydigan nusxasi. Level dizayneri va
          audio dizayneri bir vaqtda shu vositadan foydalanadi: parametrni oʻzgartirib, “bu tezlikda
          oʻyinchi nimani eshitadi va koʻradi” savoliga javob oladi.
        </P>

        <FlowSimulator />

        <Callout tone="tracer" label="Ishchi tartib" title="Tuning ketma-ketligi (qatʼiy!)">
          <p>
            Yangi qahramon yoki yangi sirt uchun har doim shu tartibda: (1) gravitatsiya va sakrash
            balandligi → (2) yugurish tezligi va boʻshliq masofasi → (3) kamera va FOV → (4) saqlash
            koʻpaytiruvchilari → (5) yordam oynalari → (6) juice. Tartib buzilsa, oldingi
            bosqichlardagi sonlar maʼnosiz boʻladi va butun tuning boshidan boshlanadi.
          </p>
        </Callout>
      </Sub>
    </Section>
  );
}
