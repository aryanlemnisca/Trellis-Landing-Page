import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const SPECIALISTS = [
  { label: "Design", body: "Informative experiment selection", x: 50, y: 10 },
  { label: "Protocol", body: "Executable experiment planning", x: 88, y: 36 },
  { label: "Data", body: "Experimental data structuring", x: 74, y: 84 },
  { label: "Modelling", body: "Process-model development and evaluation", x: 26, y: 84 },
  { label: "Optimization", body: "Design-space exploration and candidate next experiments", x: 12, y: 36 },
];

const CONTEXT_ITEMS = [
  "Design",
  "Protocols",
  "Data",
  "Assumptions",
  "Models",
  "Results",
  "Uncertainty",
  "Decisions",
];

export function ScientistControl() {
  return (
    <section className="bg-white py-24 md:py-36">
      <div className="container-page text-center">
        <Eyebrow>Scientist-led AI</Eyebrow>
        <Reveal className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[0.95] tracking-tight text-ink md:text-6xl">
          Trellis coordinates the specialists. The scientist makes the
          decisions.
        </Reveal>
        <Reveal delay={0.06} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
          AI coordinates the workflow. Scientific tools perform the analysis.
          The scientist retains decision authority.
        </Reveal>

        <div className="relative mx-auto mt-20 aspect-square w-full max-w-lg md:mt-24">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            {SPECIALISTS.map((node, i) => (
              <line
                key={i}
                x1={50}
                y1={50}
                x2={node.x}
                y2={node.y}
                stroke="#0a0a0a"
                strokeOpacity={0.16}
                strokeWidth={0.35}
              />
            ))}
          </svg>

          {SPECIALISTS.map((node, i) => (
            <Reveal
              key={node.label}
              delay={0.06 * i}
              className="absolute w-36 -translate-x-1/2 -translate-y-1/2 cursor-default sm:w-40"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="rounded-sm border border-black/15 bg-white px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow-sm">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">{node.label}</p>
                <p className="mt-1 text-xs leading-snug text-ink/55">{node.body}</p>
              </div>
            </Reveal>
          ))}

          <Reveal
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default text-center"
            style={{ left: "50%", top: "50%" }}
          >
            <div className="mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full bg-ink transition-transform duration-300 hover:scale-105 sm:h-36 sm:w-36">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">Bioprocess</span>
              <span className="mt-1 text-xl font-bold tracking-tight text-white">Scientist</span>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
              Defines · Reviews · Decides
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mx-auto mt-16 max-w-2xl border-t border-black/10 pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40">
            One shared, versioned process context
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {CONTEXT_ITEMS.map((item) => (
              <span
                key={item}
                className="cursor-default rounded-sm border border-black/15 bg-white/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/70 hover:text-ink hover:shadow-glow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
