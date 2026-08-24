import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RevealCard } from "@/components/ui/RevealCard";
import { GlowOrbs } from "@/components/ui/GlowOrbs";
import { GLASS_LIGHT, GLASS_HOVER } from "@/lib/glass";

function OptimizeDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden="true">
      <circle cx="120" cy="60" r="46" fill="none" stroke="#0a0a0a" strokeOpacity="0.12" strokeWidth="1" />
      <circle cx="120" cy="60" r="30" fill="none" stroke="#0a0a0a" strokeOpacity="0.16" strokeWidth="1" />
      <circle
        cx="120"
        cy="60"
        r="16"
        fill="#38afd8"
        fillOpacity="0.14"
        stroke="#38afd8"
        strokeOpacity="0.5"
        strokeWidth="1"
        className="origin-center transition-transform duration-300 group-hover:scale-125"
        style={{ transformOrigin: "120px 60px" }}
      />
      <circle
        cx="46"
        cy="86"
        r="3"
        fill="#0a0a0a"
        className="origin-center transition-transform duration-300 group-hover:scale-150"
        style={{ transformOrigin: "46px 86px", transitionDelay: "80ms" }}
      />
      <circle
        cx="70"
        cy="40"
        r="3"
        fill="#0a0a0a"
        className="origin-center transition-transform duration-300 group-hover:scale-150"
        style={{ transformOrigin: "70px 40px", transitionDelay: "140ms" }}
      />
    </svg>
  );
}

function RecoverDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden="true">
      <path
        d="M10 90 C 70 90, 90 40, 190 20"
        fill="none"
        stroke="#0a0a0a"
        strokeOpacity="0.45"
        strokeWidth="1.25"
        className="transition-all duration-300 group-hover:stroke-[#38afd8] group-hover:stroke-opacity-70"
      />
      <path
        d="M10 90 C 70 90, 100 95, 190 100"
        fill="none"
        stroke="#0a0a0a"
        strokeOpacity="0.2"
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <circle
        cx="86"
        cy="60"
        r="3.5"
        fill="none"
        stroke="#38afd8"
        strokeWidth="1.25"
        className="origin-center transition-transform duration-300 group-hover:scale-150"
        style={{ transformOrigin: "86px 60px" }}
      />
      <circle
        cx="98"
        cy="88"
        r="3.5"
        fill="none"
        stroke="#38afd8"
        strokeWidth="1.25"
        className="origin-center transition-transform duration-300 group-hover:scale-150"
        style={{ transformOrigin: "98px 88px", transitionDelay: "80ms" }}
      />
    </svg>
  );
}

function DeRiskDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden="true">
      <rect x="20" y="20" width="160" height="80" fill="none" stroke="#0a0a0a" strokeOpacity="0.12" strokeWidth="1" />
      <rect
        x="50"
        y="42"
        width="80"
        height="46"
        fill="#38afd8"
        fillOpacity="0.1"
        stroke="#38afd8"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="4 3"
        className="origin-center transition-transform duration-300 group-hover:scale-105"
        style={{ transformOrigin: "90px 65px" }}
      />
      <circle
        cx="152"
        cy="34"
        r="3"
        fill="none"
        stroke="#0a0a0a"
        strokeOpacity="0.4"
        strokeWidth="1"
        className="origin-center transition-all duration-300 group-hover:scale-150 group-hover:stroke-[#38afd8] group-hover:stroke-opacity-80"
        style={{ transformOrigin: "152px 34px" }}
      />
      <circle
        cx="38"
        cy="88"
        r="3"
        fill="none"
        stroke="#0a0a0a"
        strokeOpacity="0.4"
        strokeWidth="1"
        className="origin-center transition-all duration-300 group-hover:scale-150 group-hover:stroke-[#38afd8] group-hover:stroke-opacity-80"
        style={{ transformOrigin: "38px 88px", transitionDelay: "80ms" }}
      />
    </svg>
  );
}

const PANELS = [
  {
    label: "Optimize",
    body: "Move beyond an acceptable condition toward stronger process performance, while respecting relevant constraints.",
    Diagram: OptimizeDiagram,
  },
  {
    label: "Recover",
    body: "Investigate low or variable performance by ranking hypotheses and choosing experiments that distinguish between them.",
    Diagram: RecoverDiagram,
  },
  {
    label: "De-risk",
    body: "Identify supported ranges, consequential interactions and evidence gaps before committing to later development decisions.",
    Diagram: DeRiskDiagram,
  },
];

export function Applications() {
  return (
    <section className="bg-surface py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>Applications</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-4xl font-bold leading-[0.95] tracking-tight text-ink md:text-6xl">
          Different development questions. The same learning loop.
        </Reveal>
        <Reveal delay={0.06} className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/35">
          Illustrative application
        </Reveal>

        <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <GlowOrbs />
          {PANELS.map((panel, index) => (
            <RevealCard
              key={panel.label}
              delay={index * 0.1}
              className={`relative p-8 ${GLASS_LIGHT} ${GLASS_HOVER} cursor-default`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">{panel.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{panel.body}</p>
              <div className="mt-5">
                <panel.Diagram />
              </div>
            </RevealCard>
          ))}
        </div>

        <Reveal delay={0.28} className="mt-8 flex items-baseline gap-4 border-t border-black/10 pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45">Adapt</p>
          <p className="text-sm leading-relaxed text-ink/55">
            Determine what can remain fixed and what needs to be relearned
            when a process changes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
