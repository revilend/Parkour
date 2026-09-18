type Tier = {
  priority: number;
  name: string;
  tone: string;
  border: string;
  states: string[];
  note: string;
};

const TIERS: Tier[] = [
  {
    priority: 100,
    name: "Disabled",
    tone: "text-alarm",
    border: "border-alarm/40",
    states: ["Death", "Respawn", "Capture"],
    note: "Boshqa barcha holatlarni uzadi",
  },
  {
    priority: 80,
    name: "Interaction",
    tone: "text-alarm",
    border: "border-alarm/30",
    states: ["Hit", "Stagger", "Recover", "ForcedMove"],
    note: "0.9 sek dan oshmaydi (P1 ustuni)",
  },
  {
    priority: 60,
    name: "Traversal",
    tone: "text-flux",
    border: "border-flux/40",
    states: ["Vault", "SpeedVault", "Mantle", "Roll", "Zipline", "Launch"],
    note: "Root Motion boshqaradi, kod tezlikni tiklaydi",
  },
  {
    priority: 40,
    name: "Wall",
    tone: "text-hazard",
    border: "border-hazard/40",
    states: ["WallRunL", "WallRunR", "WallClimb", "WallJump"],
    note: "Kirish sharti: devor normal ⟨ right ⟩ < −0.35",
  },
  {
    priority: 30,
    name: "Airborne",
    tone: "text-tracer",
    border: "border-tracer/40",
    states: ["JumpRise", "Apex", "Fall", "Coyote", "Snag"],
    note: "Apex: 0.18 sek ×0.85 gravitatsiya",
  },
  {
    priority: 10,
    name: "Grounded",
    tone: "text-tracer-dim",
    border: "border-line",
    states: ["Idle", "Run", "Sprint", "Slide", "Crouch"],
    note: "Bazaviy holat — hamma narsa shu yerga qaytadi",
  },
];

export default function StateMachineDiagram() {
  return (
    <div className="rounded-lg border border-line-soft bg-ink-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
        <p className="label-mono text-tracer">Sxema 5.1.1 · HFSM — ustuvorlik zinalari</p>
        <span className="label-mono text-slag">Har bir kadrda qayta baholanadi</span>
      </div>

      <div className="p-5 md:p-6">
        <ol className="space-y-3">
          {TIERS.map((tier) => (
            <li key={tier.name} className="flex items-stretch gap-4">
              <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded border border-line-soft bg-ink-950">
                <span className={`font-mono text-sm font-semibold ${tier.tone}`}>{tier.priority}</span>
                <span className="label-mono text-[9px] text-slag">prio</span>
              </div>
              <div className={`min-w-0 flex-1 rounded border ${tier.border} bg-ink-850/60 px-4 py-3`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className={`font-display text-sm font-semibold ${tier.tone}`}>{tier.name}</span>
                  <span className="label-mono text-[10px] text-slag">{tier.note}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {tier.states.map((state) => (
                    <span
                      key={state}
                      className="rounded border border-line bg-ink-950 px-2.5 py-1 font-mono text-[11.5px] text-mist"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded border border-line-soft bg-ink-850/50 px-4 py-3.5">
          <p className="label-mono text-slag">Mantiq</p>
          <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-mist">
            best = null
            <br />
            for T in transitions: <span className="text-tracer">if</span> T.priority &gt;
            best.priority <span className="text-tracer">and</span> T.canEnter(state, probe): best = T
            <br />
            <span className="text-flux">if</span> best.target !== current: current.exit(); current =
            best.target; current.enter()
          </p>
        </div>
      </div>
    </div>
  );
}
