import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const SPECIALISTS = [
  { label: "Design", body: "Informative experiment selection", x: 50, y: 11 },
  { label: "Protocol", body: "Executable experiment planning", x: 87, y: 38 },
  { label: "Data", body: "Experimental data structuring", x: 72, y: 82 },
  { label: "Modelling", body: "Process-model development and evaluation", x: 28, y: 82 },
  { label: "Optimization", body: "Design-space exploration and candidate next experiments", x: 13, y: 38 },
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
      <div className="container-page">
        <Eyebrow>Scientist-led AI</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Trellis coordinates the specialists. The scientist makes the
          decisions.
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
                strokeOpacity={0.14}
                strokeWidth={0.35}
              />
            ))}
          </svg>

          {SPECIALISTS.map((node, i) => (
            <Reveal
              key={node.label}
              delay={0.06 * i}
              className="absolute w-32 -translate-x-1/2 -translate-y-1/2 text-center sm:w-40"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="mx-auto h-2 w-2 rounded-full border border-ink/30 bg-white" />
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/70">
                {node.label}
              </p>
              <p className="mt-1 text-xs leading-snug text-ink/45">{node.body}</p>
            </Reveal>
          ))}

          <Reveal
            className="absolute w-36 -translate-x-1/2 -translate-y-1/2 text-center sm:w-44"
            style={{ left: "50%", top: "50%" }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm border border-accent/50 bg-surface sm:h-20 sm:w-20">
              <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.1em] text-ink">
                Bioprocess
                <br />
                scientist
              </span>
            </div>
            <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
              Defines · Reviews · Decides
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-xl text-center">
          <p className="text-lg leading-relaxed text-ink/60">
            AI coordinates the workflow. Scientific tools perform the
            analysis. The scientist retains decision authority.
          </p>
        </Reveal>

        <Reveal delay={0.16} className="mx-auto mt-14 max-w-2xl border-t border-black/10 pt-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40">
            One shared, versioned process context
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {CONTEXT_ITEMS.map((item) => (
              <span
                key={item}
                className="rounded-sm border border-black/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60"
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
