import { useMemo, useState } from "react";

const G_REAL = 9.8;
const COYOTE_FRAMES = 7;
const BUFFER_FRAMES = 9;

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
};

function Slider({ label, value, min, max, step, unit, onChange }: SliderProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="label-mono text-slag">{label}</span>
        <span className="font-mono text-[12.5px] text-chalk">
          {value.toFixed(2)} <span className="text-slag">{unit}</span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-tracer"
      />
    </label>
  );
}

export default function MovementCalculator() {
  const [gravityMult, setGravityMult] = useState(2);
  const [jumpV, setJumpV] = useState(6.42);
  const [runSpeed, setRunSpeed] = useState(7.5);
  const [sprintSpeed, setSprintSpeed] = useState(11);

  const m = useMemo(() => {
    const g = G_REAL * gravityMult;
    const height = (jumpV * jumpV) / (2 * g);
    const tAir = (2 * jumpV) / g;
    const gapRun = runSpeed * tAir;
    const gapSprint = sprintSpeed * tAir;
    const descend = (jumpV * jumpV) / g; // total vertical drop back to start level

    const tiers = [
      { name: "Yugurishdan oson", limit: gapRun * 0.6, tone: "text-tracer" },
      { name: "Sprint talab", limit: gapRun * 0.73, tone: "text-tracer" },
      { name: "Toza timing", limit: gapRun * 0.93, tone: "text-flux" },
      { name: "Wall Jump / Rail kerak", limit: gapRun, tone: "text-flux" },
      { name: "Air Brake / Phase Dash", limit: gapSprint, tone: "text-hazard" },
      { name: "Faqat Launch / zanjir", limit: Infinity, tone: "text-alarm" },
    ];

    const verdict = (dist: number) => {
      const t = tiers.find((x) => dist <= x.limit);
      return t ?? tiers[tiers.length - 1]!;
    };

    return { g, height, tAir, gapRun, gapSprint, descend, tiers, verdict };
  }, [gravityMult, jumpV, runSpeed, sprintSpeed]);

  /* ------------------------------- arc geometry ------------------------------- */
  const W = 620;
  const H = 210;
  const GROUND = 172;
  const PAD = 26;
  const vScale = 58;
  const hScale = (W - PAD * 2) / Math.max(m.gapSprint, 6);

  const path = (speed: number) => {
    const pts: string[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const t = (m.tAir * i) / steps;
      const x = speed * t;
      const y = jumpV * t - 0.5 * m.g * t * t;
      pts.push(`${(PAD + x * hScale).toFixed(1)},${(GROUND - y * vScale).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const runPath = path(runSpeed);
  const sprintPath = path(sprintSpeed);
  const peakY = GROUND - m.height * vScale;

  const standard = [4.5, 5.5, 7, 7.5, 9.5, 12];

  return (
    <div className="rounded-lg border border-line-soft bg-ink-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
        <p className="label-mono text-tracer">Interaktiv · Reachability kalkulyatori</p>
        <span className="label-mono text-slag">Formulalar 5.3.1–5.3.4</span>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[300px_minmax(0,1fr)] md:p-6">
        <div className="space-y-5">
          <Slider
            label="Gravitatsiya multiplikatori"
            value={gravityMult}
            min={1.4}
            max={3}
            step={0.05}
            unit="× 9.8 m/s²"
            onChange={setGravityMult}
          />
          <Slider
            label="Sakrash kuchi (v₀)"
            value={jumpV}
            min={5}
            max={9}
            step={0.02}
            unit="m/s"
            onChange={setJumpV}
          />
          <Slider
            label="Yugurish tezligi"
            value={runSpeed}
            min={5}
            max={10}
            step={0.1}
            unit="m/s"
            onChange={setRunSpeed}
          />
          <Slider
            label="Sprint tezligi"
            value={sprintSpeed}
            min={8}
            max={13}
            step={0.1}
            unit="m/s"
            onChange={setSprintSpeed}
          />

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded border border-line-soft bg-line-soft">
            {[
              { k: "Sakrash balandligi", v: `${m.height.toFixed(2)} m` },
              { k: "Havo vaqti", v: `${m.tAir.toFixed(3)} s` },
              { k: "Gap · yugurish", v: `${m.gapRun.toFixed(2)} m` },
              { k: "Gap · sprint", v: `${m.gapSprint.toFixed(2)} m` },
              { k: `Coyote (${COYOTE_FRAMES} kadr)`, v: "0.117 s" },
              { k: `Buffer (${BUFFER_FRAMES} kadr)`, v: "0.150 s" },
            ].map((cell) => (
              <div key={cell.k} className="bg-ink-850 px-3 py-2.5">
                <p className="label-mono text-[10px] text-slag">{cell.k}</p>
                <p className="mt-1 font-mono text-[13px] text-tracer">{cell.v}</p>
              </div>
            ))}
          </div>

          <p className="label-mono text-[10px] leading-relaxed text-slag">
            g = 9.8 × {gravityMult.toFixed(2)} = {m.g.toFixed(2)} m/s² · t_air = 2v₀/g · gap =
            v_yugurish × t_air (tekis sath, shamolsiz)
          </p>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-lg border border-line-soft bg-ink-950">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Sakrash trayektoriyasi">
              {/* tier bands */}
              {[
                { x: m.gapRun * 0.93, label: "timing", color: "#FF6A1F" },
                { x: m.gapRun, label: "run", color: "#FF6A1F" },
                { x: m.gapSprint, label: "sprint", color: "#FFC53D" },
              ].map((band) => (
                <g key={band.label}>
                  <line
                    x1={PAD + band.x * hScale}
                    x2={PAD + band.x * hScale}
                    y1={16}
                    y2={GROUND}
                    stroke={band.color}
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    opacity="0.45"
                  />
                  <text
                    x={PAD + band.x * hScale + 4}
                    y={24}
                    fill={band.color}
                    fontSize="9"
                    fontFamily="IBM Plex Mono, monospace"
                    opacity="0.8"
                  >
                    {band.label}
                  </text>
                </g>
              ))}

              {/* ground */}
              <line x1="0" x2={W} y1={GROUND} y2={GROUND} stroke="#22303f" strokeWidth="1.5" />

              {/* arcs */}
              <polyline points={sprintPath} fill="none" stroke="#FF6A1F" strokeWidth="2" />
              <polyline points={runPath} fill="none" stroke="#2FE0C4" strokeWidth="2" />

              {/* apex marker */}
              <circle cx={PAD + (runSpeed * (m.tAir / 2)) * hScale} cy={peakY} r="3" fill="#2FE0C4" />
              <line
                x1={PAD}
                x2={PAD + (runSpeed * (m.tAir / 2)) * hScale}
                y1={peakY}
                y2={peakY}
                stroke="#2FE0C4"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />
              <text x={PAD + 4} y={peakY - 6} fill="#2FE0C4" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                h = {m.height.toFixed(2)} m
              </text>

              <text x={W - PAD} y={GROUND + 16} textAnchor="end" fill="#64748b" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                {m.gapSprint.toFixed(1)} m
              </text>
              <text x={PAD} y={GROUND + 16} fill="#64748b" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                0
              </text>
            </svg>
            <div className="flex flex-wrap items-center gap-4 border-t border-line-soft px-4 py-2.5">
              <span className="label-mono flex items-center gap-2 text-tracer">
                <span className="h-[2px] w-5 bg-tracer" /> yugurish {runSpeed.toFixed(1)} m/s
              </span>
              <span className="label-mono flex items-center gap-2 text-flux">
                <span className="h-[2px] w-5 bg-flux" /> sprint {sprintSpeed.toFixed(1)} m/s
              </span>
            </div>
          </div>

          <div>
            <p className="label-mono mb-3 text-slag">
              Standart boʻshliqlar — shu parametrlar bilan
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {standard.map((dist) => {
                const v = m.verdict(dist);
                return (
                  <div key={dist} className="rounded border border-line-soft bg-ink-850 px-3 py-2.5">
                    <p className="font-mono text-[13px] text-chalk">{dist.toFixed(1)} m</p>
                    <p className={`label-mono mt-1 text-[10px] ${v.tone}`}>{v.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
