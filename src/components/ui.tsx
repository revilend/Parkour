import type { ReactNode } from "react";
import { useState } from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------------- Section */

export function Section({
  id,
  index,
  title,
  kicker,
  children,
}: {
  id: string;
  index: string;
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line-soft pt-12 pb-4 first:border-t-0">
      <div className="flex items-start gap-5">
        <span className="font-mono text-5xl leading-none font-semibold text-ink-700 select-none md:text-6xl">
          {index}
        </span>
        <div className="min-w-0 pt-1">
          <p className="label-mono text-flux">{kicker}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        </div>
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-flux/60 via-line to-transparent" />
      <div className="mt-8 space-y-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------- Sub */

export function Sub({
  id,
  num,
  title,
  hint,
  children,
}: {
  id: string;
  num: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-tracer-dim">{num}</span>
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
        {hint ? <span className="label-mono text-slag">{hint}</span> : null}
      </div>
      <div className="mt-4 space-y-5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Text */

export function P({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("max-w-[76ch] leading-relaxed text-mist", className)}>{children}</p>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="max-w-[76ch] text-lg leading-relaxed text-chalk/90">{children}</p>;
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-chalk">{children}</strong>;
}

export function K({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-line-soft bg-ink-850 px-1.5 py-0.5 font-mono text-[0.8em] text-tracer">
      {children}
    </code>
  );
}

export function Bullets({ items, tone = "flux" }: { items: ReactNode[]; tone?: Signal }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", dotFor(tone))} />
          <span className="max-w-[76ch]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ items }: { items: Array<{ title: string; body: ReactNode }> }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[11px] text-tracer">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-chalk">{item.title}</p>
            <div className="mt-1 leading-relaxed">{item.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- Signals */

export type Signal = "flux" | "tracer" | "hazard" | "alarm" | "neutral";

const dotFor = (tone: Signal) =>
  ({
    flux: "bg-flux",
    tracer: "bg-tracer",
    hazard: "bg-hazard",
    alarm: "bg-alarm",
    neutral: "bg-slag",
  })[tone];

const ringFor = (tone: Signal) =>
  ({
    flux: "border-flux/40 bg-flux/[0.07]",
    tracer: "border-tracer/40 bg-tracer/[0.06]",
    hazard: "border-hazard/40 bg-hazard/[0.06]",
    alarm: "border-alarm/40 bg-alarm/[0.06]",
    neutral: "border-line bg-ink-850/60",
  })[tone];

const textFor = (tone: Signal) =>
  ({
    flux: "text-flux",
    tracer: "text-tracer",
    hazard: "text-hazard",
    alarm: "text-alarm",
    neutral: "text-slag",
  })[tone];

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Signal;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded border px-2 py-1 leading-none",
        ringFor(tone),
        textFor(tone),
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Callout({
  tone = "flux",
  label,
  title,
  children,
}: {
  tone?: Signal;
  label: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-r-lg border-l-2 py-4 pr-5 pl-5", ringFor(tone))}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("label-mono", textFor(tone))}>{label}</span>
        {title ? <span className="font-display text-sm font-semibold text-chalk">{title}</span> : null}
      </div>
      <div className="mt-2.5 space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------- Table */

export type Column = { key: string; label: string; align?: "left" | "right" | "center" };

export function Table({
  columns,
  rows,
  caption,
  compact = false,
}: {
  columns: Column[];
  rows: ReactNode[][];
  caption?: string;
  compact?: boolean;
}) {
  return (
    <figure className="w-full">
      <div className="overflow-x-auto rounded-lg border border-line-soft bg-ink-900/60">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-ink-850/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "label-mono px-4 py-3 font-medium whitespace-nowrap text-slag",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-line-soft/70 transition-colors last:border-b-0 hover:bg-ink-800/50"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-4 align-top text-mist",
                      compact ? "py-2.5" : "py-3.5",
                      columns[j]?.align === "right" && "text-right",
                      columns[j]?.align === "center" && "text-center",
                      j === 0 && "font-medium text-chalk",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <figcaption className="label-mono mt-2.5 text-slag">{caption}</figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ Code */

export function CodeBlock({
  file,
  code,
  caption,
  tone = "tracer",
}: {
  file: string;
  code: string;
  caption?: string;
  tone?: Signal;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      },
      () => undefined,
    );
  };

  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-lg border border-line-soft bg-ink-950">
        <div className="flex items-center justify-between gap-4 border-b border-line-soft bg-ink-900 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotFor(tone))} />
            <span className="label-mono truncate text-slag">{file}</span>
          </div>
          <button
            type="button"
            onClick={copy}
            className="label-mono shrink-0 rounded border border-line px-2 py-1 text-slag transition-colors hover:border-tracer/50 hover:text-tracer"
          >
            {copied ? "Nusxalandi" : "Nusxa"}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-chalk/85">
          <code>{code}</code>
        </pre>
      </div>
      {caption ? <figcaption className="label-mono mt-2.5 text-slag">{caption}</figcaption> : null}
    </figure>
  );
}

/* ----------------------------------------------------------------- Metric */

export function Metrics({ items }: { items: Array<{ value: string; unit?: string; label: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line-soft bg-line-soft md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-ink-900 p-4">
          <p className="font-mono text-2xl leading-none font-semibold text-chalk">
            {item.value}
            {item.unit ? <span className="ml-1 text-xs text-slag">{item.unit}</span> : null}
          </p>
          <p className="label-mono mt-2.5 text-slag">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("panel p-5 md:p-6", className)}>{children}</div>;
}

export function PanelTitle({ children, tone = "flux" }: { children: ReactNode; tone?: Signal }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className={cn("h-3 w-0.5", dotFor(tone))} />
      <h4 className="font-display text-base font-semibold tracking-tight text-chalk">{children}</h4>
    </div>
  );
}
