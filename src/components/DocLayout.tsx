import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SECTIONS } from "../data/nav";
import { cn } from "./ui";

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------ progress bar */

function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max <= 0 ? 0 : Math.min(100, Math.max(0, (el.scrollTop / max) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-flux to-tracer transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- scroll spy */

function useActiveAnchor(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: [0, 1] },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ------------------------------------------------------------------ chrome */

export function DocTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-4 px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-[3px] border border-flux/60" />
            <span className="h-2 w-0.5 bg-flux transition-transform duration-300 group-hover:scale-y-150" />
          </span>
          <span className="font-display text-sm font-bold tracking-[0.22em] text-chalk">SPIRELINE</span>
        </Link>
        <span className="hidden h-4 w-px bg-line sm:block" />
        <span className="label-mono hidden text-slag sm:block">GDD v1.4 · Maxfiy</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="label-mono hidden text-slag md:inline">8 boʻlim · 74 bet · UZ</span>
          <Link
            to="/"
            className="label-mono rounded border border-line px-3 py-1.5 text-slag transition-colors hover:border-tracer/50 hover:text-tracer"
          >
            ← Bosh sahifa
          </Link>
        </span>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- the shell */

export function DocLayout({ children }: { children: ReactNode }) {
  const allIds = useMemo(() => SECTIONS.flatMap((s) => s.subs.map((x) => x.id)), []);
  const active = useActiveAnchor(allIds);

  const activeSection = useMemo(
    () => SECTIONS.find((s) => s.subs.some((x) => x.id === active))?.id ?? SECTIONS[0]!.id,
    [active],
  );

  return (
    <div className="min-h-screen bg-ink-950">
      <ReadingProgress />
      <DocTopbar />
      <div className="mx-auto flex max-w-[1500px] gap-10 px-4 py-10 md:px-8">
        <aside className="hidden w-[248px] shrink-0 lg:block">
          <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-10">
            <p className="label-mono mb-4 text-slag">Mundarija</p>
            <ol className="space-y-5">
              {SECTIONS.map((section) => {
                const isCurrent = section.id === activeSection;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToId(section.id);
                      }}
                      className={cn(
                        "flex items-baseline gap-2.5 text-sm transition-colors",
                        isCurrent ? "text-chalk" : "text-mist hover:text-chalk",
                      )}
                    >
                      <span className={cn("font-mono text-[11px]", isCurrent ? "text-flux" : "text-slag")}>
                        {section.index}
                      </span>
                      <span className="font-medium">{section.short}</span>
                    </a>
                    {isCurrent ? (
                      <ul className="mt-2.5 ml-[3px] space-y-1.5 border-l border-line pl-4">
                        {section.subs.map((sub) => (
                          <li key={sub.id}>
                            <a
                              href={`#${sub.id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                scrollToId(sub.id);
                              }}
                              className={cn(
                                "block py-0.5 text-[13px] transition-colors",
                                active === sub.id ? "text-tracer" : "text-slag hover:text-mist",
                              )}
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
