import { DocLayout } from "../components/DocLayout";
import S1Vision from "../sections/S1Vision";
import S2Movement from "../sections/S2Movement";
import S3Level from "../sections/S3Level";
import S4Loop from "../sections/S4Loop";
import S5Tech from "../sections/S5Tech";
import S6Audio from "../sections/S6Audio";
import S7Production from "../sections/S7Production";
import S8DebugHud from "../sections/S8DebugHud";

function Cover() {
  const meta = [
    { k: "Hujjat kodi", v: "SPL-GDD-014" },
    { k: "Versiya", v: "1.4" },
    { k: "Holat", v: "Tasdiqlangan" },
    { k: "Sana", v: "18.09.2026" },
    { k: "Muallif", v: "Lead Game Designer / Technical Director" },
    { k: "Maxfiylik", v: "Ichki · NDA" },
  ];

  return (
    <header className="pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="label-mono rounded border border-flux/40 bg-flux/[0.07] px-2.5 py-1 text-flux">
          Game Design &amp; Technical Document
        </span>
        <span className="label-mono rounded border border-line px-2.5 py-1 text-slag">
          Parkour · First-Person · Movement Platformer
        </span>
      </div>

      <h1 className="mt-7 font-display text-5xl leading-[0.95] font-bold tracking-tight text-chalk md:text-7xl">
        SPIRELINE
      </h1>
      <p className="mt-5 max-w-[70ch] text-lg leading-relaxed text-mist">
        Toʻliq ishlab chiqarish hujjati: konsepsiya, harakat mexanikasi, level dizayni, oʻyin sikli,
        texnik arxitektura, audio va dev tooling. Har bir boʻlim studiya darajasidagi{" "}
        <span className="text-chalk">aniq parametrlar</span>, mantiqiy qoidalar va ishlangan
        misollar bilan yozilgan.
      </p>

      <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line-soft bg-line-soft md:grid-cols-3">
        {meta.map((m) => (
          <div key={m.k} className="bg-ink-900 px-4 py-3.5">
            <p className="label-mono text-[10px] text-slag">{m.k}</p>
            <p className="mt-1.5 text-sm text-chalk">{m.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-9 rounded-lg border border-line-soft bg-ink-900/60 p-5">
        <p className="label-mono text-tracer">Hujjatdan qanday foydalanish</p>
        <div className="mt-3 grid gap-3 text-sm leading-relaxed md:grid-cols-3">
          <p>
            <span className="text-chalk">Game Designer</span> — 2, 3 va 4-boʻlimlardagi sonlar va
            qoidalar bilan ishlaydi; har oʻzgarish telemetriya bilan asoslanadi.
          </p>
          <p>
            <span className="text-chalk">Programmer</span> — 5-boʻlimdan toʻgʻridan-toʻgʻri kod
            yozadi; barcha son DataAssetʼga koʻchiriladi.
          </p>
          <p>
            <span className="text-chalk">Audio / Art</span> — 3.1 (Tracer Language) va 6-boʻlim
            yagona qaror hujjati.
          </p>
        </div>
      </div>
    </header>
  );
}

export default function DocumentPage() {
  return (
    <DocLayout>
      <Cover />
      <div className="space-y-16">
        <S1Vision />
        <S2Movement />
        <S3Level />
        <S4Loop />
        <S5Tech />
        <S6Audio />
        <S7Production />
        <S8DebugHud />
      </div>
      <footer className="mt-16 border-t border-line-soft pt-8 pb-16">
        <p className="label-mono text-slag">
          SPIRELINE · SPIRE-LINE Interactive · GDD v1.4 · Ushbu hujjat ichki foydalanish uchun ·
          Nusxalash taqiqlanadi
        </p>
      </footer>
    </DocLayout>
  );
}
