import {
  B,
  Bullets,
  Callout,
  Chip,
  K,
  Lead,
  Metrics,
  P,
  Panel,
  Section,
  Steps,
  Sub,
  Table,
} from "../components/ui";

export default function S1Vision() {
  return (
    <Section
      id="vizyon"
      index="01"
      kicker="Boʻlim 01 · Konsepsiya asosi"
      title="Asosiy Vizyon va Identitet"
    >
      <Lead>
        Bu boʻlim butun loyiha uchun <B>qaror filtri</B> vazifasini oʻtaydi. Keyingi har bir texnik
        tanlov — sakrash kuchi, animatsiya, hatto tovush dizayni — shu yerda belgilangan ustunlar
        bilan tekshiriladi.
      </Lead>

      {/* ------------------------------------------------------------ 1.1 */}
      <Sub id="1-1" num="1.1" title="Oʻyin pasporti" hint="Bir varaqli referens">
        <Table
          columns={[
            { key: "field", label: "Maydon" },
            { key: "value", label: "Qiymat" },
            { key: "note", label: "Izoh" },
          ]}
          rows={[
            ["Ishchi nomi", <B key="n">SPIRELINE</B>, "“Spire” (minora) + “line” (chizilgan marshrut)"],
            ["Janr", "First-Person Parkour Action / Movement Platformer", "Jang yoʻq, qurol yoʻq"],
            ["Rejim", "Single-player kampaniya + onlayn Time Trial", "Asosiy kontent 1 oʻyinchi"],
            ["Platforma", "PC (Steam / EGS) → PS5, Xbox Series X|S", "PC — birlamchi target"],
            ["Dvigatel", "Unreal Engine 5.4 (Chaos), Unity 6 HDRP portlash variant", "5-boʻlimda ikkovi uchun parametrlar"],
            ["Kamera", "Birinchi shaxs (FPP), ixtiyoriy uchinchi shaxs replay uchun", "Replay — ghost tizimining yuzi"],
            ["Sessiya", "Missiya 8–20 daq · Time Trial 45–120 sek", "Mobilga mos “qisqa loop” falsafasi"],
            ["Auditoriya", "16–34 yosh, “movement-first” oʻyinlar fandomi", "Mirrorʼs Edge, Ghostrunner, Neon White"],
            ["Reyting", "PEGI 16 / ESRB T", "Zoʻravonlik yoʻq — balandlik qoʻrquvi bor"],
            ["Tillar", "EN, UZ, RU, TR, ES, DE, JA, ZH-Hans", "UZ — toʻliq lokalizatsiya, audio-adjacent"],
            ["Biznes modeli", "Premium $29.99 + kosmetik skinlar (jangsiz)", "Pay-to-win yoʻq, chunki bu jang emas"],
            ["Maqsad hajm", "8 soat kampaniya · 40+ marshrut · 220 ta Time Trial", ""],
          ]}
          caption="Jadval 1.1 — Pasport. Har qanday yangi xususiyat shu jadvalga sigʻmasa, u loyihaga kirmaydi."
        />
      </Sub>

      {/* ------------------------------------------------------------ 1.2 */}
      <Sub id="1-2" num="1.2" title="High Concept" hint="30 sekundlik pitch">
        <Panel className="border-l-2 border-l-flux">
          <p className="label-mono text-flux">Logline</p>
          <p className="mt-3 font-display text-xl leading-snug font-medium text-chalk md:text-2xl">
            2087-yil. “Kaskad” — ikki kilometr balandlikka qurilgan vertikal megapolis. Raqamli
            tarmoq Regulyator nazoratida, shuning uchun maʼlumot faqat jismoniy kristall koʻrinishida
            va faqat odam orqali tashiladi. Siz — Liniya Kuryerisiz. Harakat — yagona qurolingiz.
          </p>
        </Panel>

        <P>
          Oʻyinchi bitta vertikal shaharning yopiq, ammo uzluksiz yuqoriga choʻzilgan qatlamlaridan
          oʻtadi: kanalizatsiya darajasidan tortib bulutlar ustidagi antennalar maydonigacha. Har bir
          missiya — <B>jismoniy yukni (shard) manzilga yetkazish</B>. Yuk sinmaydi, siz
          sekinlashmaysiz, faqat shahar sizni ushlashga harakat qiladi.
        </P>

        <Steps
          items={[
            {
              title: "Nima oʻynaladi (verb)",
              body: (
                <span>
                  Yugurish, sakrash, sirpanish, devorda yugurish, ilashib koʻtarilish va — eng
                  muhimi — <B>chizilgan marshrutni bir uzluksiz harakatga birlashtirish</B>.
                </span>
              ),
            },
            {
              title: "Nima his qilinadi (emotion)",
              body: (
                <span>
                  Tezlikka aylanadigan nazorat: qanchalik dadil harakat qilsang, shunchalik tez va
                  kuchli boʻlasan. Sekinlashish — jismoniy yoʻqotish.
                </span>
              ),
            },
            {
              title: "Nima uchun oʻynaladi (motivation)",
              body: (
                <span>
                  Har bir marshrut baholanadi. Oʻyin sizga “sen bundan yaxshiroq yugura olasan” deb
                  isbotlaydi va buni <B>son bilan</B> koʻrsatadi.
                </span>
              ),
            },
            {
              title: "Nima uchun hozir (timing)",
              body: (
                <span>
                  Movement-first oʻyinlar (Neon White, Ghostrunner) katta auditoriya yigʻdi, ammo
                  ular abstrakt yoki jazolovchi. Realistik, lekin <B>adolatli</B> birinchi shaxs
                  parkouri bozor boʻshligʻi.
                </span>
              ),
            },
          ]}
        />

        <Callout tone="tracer" label="Elevator pitch" title="90 sekundda tushuntirish">
          <p>
            “Bu Mirrorʼs Edge, lekin qochish yoʻq — yetkazib berish bor. Siz toʻxtaganingizda
            kuchsizlanasiz, chunki tezlik sizning qurolingiz, oʻq-doringiz va himoyangiz. Xato
            qilsangiz oʻlmaysiz — vaqt va baho yoʻqotasiz. Shuning uchun bu oʻyin sizni asabiylashtirmaydi,
            u sizni <B>yaxshilanishga</B> chorlaydi.”
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 1.3 */}
      <Sub id="1-3" num="1.3" title="Core Fantasy" hint="Oʻyinchi kim deb his qiladi">
        <P>
          Core fantasy — bu marketing shiori emas, balki <B>har bir kadr tasdiqlanishi kerak boʻlgan
          vaʼda</B>. Bizning vaʼda: <B>“Men bu shaharda toʻxtamaydigan yagona narsaman.”</B> Uchta
          hissiy qatlamdan iborat:
        </P>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              tone: "flux" as const,
              n: "I",
              t: "Kinestetik erkinlik",
              d: "Shahar passiv fon emas — u sizning shaxsiy maydonchangiz. Har bir qirra, quvur va peshtoq potensial harakat nuqtasi.",
              proof: "Isbot: level dizayneri har 6 metrda kamida 1 ta harakatlanadigan qirra qoʻyadi.",
            },
            {
              tone: "tracer" as const,
              n: "II",
              t: "Koʻrinmas, lekin qoʻlga tushmas",
              d: "Sizni koʻradilar, kuzatadilar, lekin ushlay olmaydilar. Bosim bor, oʻlim yoʻq — bu qochish emas, ustalik.",
              proof: "Isbot: Dron “Heat” tizimi jarima beradi, lekin hech qachon oʻyinni toʻxtatmaydi.",
            },
            {
              tone: "hazard" as const,
              n: "III",
              t: "Ustalik isboti",
              d: "Har yugurishdan keyin “yana bir marta” hissi. Bu tasodif emas — bu oʻlchanadigan natija.",
              proof: "Isbot: har marshrut oxirida Line Grade + sekinlashtirilgan replay.",
            },
          ].map((item) => (
            <Panel key={item.n} className={item.tone === "flux" ? "border-t-2 border-t-flux" : item.tone === "tracer" ? "border-t-2 border-t-tracer" : "border-t-2 border-t-hazard"}>
              <span className="font-mono text-3xl font-semibold text-ink-600">{item.n}</span>
              <h4 className="mt-3 font-display text-lg font-semibold text-chalk">{item.t}</h4>
              <p className="mt-2.5 text-sm leading-relaxed">{item.d}</p>
              <p className="label-mono mt-4 text-slag">{item.proof}</p>
            </Panel>
          ))}
        </div>

        <Callout tone="alarm" label="Anti-fantasy" title="Oʻyinchi his qilmasligi shart">
          <Bullets
            tone="alarm"
            items={[
              <>
                <B>Superqahramon emas.</B> Ikki marta sakrash yoʻq, uchish yoʻq, kuch maydoni yoʻq.
              </>,
              <>
                <B>Qotil emas.</B> Qurollar, oʻldirish, qon — yoʻq. Toʻqnashuv ham yoʻq: qochish
                emas, <B>aylanib oʻtish</B>.
              </>,
              <>
                <B>Qurbon emas.</B> Kamera hech qachon nazoratni tortib olmaydi (cutscene va
                zipline kirishidan tashqari, 0.4 sek).
              </>,
              <>
                <B>Tabiat tanlagani emas.</B> Har bir ajoyib harakat ortida oʻyinchining aniq
                qarori turishi kerak.
              </>,
            ]}
          />
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 1.4 */}
      <Sub id="1-4" num="1.4" title="Uchta USP" hint="Nega aynan biz">
        <P>
          Bu uchta tizim birgalikda oʻyinning <B>koʻchirib boʻlmaydigan yadrosini</B> tashkil qiladi.
          Har biri alohida olinishi mumkin, lekin birgalikda ular butun bir janrni qayta yozadi.
        </P>

        <div className="space-y-4">
          {[
            {
              n: "USP 1",
              tone: "flux" as const,
              title: "Kinetik Zaryad — tezlik pul birligi sifatida",
              body: (
                <>
                  Boshqa parkur oʻyinlarida tezlik — natija. Bizda tezlik — <B>resurs</B>. Yugurish,
                  slayd, devor yugurishi va xavfli qoʻnishlar <K>Kinetic Charge (KC)</K> ishlab
                  chiqaradi. KC sarflanadi: keskin burilish (Air Brake), tezlikni tiklash (Surge),
                  shisha sindirish (Impact Break), dushman nuridan oʻtish (Phase Dash).
                  <br />
                  <br />
                  Natijada oʻyinchi hech qachon “turib oʻylamaydi” — chunki turish = manbasiz qolish.
                </>
              ),
              moat: "Koʻchirish qiyin: butun level dizayni, iqtisodiyot va audio bir shu resursga bogʻlanadi.",
            },
            {
              n: "USP 2",
              tone: "tracer" as const,
              title: "Fail-Forward — xato oʻlim emas, narx",
              body: (
                <>
                  Mirrorsʼ Edge sizni 40-qavatdan yiqilganda oʻldiradi. Bizda yiqilish — bu{" "}
                  <B>marshrut tanlovining narxi</B>. Har bir xato uchun tizim tayyor javobga ega:
                  ilashib qolish → avtomatik <K>Snag Assist</K>; baland qoʻnish →{" "}
                  <K>Hard Landing</K> (0.9 sek blok + KC −15, lekin oʻlim yoʻq); xato sakrash →
                  pastga tushish va <B>pastdan yuqoriga alternativ marshrut</B> (shahar doim ikki
                  tomonlama oʻqiladi).
                  <br />
                  <br />
                  Hech qachon “Game Over” ekrani chiqmaydi. Faqat <B>Guard Capture</B> (qoʻlga
                  olinish) bor — u ham 1.5 sekundlik joyidan davom etish, hayot emas.
                </>
              ),
              moat: "Koʻchirish qiyin: bu “adolat” tuygʻusini berish uchun tuning, animatsiya va level geometriyasi birlashishi kerak.",
            },
            {
              n: "USP 3",
              tone: "hazard" as const,
              title: "Tracer Language — UIʼsiz yoʻl tili",
              body: (
                <>
                  Butun oʻyin boʻylab amal qiladigan <B>qatʼiy 4 elementli vizual grammatika</B>:
                  issiq toʻq sariq (bogʻlanish nuqtasi), moviy-oq harakatlanuvchi chiziq
                  (marshrut oqimi), sariq (xatarli qirra), mat qora (oʻlim zonasi). Oʻyinchi HUD
                  oʻqimaydi — u <B>rangni oʻqiydi</B>.
                  <br />
                  <br />
                  Muhim: bu shunchaki artefakt emas. Har bir tizim ayni shu tilga boʻysunadi —
                  dushman nuri ham, ob-havo ham, audio signal ham. Shuning uchun yangi hududga
                  kirgan oʻyinchi 4 sekund ichida “bu yerda nima xavfli” ekanini biladi.
                </>
              ),
              moat: "Koʻchirish qiyin: bu butun art direction, VFX va audio jamoasining yagona qaroriga aylanadi.",
            },
          ].map((usp) => (
            <Panel key={usp.n}>
              <div className="flex flex-wrap items-center gap-3">
                <Chip tone={usp.tone}>{usp.n}</Chip>
                <h4 className="font-display text-lg font-semibold text-chalk">{usp.title}</h4>
              </div>
              <div className="mt-3.5 text-sm leading-relaxed">{usp.body}</div>
              <p className="label-mono mt-4 border-t border-line-soft pt-3.5 text-slag">{usp.moat}</p>
            </Panel>
          ))}
        </div>

        <Callout tone="neutral" label="Nazorat roʻyxati" title="USP tekshiruvi — har bir yangi xususiyat uchun">
          <p>
            Yangi mexanika qoʻshilishidan oldin Game Designer uchta savolga “ha” olishi shart:
            (1) u KC ishlab chiqaradimi yoki sarflaydimi? (2) xato qilish mumkinmi va tuzatish
            mumkinmi? (3) u Tracer Language orqali 1 sekunddan tezroq oʻqiladimi?
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 1.5 */}
      <Sub id="1-5" num="1.5" title="Bozor va raqobat tahlili" hint="Farqni aniq belgilash">
        <Table
          columns={[
            { key: "g", label: "Oʻyin" },
            { key: "good", label: "Undan oʻrganamiz" },
            { key: "diff", label: "Biz nimani boshqacha qilamiz" },
          ]}
          rows={[
            [
              "Mirrorʼs Edge",
              "Birinchi shaxsda tana hissi, kuchli art direction, “Red” koʻrinishining oʻqilishi",
              "Bizda yiqilish = oʻlim emas. Marshrut faqat chiziqli emas — pastdan yuqoriga ham ishlaydi",
            ],
            [
              "Dying Light",
              "Tabiiy, “qoʻl bilan” koʻtarilish hissi, shahar oʻyin maydoni sifatida",
              "Jang, qurol va zombi yoʻq. Faqat harakat, aniq oʻqiladigan arxitektura",
            ],
            [
              "Ghostrunner",
              "Tezlik + ritm, bir zarbada harakat erkinligi",
              "“Bir zarbada oʻlim” stressi yoʻq — jarima vaqt va baho koʻrinishida",
            ],
            [
              "Titanfall 2",
              "Devorda yugurish + momentum uzluksizligi",
              "Katta otishma maydonlari yoʻq; vertikal kanal ichida toʻliq kompressiya",
            ],
            [
              "Neon White",
              "Time trial meta, doimiy qayta urinish, aniq par vaqtlar",
              "Realistik fizika va real shahar; kartali abstraksiya yoʻq",
            ],
            [
              "Superhot / Clustertruck",
              "Bir gʻoyaga qurilgan oʻyin tozaligi",
              "Bir gʻoya emas — uch qatlamli harakat tizimi (bizning kuchli tomonimiz)",
            ],
          ]}
          caption="Jadval 1.2 — Raqobat xaritasi. Har bir ustun bizga tahdid emas, referens."
        />
      </Sub>

      {/* ------------------------------------------------------------ 1.6 */}
      <Sub id="1-6" num="1.6" title="Dizayn ustunlari" hint="Qaror filtri">
        <P>
          Toʻrtta ustun. Har bir dizayn bahsi shu toʻrtlik bilan yechiladi. Agar xususiyat ustunlar
          bilan ziddiyatga tushsa — xususiyat oʻchiriladi, ustun emas.
        </P>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              n: "P1",
              t: "Never Stop",
              d: "Harakat hech qachon majburan toʻxtamaydi. Har qanday majburiy pauza (cutscene, animatsiya, qoʻlga olinish) 1.5 sekunddan oshmaydi.",
              test: "Test: bu holat oʻyinchining momentumini nolga tushiradimi?",
              fail: "Buzilish belgisi: speed 0.8 sekunddan koʻp 0 boʻlib turadi.",
            },
            {
              n: "P2",
              t: "Recoverable",
              d: "Har bir xato uchun javob bor. Oʻyinchi hech qachon “nolga qaytarilmaydi” — u pastroq nuqtadan davom etadi.",
              test: "Test: bu xatodan chiqish yoʻli 2 sekunddan tezmi?",
              fail: "Buzilish belgisi: oʻyinchi bir joyda 3 marta urinib qoladi.",
            },
            {
              n: "P3",
              t: "Legible",
              d: "Har bir muhim element 1 sekund ichida aniqlanishi kerak. Kontrast, rang, harakat va tovush — barchasi bir xil xabarni beradi.",
              test: "Test: ovozsiz, bir kadrda, tushuniladimi?",
              fail: "Buzilish belgisi: oʻyinchi “bu yerga sakrash mumkinmi?” deb turadi.",
            },
            {
              n: "P4",
              t: "Risk Pays",
              d: "Xavfli marshrut har doim mukofotlanadi: vaqt, KC va Line Grade. Xavfsiz yoʻl hech qachon eng yuqori bahoga olib kelmaydi.",
              test: "Test: xavfsiz yoʻl bilan S olish mumkinmi?",
              fail: "Buzilish belgisi: xavfsiz yoʻl bir xil ball beradi.",
            },
          ].map((pillar) => (
            <Panel key={pillar.n}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-tracer">{pillar.n}</span>
                <h4 className="font-display text-base font-semibold text-chalk">{pillar.t}</h4>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{pillar.d}</p>
              <div className="mt-4 space-y-1.5 border-t border-line-soft pt-3.5">
                <p className="label-mono text-tracer-dim">{pillar.test}</p>
                <p className="label-mono text-slag">{pillar.fail}</p>
              </div>
            </Panel>
          ))}
        </div>

        <Metrics
          items={[
            { value: "0", label: "Game Over ekrani" },
            { value: "1.5", unit: "sek", label: "Maks. majburiy pauza" },
            { value: "4", label: "Tracer elementi" },
            { value: "2×", label: "Shahar oʻqilish yoʻnalishi" },
          ]}
        />
      </Sub>
    </Section>
  );
}
