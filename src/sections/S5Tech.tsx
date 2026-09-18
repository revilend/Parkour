import MovementCalculator from "../components/MovementCalculator";
import StateMachineDiagram from "../components/StateMachineDiagram";
import {
  B,
  Bullets,
  Callout,
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

export default function S5Tech() {
  return (
    <Section
      id="texnik"
      index="05"
      kicker="Boʻlim 05 · Muhandislik"
      title="Texnik Arxitektura va Dasturlash Asosi"
    >
      <Lead>
        Bu boʻlim Texnik Direktor uchun yozilgan: dasturchi shu yerdan toʻgʻridan-toʻgʻri kod yozishi
        mumkin. Har bir parametr <B>DataAsset / ScriptableObject</B> ga koʻchiriladi va kod
        qayta kompilyatsiya qilinmasdan tuning qilinadi.
      </Lead>

      {/* ------------------------------------------------------------ 5.1 */}
      <Sub id="5-1" num="5.1" title="State Machine strukturasi" hint="Ierarxik FSM + postura bayroqlari">
        <P>
          Ikkita mustaqil qatlam ishlatiladi: <B>Locomotion Layer</B> (doimiy holat) va{" "}
          <B>Action Layer</B> (bir martalik qobiliyatlar). Imkon-qadar koʻp holat yaratmaslik uchun
          holatlar <B>postura bayroqlari</B> bilan hosil qilinadi (<K>bIsSliding</K>,{" "}
          <K>bIsWallRunning</K>) — bu “holat portlashi”ni oldini oladi.
        </P>

        <StateMachineDiagram />

        <Table
          columns={[
            { key: "from", label: "Joriy holat" },
            { key: "cond", label: "CanEnter sharti (predikat)" },
            { key: "to", label: "Yangi holat" },
            { key: "cost", label: "Narx" },
          ]}
          compact
          rows={[
            ["Grounded.Run", "Space && bGrounded", "Airborne.JumpRise", "—"],
            ["Airborne.*", "Space && !bGrounded && coyoteTimer < 0.12", "Airborne.JumpRise", "buffer ishlatiladi"],
            ["Grounded.Sprint", "Crouch && speed ≥ 6.0", "Grounded.Slide", "—"],
            ["Grounded.*", "WallProbe.hit && dot(normal, right) < −0.35", "Wall.WallRunL/R", "—"],
            ["Wall.WallRun", "Space", "Wall.WallJump", "KC +12 (mukofot)"],
            ["Wall.WallRun", "duration > 2.2 s", "Airborne.Fall", "tezlik ×0.80"],
            ["Airborne.Fall", "VaultProbe.hit && clearance.free", "Traversal.Vault", "—"],
            ["Airborne.Fall", "LedgeProbe.hit && ledge.h ∈ [1.2, 2.4]", "Traversal.Mantle", "tezlik ×0.70"],
            ["Airborne.Fall", "LandingProbe.hit && speed ≥ 9 && fall ≥ 3.5 m", "Traversal.Roll", "tezlik ×0.92"],
            ["Airborne.Fall", "LandingProbe.hit && impact ≥ 14 m/s", "Interaction.Stagger", "KC −15"],
            ["Any (speed ≥ 8 m/s)", "ImpactProbe.glass && KC ≥ 30", "Traversal.Break", "KC −30"],
            ["Any", "health == 0 || voidDepth > 12 m", "Disabled.Death", "respawn 1.5 s"],
          ]}
          caption="Jadval 5.1 — Transition jadvali (qisqartirilgan). Har bir qator DataAssetʼda saqlanadi."
        />

        <CodeBlock
          file="SpirelineCharacter.cpp — asosiy harakat sikli"
          code={`void ASpirelineCharacter::TickMovement(float Dt)
{
    // 1) Muhitni skanerlash (5.2-bo'lim) — keyingi holat uchun ma'lumot
    FTraversalProbe Probe = Traversal->Scan(GetActorLocation(), Velocity, Dt);

    // 2) Nomzod o'tishlarni ustuvorlik bo'yicha baholash
    const FStateTransition* Best = nullptr;
    for (const FStateTransition& T : TransitionTable)          // DataAsset'dan
    {
        if ((!Best || T.Priority > Best->Priority) && T.CanEnter(*this, Probe))
            Best = &T;
    }

    // 3) O'tishni bajarish
    if (Best && Best->TargetId != State.Id)
    {
        State.Exit(*this);                 // animatsiya, tovush, VFX tozalash
        State = States[Best->TargetId];
        State.Enter(*this, *Best);         // lock timer, retention tayinlash
    }

    // 4) Holat mantig'i + harakatni qo'llash
    State.Update(*this, Dt);

    // 5) Postura bayroqlarini yangilash (animatsiya va audio uchun yagona manba)
    bIsSliding = (State.Id == EState::Slide);
    bIsWallRunning = WallState != EWallState::None;
    Speed = Velocity.Size2D();
}`}
          caption="Kodning tuzilishi tuning uchun optimallashtirilgan: hamma son DataAssetʼda, kodda faqat mantiq."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="tracer">Muhim arxitektura qarorlari</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                <>
                  <B>Postura bayroqlari, holat emas.</B> 5 bayroq (9 holat) kombinatsiyasi 480 holat
                  beradi — lekin tizim faqat 14 ta holat biladi.
                </>,
                <>
                  <B>Barcha son DataAssetʼda.</B> <K>DT_MovementTuning</K> — runtime hot reload.
                  Dasturchi ishtirokisiz tuning.
                </>,
                <>
                  <B>Lock timerlar.</B> Har bir Traversal holatida <K>lockTimer</K> bor — bu P1
                  ustunining texnik kafolati.
                </>,
                <>
                  <B>Determinizm.</B> Hech qanday <K>random</K> yoki <K>frameDelta</K> ga bogʻliq
                  emas. Bu ghost replay va tarmoq uchun shart.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="flux">Tarmoq bayrogʻi (network flags)</PanelTitle>
            <Bullets
              items={[
                "0x01 bGrounded · 0x02 bSliding · 0x04 bWallRunning",
                "0x08 bSprinting · 0x10 bInFlow · 0x20 bAbilityActive",
                "Bayroqlar 1 baytda — ghost va net-move uchun optimal",
                "Speed 2 bayt (0.01 m/s aniqlik), KC 1 bayt (0..140)",
                "Har bir frame uchun jami: ≤ 9 bayt (5.7-boʻlim)",
              ]}
            />
          </Panel>
        </div>
      </Sub>

      {/* ------------------------------------------------------------ 5.2 */}
      <Sub id="5-2" num="5.2" title="Muhitni skanerlash algoritmi" hint="Raycast + Boxcast tizimi">
        <P>
          Har kadrda <B>9 ta probe</B> bajariladi, umumiy byudjet <B>0.15 ms</B>. Barcha probe
          parallеl (async) yoki keshlangan natija bilan ishlaydi. Traversal uchun alohida kanal
          (<K>ECC_Traversal</K>) mavjud — dinamik obyektlar va zarrachalar hisobga olinmaydi.
        </P>

        <Table
          columns={[
            { key: "p", label: "Probe" },
            { key: "s", label: "Shakl" },
            { key: "o", label: "Yoʻnalish / masofa" },
            { key: "u", label: "Vazifasi" },
          ]}
          compact
          rows={[
            [
              "GroundProbe",
              "Capsule sweep (0.32 × 1.72)",
              "Pastga, 0.35 m",
              "Tekislik normali → yurish mumkin if angle ≤ 46°",
            ],
            [
              "StepProbe",
              "Ray (tizza 0.45 m)",
              "Oldinga, 0.55 m",
              "Kichik toʻsiq → step-up (maks 0.50 m)",
            ],
            [
              "LedgeProbe",
              "2 ray (1.20 m va 1.70 m)",
              "Oldinga, 0.75 m",
              "Koʻkrakda toʻsiq + bosh erkin → qirra boshlandi",
            ],
            [
              "LedgeTopProbe",
              "Box sweep (0.64 × 0.2)",
              "Pastga (qirradan keyin)",
              "Qirra balandligi va usti tekisligi (mantle valid)",
            ],
            [
              "WallProbeL / R",
              "3 ray (0.5 / 1.1 / 1.6 m balandlik)",
              "Yon tomonga, 0.55 m",
              "Devor tekisligi normali, ogʻish ≤ 25° vertikaldan",
            ],
            [
              "VaultProbe",
              "Box sweep (0.6 × 1.0)",
              "Oldinga, 1.10 m",
              "Toʻsiq balandligi H ∈ [0.40, 1.25] m → vaultable",
            ],
            [
              "ClearanceProbe",
              "Box sweep (0.6 × 0.9)",
              "Oldinga (toʻsiq ustidan), 1.0 m",
              "Ustida boʻsh joy bormi (1.9 m balandlik)",
            ],
            [
              "LandingProbe",
              "3 box sweep (−0.3 / 0 / +0.3 m lateral)",
              "Pastga, 3.0 m (apexdan)",
              "Qoʻnish nuqtasi, nishab, sirt turi va balandlik",
            ],
            [
              "GapProbe",
              "Analitik ballistika (raycast emas)",
              "Havo vaqti prognozi",
              "Yetib borish mumkinmi → Tracer assist signali",
            ],
          ]}
          caption="Jadval 5.2 — Probe toʻplami. Har biri alohida debug rang bilan vizuallashtiriladi."
        />

        <CodeBlock
          file="TraversalSystem.cpp — Vault va Manevr aniqlash"
          code={`FTraversalProbe FTraversalSystem::Scan(const FVector& Origin, const FVector& Vel, float Dt)
{
    FTraversalProbe Out;
    const FVector Fwd = Character->GetActorForwardVector();
    const FVector Base = Origin;

    // --- 1. Zamin ---
    FHitResult GroundHit;
    FCollisionShape Capsule = FCollisionShape::MakeCapsule(32.f, 86.f);   // sm
    if (GetWorld()->SweepSingleByChannel(GroundHit, Base, Base - FVector(0,0,35.f),
            FQuat::Identity, ECC_Traversal, Capsule))
    {
        Out.bGrounded   = GroundHit.Normal.Z >= FMath::Cos(FMath::DegreesToRadians(46.f));
        Out.GroundNormal= GroundHit.Normal;
        Out.SurfaceId   = GroundHit.PhysMaterial->SurfaceType;            // Foley uchun
    }

    // --- 2. Devor (faqat havoda kerak) ---
    if (!Out.bGrounded && Vel.Size() > 300.f)                             // > 3 m/s
    {
        const FVector Side = Fwd.Cross(FVector::UpVector);
        for (float Sign : { -1.f, 1.f })
        {
            FHitResult WallHit;
            const FVector From = Base + FVector(0, 0, 60.f);
            if (GetWorld()->LineTraceSingleByChannel(WallHit, From,
                    From + Side * Sign * 55.f, ECC_Traversal))
            {
                const float TiltDeg = FMath::RadiansToDegrees(
                    FMath::Acos(FMath::Abs(WallHit.Normal.Z)));
                Out.WallDir[Sign > 0.f] = (TiltDeg <= 25.f
                        && WallHit.Normal.Dot(Side * Sign) < -0.35f)
                        ? EW_WallRun : EW_None;
            }
        }
    }

    // --- 3. Vault / Mantle (havoda, oldinga tezlik bilan) ---
    if (!Out.bGrounded && Vel.Dot(Fwd) > 400.f)                           // > 4 m/s
    {
        FHitResult Box;
        FCollisionShape B = FCollisionShape::MakeBox(FVector(30.f, 30.f, 50.f));
        const FVector From = Base + FVector(0, 0, -10.f);
        if (GetWorld()->SweepSingleByChannel(Box, From, From + Fwd * 110.f, FQuat::Identity,
                ECC_Traversal, B))
        {
            // To'siq balandligini oldindan pastga sweep bilan aniqlaymiz
            const float ObstacleH = MeasureObstacleHeight(Box.ImpactPoint, Fwd);
            Out.bVaultable  = ObstacleH >= 40.f && ObstacleH <= 125.f;    // 0.40 .. 1.25 m
            Out.bMantleable = ObstacleH >  125.f && ObstacleH <= 240.f;   // 1.25 .. 2.40 m
            Out.ObstacleHeight = ObstacleH;

            // Clearance: to'siq USTIDA bo'sh joy bormi (devorga uchib ketmasin)
            Out.bClearanceOk = TraceClearanceAbove(Box.ImpactPoint, Fwd, 100.f, 190.f);
        }
    }
    return Out;
}`}
          caption="Kod: probe natijasi holat o'tishlari uchun yagona maʼlumot manbai (har kadrda 1 marta)."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="hazard">Optimizatsiya qoidalari</PanelTitle>
            <Bullets
              tone="hazard"
              items={[
                <>
                  <B>Statik keshlash:</B> statik geometriya uchun probe natijasi har 2 tickʼda
                  yangilanadi (<K>frameParity</K>). Dinamik obyektlar har tick.
                </>,
                <>
                  <B>Async tracelar:</B> GroundProbe va LandingProbe <K>AsyncLineTrace</K> orqali
                  boshqa ipda; natija keyingi tickʼda ishlatiladi (1 kadr kechikish qabul qilinadi).
                </>,
                <>
                  <B>Erta chiqish:</B> agar <K>bGrounded</K> boʻlsa — Wall/Vault/Clearance
                  probelari umuman bajarilmaydi (≈ 60% tejash).
                </>,
                <>
                  <B>Kolliziya kanali:</B> barcha probe <K>ECC_Traversal</K> kanalida; level
                  geometriyasi shu kanalga “collision preset” bilan belgilanadi.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="tracer">Geometrik qoidalar (level ↔ kod shartnomasi)</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                "Yurish mumkin qiyalik: ≤ 46° (kapsula) — slider “Walkable Floor Angle”",
                "Devor yugurishi: devor ogʻishi ≤ 25° vertikaldan, usti ochiq boʻlishi shart",
                "Vault oraligʻi: 0.40–1.25 m. 1.25–2.40 m → Mantle",
                "Clearance: vault obyektidan 1.0 m ichida 1.9 m boʻsh balandlik",
                "Rail: 0.8 m magnet radiusi, rel materiali “Rail_Grabbing”",
                "Void: 12 m dan chuqur — Death zonasi (qayta tiklash)",
              ]}
            />
          </Panel>
        </div>
      </Sub>

      {/* ------------------------------------------------------------ 5.3 */}
      <Sub id="5-3" num="5.3" title="Reachability solver" hint="Sakrashni matematik prognoz qilish">
        <P>
          Raycast “sakrash mumkinmi?” savoliga javob bermaydi — uni <B>ballistik prognoz</B> hal
          qiladi. Bu tizim ikkita vazifani bajaradi: (1) oʻyinchi uchun syujetli “asist” signalini
          yoqish, (2) QA bot uchun marshrut tekshiruvi.
        </P>

        <CodeBlock
          file="reachability.cpp — Analitik prognoz"
          code={`// ---- 5.3.1  Asosiy kattaliklar ----
g      = 9.8 * GravityMultiplier;         // 19.6 m/s^2 (standart)
h_max  = (v0 * v0) / (2 * g);             // 1.05 m
t_air  = (2 * v0) / g;                    // 0.655 s	(tekis sathga qaytish)
d_flat = speed * t_air;                   // 7.5 m/s -> 4.91 m | 11.0 -> 7.20 m

// ---- 5.3.2  Nishab/qavat farqi bilan ----
// d = (speed / g) * (v0 + sqrt(v0^2 - 2 * g * dh))
float PredictGap(float speed, float v0, float g, float dh)
{
    float disc = v0 * v0 - 2.f * g * dh;               // dh = nishon balandligi - hozirgi
    if (disc < 0.f) return -1.f;                       // balandlikka yetib bo'lmaydi
    return (speed / g) * (v0 + FMath::Sqrt(disc));
}

// ---- 5.3.3  Qabul qilinadigan oraliq (tolerance) ----
reach = PredictGap(speed, v0, g, dh);
bReachable = (reach * 0.94f) >= distance;   // 6% bag'rikenglik = kapsula + qo'nish zonasi
                                            // (Landing Snap 1.2 m shu 6% ni yopadi)

// ---- 5.3.4  Asistlash (faqat "niyat" bo'lsa) ----
if (bReachable && distance > reach * 0.82f && JumpBufferedThisFrame)
    TracerVfx->PulseTarget(LandingPoint, intensity: 0.6f, duration: 0.35f);`}
          caption="Bu formula 3.5-boʻlimdagi blockout metrikasi bilan bir xil natija beradi — “qoʻlda hisoblangan” masofa endi avtomatik tekshiriladi."
        />

        <Callout tone="flux" label="Nega 6% bagʻrikenglik" title="Adolat va halollik balansi">
          <p>
            0.94 koʻpaytiruvchisi “sakrash mumkin, ammo chegarada” degan holatni bildiradi. Bu{" "}
            <B>ataylab qoʻyilgan</B>: oʻyinchi oxirgi millisekundda sakrasa ham muvaffaqiyat
            qozonadi, lekin bu harakat <B>tasodifiy emas</B> — u aniq niyat natijasi. Agar
            bagʻrikenglik 0.90 boʻlsa, chegara sakrashlar “omad”ga aylanadi va bu P4 ustunini
            buzadi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 5.4 */}
      <Sub id="5-4" num="5.4" title="Dvigatel parametrlari" hint="Yagona haqiqat manbai">
        <P>
          Quyidagi uch jadval <K>DT_MovementTuning</K> (UE) / <K>MovementTuning.asset</K> (Unity)
          fayliga aynan koʻchiriladi. Har bir satr runtimeʼda oʻzgartirilishi mumkin (designer
          ishtirokisiz, qayta kompilyatsiyasiz).
        </P>

        <p className="label-mono mb-3 text-flux">A · Gravitatsiya va sakrash</p>
        <Table
          columns={[
            { key: "p", label: "Parametr" },
            { key: "s", label: "Kalit" },
            { key: "v", label: "Qiymat", align: "right" },
            { key: "c", label: "60 FPS" },
          ]}
          compact
          rows={[
            ["Gravitatsiya (base)", "GravityScale", "2.00 (19.6 m/s²)", "—"],
            ["Koʻtarilish multiplikatori", "RiseGravityMult", "1.00", "—"],
            ["Tushish multiplikatori", "FallGravityMult", "1.15", "—"],
            ["Apex multiplikatori", "ApexGravityMult", "0.85 (0.18 s)", "11 kadr"],
            ["Sakrash kuchi", "JumpVelocity", "6.42 m/s", "—"],
            ["Sakrash balandligi (hosil)", "—", "1.05 m", "—"],
            ["Oʻzgaruvchan sakrash (min)", "VariableJumpMin", "0.55 (v × 0.55)", "—"],
            ["Terminal tezlik", "TerminalVelocity", "45.0 m/s", "—"],
            ["Qoʻnish ogʻir chegarasi", "HardLandVelocity", "14.0 m/s", "—"],
            ["Roll talab (balandlik)", "RollMinFallHeight", "3.5 m", "—"],
          ]}
        />

        <p className="label-mono mt-6 mb-3 text-flux">B · Tezlik, ishqalanish va saqlash</p>
        <Table
          columns={[
            { key: "p", label: "Parametr" },
            { key: "s", label: "Kalit" },
            { key: "v", label: "Qiymat", align: "right" },
            { key: "n", label: "Izoh" },
          ]}
          compact
          rows={[
            ["Yugurish tezligi", "RunSpeed", "7.50 m/s", "Bazaviy"],
            ["Sprint tezligi", "SprintSpeed", "11.00 m/s", "Ramp 1.2 s"],
            ["Ramp vaqti", "SprintRampTime", "1.20 s", "0.35 s grace"],
            ["Yugurish tezlanishi", "RunAccel", "45.0 m/s²", "0 → 7.5 m/s = 0.17 s"],
            ["Sekinlashish (yerga)", "RunDecel", "22.0 m/s²", "Qoʻyib yuborilsa"],
            ["Yer ishqalanishi", "GroundFriction", "8.0", "v *= 1/(1+μ·dt·k)"],
            ["Havo qarshiligi", "AirDrag", "0.35", "Momentumni saqlaydi"],
            ["Yumshoq chegara (soft cap)", "SoftCapSpeed", "11.00 m/s", "drag k = 0.35"],
            ["Qattiq chegara", "HardCapSpeed", "15.00 m/s", "Rail / Launch"],
            ["Slayd ishqalanishi", "SlideFriction", "0.08", "μ"],
            ["Slayd kirish tezligi", "SlideMinSpeed", "6.00 m/s", ""],
            ["Slayd davomiyligi", "SlideDuration", "0.45 – 1.60 s", "Nishabga bogʻliq"],
            ["Devor yugurishi tezligi", "WallRunSpeed", "9.0 – 11.5 m/s", "clamp"],
            ["Devor yopishish davri", "WallRunMaxTime", "2.20 s", "Skill: 3.0 s"],
            ["Devor yopishish masofasi", "WallStickDistance", "0.55 m", ""],
            ["Vault saqlashi", "VaultRetention", "0.92", "Speed Vault: 0.88"],
            ["Mantle saqlashi", "MantleRetention", "0.70", ""],
            ["Roll saqlashi", "RollRetention", "0.92", ""],
            ["Hard Landing saqlashi", "HardLandRetention", "0.35", "+ 0.9 s lock"],
            ["Link oynasi", "LinkWindow", "0.40 s", "+0.35 m/s bonus"],
          ]}
        />

        <p className="label-mono mt-6 mb-3 text-flux">C · Yordam oynalari, kamera, kirish, tarmoq</p>
        <Table
          columns={[
            { key: "p", label: "Parametr" },
            { key: "s", label: "Kalit" },
            { key: "v", label: "Qiymat", align: "right" },
            { key: "n", label: "Izoh" },
          ]}
          compact
          rows={[
            ["Coyote Time", "CoyoteTime", "0.150 s", "9 kadr"],
            ["Jump Buffer", "JumpBufferTime", "0.100 s", "6 kadr"],
            ["Qirra bagʻrikengligi", "LedgeForgiveness", "±0.35 m", ""],
            ["Rel magneti", "RailMagnetRadius", "0.80 m", ""],
            ["Qoʻnish tortishi", "LandingSnapDistance", "1.20 m", "nishab < 12°"],
            ["Snag timeout", "SnagTimeout", "0.40 s", "24 kadr"],
            ["Kamera FOV (base → maks)", "—“FovBase”/“FovMax”", "90° → 102°", "Lerp 0.25 s"],
            ["FOV trigger tezligi", "FovSpeedTrigger", "4.5 m/s", "Flow bilan sinxron"],
            ["Devor roll", "WallRollDegrees", "12°", "0.18 s lerp"],
            ["Kamera silkinishi", "ShakeAmplitude", "0.4 × (impact/14)³", "soʻnish 0.30 s"],
            ["Kirish deadzone", "InputDeadzone", "0.15", ""],
            ["Fizika tick", "PhysicsTickRate", "60 Hz", "substep maks 3"],
            ["Maksimum delta", "MaxDeltaTime", "0.05 s", "30 m/s×0.05 = 1.5 m sakrash oldini oladi"],
            ["Prediction buffer", "NetPredictionBuffer", "8 kadr", "Rollback uchun"],
            ["Ghost yozish chastotasi", "GhostSampleRate", "30 Hz", "9 bayt / sample"],
          ]}
          caption="Jadval 5.3 — Toʻliq tuning parametrlari. Har oʻzgarish telemetriyada belgilanadi (build versiyasi bilan)."
        />
      </Sub>

      {/* ------------------------------------------------------------ 5.5 */}
      <Sub id="5-5" num="5.5" title="Tuning kalkulyatori" hint="Havolaviy vosita">
        <P>
          Parametrni oʻzgartirishdan oldin natijani <B>koʻrish</B> kerak. Bu kalkulyator
          dasturchining <K>PredictGap()</K> funksiyasining vizual nusxasi: gravitatsiya, sakrash
          kuchi va tezlikni oʻzgartirib, boʻshliq masofasi qanday oʻzgarishini darhol koʻrasiz.
        </P>

        <MovementCalculator />

        <Callout tone="neutral" label="Ishlatish" title="Level dizayneri bilan birgalikda">
          <p>
            Kalkulyator <B>3.5-boʻlimdagi blockout metrikasini</B> qayta hisoblaydi. Agar yangi
            qahramon parametrlari standart gap (<B>5.5 m</B>) ni “sprint talab” toifasidan
            chiqarsa — level geometriyasi va parametrlar birgalikda koʻrib chiqiladi. Hech qachon
            faqat bittasi oʻzgartirilmaydi.
          </p>
        </Callout>
      </Sub>

      {/* ------------------------------------------------------------ 5.6 */}
      <Sub id="5-6" num="5.6" title="Unreal Engine 5 va Unity 6" hint="Dvigatelga xos realizatsiya">
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel>
            <PanelTitle tone="tracer">Unreal Engine 5.4 (asosiy)</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                <>
                  <B>MovementComponent:</B> <K>UCharacterMovementComponent</K> meros olinadi; yangi
                  rejim <K>MOVE_Custom</K> + <K>CMOVE_WallRun</K> / <K>CMOVE_Slide</K>.
                </>,
                <>
                  <B>PhysCustom():</B> Custom rejimda harakat shu funksiyada (gravitatsiya, clamp,
                  devor tekshiruvi) yoziladi.
                </>,
                <>
                  <B>FindFloor():</B> qayta yoziladi — 46° chegara va sirt materialini olish uchun.
                </>,
                <>
                  <B>Motion Warping:</B> Vault/Mantle uchun warping target; animatsiya va kod bir
                  vaqtda siljiydi.
                </>,
                <>
                  <B>Root Motion Source:</B> Rail va qisqa qobiliyatlar uchun
                  (<K>FRootMotionSource_MoveToDynamicForce</K>).
                </>,
                <>
                  <B>DataTable + Console var:</B> <K>spire.tune JumpVelocity 6.60</K> — build
                  qilmasdan tuning.
                </>,
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="flux">Unity 6 HDRP (port varianti)</PanelTitle>
            <Bullets
              items={[
                <>
                  <B>Kinematik xarakter:</B> <K>CharacterController</K> yetarli emas (devor
                  normali yoʻq) → custom kapsula + <K>Physics.ComputePenetration</K>.
                </>,
                <>
                  <B>FixedUpdate:</B> 0.01667 (<K>Time.fixedDeltaTime</K>); harakat shu yerda,
                  kamera <K>LateUpdate</K> da.
                </>,
                <>
                  <B>OnAnimatorMove + root motion:</B> Vault/Mantle uchun <K>ApplyBuiltinRootMotion</K>{" "}
                  va keyin tezlikni tiklash.
                </>,
                <>
                  <B>ScriptableObject:</B> <K>MovementTuning.asset</K> — UE DataTable analogi.
                </>,
                <>
                  <B>LayerMask:</B> <K>Traversal</K> layeri; <K>Physics.SphereCastNonAlloc</K>{" "}
                  (GC uchun) barcha probelarda.
                </>,
                <>
                  <B>Burst/Jobs:</B> LandingProbe va GapProbe hisobini <K>IJobParallelFor</K> ga
                  chiqarish (past darajali qurilmalar uchun).
                </>,
              ]}
            />
          </Panel>
        </div>

        <CodeBlock
          file="Unity — KinematicMove.cs (devor yugurishi)"
          code={`void FixedUpdate()
{
    Vector3 dir = transform.forward * input.y + transform.right * input.x;
    float dt = Time.fixedDeltaTime;

    // Gravitatsiya (asimmetrik)
    float g = Physics.gravity.y * tuning.gravityMultiplier;      // -19.6
    if (vel.y > 0f)      g *= tuning.riseGravityMult;            // 1.00
    else if (vel.y > -2f) g *= tuning.apexGravityMult;           // 0.85 (apex hang)
    else                 g *= tuning.fallGravityMult;            // 1.15

    // Devor aniqlash — 3 balandlikda
    wallLeft  = ProbeWall(-transform.right);
    wallRight = ProbeWall( transform.right);

    if (!grounded && (wallLeft || wallRight) && Mathf.Abs(vel.y) < 6f)
    {
        Vector3 n = wallRight ? wallRightNormal : wallLeftNormal;
        Vector3 along = Vector3.Cross(n, Vector3.up);
        // Tezlikni devor bo'ylab proyeksiya qilamiz — MOMENTUM YO'QOLMAYDI
        float speed = Mathf.Clamp(vel.magnitude, tuning.wallRunMin, tuning.wallRunMax);
        vel = along * Mathf.Sign(Vector3.Dot(vel, along)) * speed;
        vel.y = Mathf.Lerp(vel.y, -1.2f, 6f * dt);               // sekin pasayish
        wallTime += dt;
        if (wallTime > tuning.wallRunMaxTime) ExitWallRun();     // 2.2 s
    }
    else wallTime = 0f;

    vel.y += g * dt;
    controller.Move(vel * dt);
}`}
          caption="Unity varianti: devor yugurishida tezlik proyeksiyalanadi — bu “momentum hech qachon yoʻqolmaydi” qoidasining kod koʻrinishi."
        />
      </Sub>

      {/* ------------------------------------------------------------ 5.7 */}
      <Sub id="5-7" num="5.7" title="Tarmoq va ghost tizimi" hint="Determinizm va rollback">
        <Table
          columns={[
            { key: "l", label: "Qatlam" },
            { key: "a", label: "Arxitektura" },
            { key: "n", label: "Izoh" },
          ]}
          compact
          rows={[
            [
              "Harakat (movement)",
              "Client-side prediction + server reconciliation (rollback 8 kadr)",
              "Kirish kechikishi 0 ms hissi; server faqat tekshiradi",
            ],
            [
              "KC va qobiliyatlar",
              "Client hokim, server validatsiya (cost table serverda)",
              "Anti-cheat: KC cost va cooldown serverda tekshiriladi",
            ],
            [
              "Line Grade / vaqt",
              "Toʻliq server-hokim (authoritative)",
              "Server input logni qayta oʻynab tekshiradi (violation → flag)",
            ],
            [
              "Ghost replay",
              "30 Hz, delta-kodlangan, 9 bayt / sample",
              "60 sek yugurish ≈ 16 KB — deyarli bepul",
            ],
            [
              "Leaderboard",
              "Ghost + input log birga saqlanadi",
              "Server “replay validation” bilan cheatni filtrlaydi",
            ],
            [
              "Koʻp oʻyinchi (Ghost Racing)",
              "4 oʻyinchi, faqat transform + holat sinxronizatsiyasi",
              "Jismoniy toʻqnashuv yoʻq — sof poyga",
            ],
          ]}
          caption="Jadval 5.4 — Tarmoq qatlamlari. Harakat uchun LAN-grade, natija uchun server-grade ishonch."
        />

        <CodeBlock
          file="ghost_format.h — 9 baytlik sample"
          tone="hazard"
          code={`struct FGhostSample   // 9 bayt, 30 Hz
{
    int16  X, Y, Z;    // 6 b  — santimetr aniqligi (map 4 km x 4 km / 2 km balandlik)
    uint8  Yaw;        // 1 b  — 256 yo'nalish (1.4° aniqlik)
    uint8  Pitch;      // 1 b  — 256 qadam
    uint8  Flags;      // 1 b  — bGrounded | bSliding | bWallRunning | bSprinting | bInFlow | bAbility
};
// 60 sekund = 1800 sample = 16.2 KB (siqilmasdan)
// Delta-kodlash bilan: ~4.8 KB (o'rtacha) -> Steam Workshop uchun ideal`}
        />
      </Sub>

      {/* ------------------------------------------------------------ 5.8 */}
      <Sub id="5-8" num="5.8" title="Performance va QA" hint="Byudjet va avtomatik tekshiruv">
        <Metrics
          items={[
            { value: "16.6", unit: "ms", label: "Frame byudjet (60 FPS)" },
            { value: "0.60", unit: "ms", label: "Harakat mantigʻi" },
            { value: "0.15", unit: "ms", label: "Traversal probelari" },
            { value: "66", unit: "ms", label: "Kirish → piksel" },
          ]}
        />

        <Table
          columns={[
            { key: "s", label: "Tizim" },
            { key: "b", label: "Byudjet", align: "right" },
            { key: "n", label: "Optimizatsiya" },
          ]}
          compact
          rows={[
            ["Harakat mantigʻi (C++)", "0.60 ms", "Deterministik, kesh-doʻstona; DataAsset oʻqish keshlanadi"],
            ["Traversal probelari", "0.15 ms", "Async trace, frame parity, erta chiqish"],
            ["Animatsiya", "2.10 ms", "2-bone IK, 8 ta procedural qatlam (AnimBP)"],
            ["Fizika (level)", "2.50 ms", "Dinamik obyektlar ≤ 400, uyqu (sleep) agressiv"],
            ["Audio", "0.80 ms", "Stem mixing preallocated bus, 32 ovoz chegarasi"],
            ["VFX", "1.20 ms", "GPU particle, ekran effektlari post-processda"],
            ["Rendering", "9.20 ms", "Nanite shahar, VSM, TAA + 0.75 sharpen"],
            ["Zaxira", "0.05 ms", "—"],
          ]}
          caption="Jadval 5.5 — Kadr byudjeti taqsimoti (PC, 1080p, 60 FPS target)."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Panel>
            <PanelTitle tone="tracer">“SplineBot” — avtomatik QA</PanelTitle>
            <Bullets
              tone="tracer"
              items={[
                "Dizayner marshrutni spline sifatida belgilaydi; bot uni bajarishga urinadi",
                "Agar bot 3 marta muvaffaqiyatsiz boʻlsa — geometriya regressiyasi (bug)",
                "Har kecha barcha 220 marshrutda ishlaydi, natija dashboardga chiqadi",
                "Bot “recovery” mantiqni ham sinaydi: xato holatlarida chiqish yoʻli bormi",
                "Telemetriya: 100 m uchun xatolar soni, oʻrtacha Flow %, segment vaqtlari",
              ]}
            />
          </Panel>
          <Panel>
            <PanelTitle tone="hazard">“Feel Test” — inson protokoli</PanelTitle>
            <Bullets
              tone="hazard"
              items={[
                "12 oʻyinchi (6 “movement-veteran”, 6 yangi), har sessiya 45 daqiqa",
                "Asosiy savol: “buni siz nazorat qildingizmi yoki tasodifmi?” (7 balli shkala)",
                "5 savolli “Feel Index”: adolat, aniqlik, tezlik hissi, tushunarlilik, istak",
                "Maqsad: Feel Index ≥ 5.8 / 7 va “adolatsiz” shikoyatlar < 8%",
                "Har build uchun bir xil marshrut ishlatiladi (taqqoslanadigan A/B natija)",
              ]}
            />
          </Panel>
        </div>

        <Callout tone="neutral" label="Debug HUD (dizayner vositasi)" title="F1 — faqat development buildda">
          <p>
            Ekranda: tezlik grafigi (2 sekund), holat nomi va taymeri, KC, Flow % va timer, oxirgi
            2 sekunddagi <B>kirish kechikishi</B>, probe chizmalari (har biri oʻz rangi bilan),
            retention koʻpaytiruvchilar jurnali (“Vault ×0.92 → 10.12 m/s”), va “keyingi qaror
            nuqtasi” (12 m oldinda). Bu HUD — oʻyinchiga koʻrinmaydi, lekin tuning vaqtining{" "}
            <B>60%</B> i aynan shu ekranda oʻtadi. Toʻliq spetsifikatsiya — panellar, probe
            chizmalari, tugmalar, telemetriya va ship xavfsizligi — <B>8-boʻlimda</B>.
          </p>
        </Callout>
      </Sub>
    </Section>
  );
}
