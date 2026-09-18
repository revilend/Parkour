import { useMemo, useState } from "react";

const V0 = 6.42; // jump velocity, m/s
const G = 19.6; // gravity, m/s^2
const T_AIR = (2 * V0) / G; // 0.655 s
const SPRINT = 11.0;
const FLOW_MIN = 4.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function readState(speed: number) {
  if (speed < 0.6) return { name: "Idle", tone: "slag" as const };
  if (speed < 3.0) return { name: "Walk", tone: "slag" as const };
  if (speed < 7.5) return { name: "Run", tone: "tracer" as const };
  if (speed <= SPRINT) return { name: "Sprint", tone: "flux" as const };
  return { name: "Overdrive", tone: "alarm" as const };
}

export default function FlowSimulator() {
  const [speed, setSpeed] = useState(7.5);
  const [risk, setRisk] = useState(0.4);

  const d = useMemo(() => {
    const flowNorm = clamp01((speed - FLOW_MIN) / (SPRINT - FLOW_MIN));
    const inFlow = speed >= FLOW_MIN;
    const flowMult = inFlow ? 1 + flowNorm * 0.8 : 1;
    const kc = inFlow ? 6 * flowMult : speed > 0.6 ? 3 : 0;
    const fov = 90 + clamp01((speed - FLOW_MIN) / 10.5) * 12;
    const intensity = 0.5 * clamp01(speed / 13) + 0.3 * flowNorm + 0.2 * clamp01(risk);
    const bpm = Math.round(84 + 48 * intensity);
    const layer =
      intensity < 0.25
        ? "Bed"
        : intensity < 0.5
          ? "Bed + Pulse"
          : intensity < 0.75
            ? "+ Drive"
            : "Full + Overdrive";
    const cutoff = Math.round(400 + 11600 * clamp01(speed / 15));
    const gap = speed * T_AIR;
    const roll = 12 * flowNorm;
    const state = readState(speed);
    return { flowNorm, inFlow, flowMult, kc, fov, intensity, bpm, layer, cutoff, gap, roll, state };
  }, [speed, risk]);

  const pct = (v: number) => `${Math.round(clamp01(v) * 100)}%`;

  return (
    <div className="rounded-lg border border-line-soft bg-ink-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
        <p className="label-mono text-tracer">Interaktiv · Harakat → tizim taʼsiri modeli</p>
        <span className="label-mono text-slag">Formula 2.6.1–2.6.3</span>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
        {/* ---------------- controls + readouts ---------------- */}
        <div className="space-y-5">
          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="label-mono text-slag">Yugurish tezligi</span>
              <span className="font-mono text-sm text-chalk">{speed.toFixed(1)} m/s</span>
            </span>
            <input
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="mt-2 w-full accent-flux"
            />
            <span className="label-mono mt-1 flex justify-between text-[10px] text-slag">
              <span>0 · toʻxtash</span>
              <span className="text-tracer-dim">4.5 · Flow boshlanishi</span>
              <span>11 · sprint cap</span>
              <span>15 · hard cap</span>
            </span>
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="label-mono text-slag">Xatar darajasi (Danger line ulushi)</span>
              <span className="font-mono text-sm text-chalk">{(risk * 100).toFixed(0)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="mt-2 w-full accent-hazard"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: "Holat", v: d.state.name, tone: d.state.tone },
              { k: "Flow", v: d.inFlow ? "FAOL" : "UZILGAN", tone: d.inFlow ? "tracer" : "slag" },
              { k: "KC/qayta", v: `${d.kc.toFixed(1)}/s`, tone: "flux" },
              { k: "FOV", v: `${d.fov.toFixed(0)}°`, tone: "tracer" },
            ].map((item) => (
              <div key={item.k} className="rounded border border-line-soft bg-ink-850 px-3 py-2.5">
                <p className="label-mono text-[10px] text-slag">{item.k}</p>
                <p
                  className={`mt-1 font-mono text-sm ${
                    item.tone === "flux"
                      ? "text-flux"
                      : item.tone === "tracer"
                        ? "text-tracer"
                        : item.tone === "alarm"
                          ? "text-alarm"
                          : "text-slag"
                  }`}
                >
                  {item.v}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded border border-line-soft bg-ink-850/60 p-4">
            {[
              { label: "KC qayta tiklanish koʻpaytiruvchisi", value: d.flowMult, max: 1.8, tone: "bg-flux" },
              { label: "Musiqa intensivligi I", value: d.intensity, max: 1, tone: "bg-tracer" },
              { label: "Kamera roll (devor yugurishi)", value: d.roll / 12, max: 1, tone: "bg-hazard" },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex items-baseline justify-between">
                  <span className="label-mono text-[10px] text-slag">{bar.label}</span>
                  <span className="font-mono text-[11px] text-mist">
                    {bar.value <= 1.8 && bar.value > 1.5
                      ? bar.value.toFixed(2)
                      : bar.value.toFixed(2)}
                    ×
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className={`h-full rounded-full transition-[width] duration-200 ${bar.tone}`}
                    style={{ width: pct(bar.value / bar.max) }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed">
            Bu tezlikda tizim quyidagilarni beradi: <span className="text-chalk">{d.layer}</span>{" "}
            audio qatlami, <span className="text-chalk">{d.bpm} BPM</span> musiqa tempi,{" "}
            <span className="text-chalk">{d.cutoff} Hz</span> low-pass kesish, tekis sakrashda{" "}
            <span className="text-chalk">{d.gap.toFixed(2)} m</span> masofa va FOV{" "}
            <span className="text-chalk">{d.fov.toFixed(0)}°</span>.
          </p>
        </div>

        {/* ---------------- speed strip ---------------- */}
        <div className="relative overflow-hidden rounded-lg border border-line-soft bg-ink-950">
          <div className="mesh-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 border-y border-line-soft/70 opacity-80"
                style={{
                  marginTop: `${i * 26}px`,
                  opacity: 0.85 - i * 0.25,
                }}
              />
            ))}
          </div>
          <div className="relative flex h-[260px] items-center">
            <div
              className="w-full"
              style={{
                animation: `sweep ${Math.max(0.35, 2.6 - speed * 0.16)}s linear infinite`,
                animationPlayState: speed < 0.6 ? "paused" : "running",
              }}
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-tracer to-transparent" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 border-t border-line-soft bg-ink-900/80 px-4 py-3 backdrop-blur-sm">
            <p className="label-mono text-slag">Harakat oqimi</p>
            <p className="mt-1 font-mono text-xs text-mist">
              {speed < 0.6
                ? "// toʻxtash = KC manbasi yoʻq"
                : d.inFlow
                  ? "// flow saqlanmoqda · momentum uzluksiz"
                  : "// sekin — flow 1.4 sek ichida uziladi"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
