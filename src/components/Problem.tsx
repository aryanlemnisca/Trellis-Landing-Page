import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

function GridBackground({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="#0a0a0a" strokeOpacity="0.1" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill={`url(#${id})`} />
    </>
  );
}

function LimitedExperimentsDiagram() {
  const dots: [number, number][] = [
    [34, 86],
    [150, 30],
    [96, 60],
  ];
  return (
    <svg viewBox="0 0 200 120" className="h-28 w-full" aria-hidden="true">
      <GridBackground id="problem-grid-1" />
      {dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          fill="#0a0a0a"
          className="origin-center transition-all duration-300 group-hover:scale-[1.6]"
          style={{ transformOrigin: `${cx}px ${cy}px`, transitionDelay: `${i * 60}ms` }}
        />
      ))}
      {/* the next candidate — a hollow ring that only appears on hover */}
      <circle
        cx={150}
        cy={90}
        r="4.5"
        fill="none"
        stroke="#38afd8"
        strokeWidth="1.5"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ transitionDelay: "220ms" }}
      />
    </svg>
  );
}

function InteractingVariablesDiagram() {
  const nodes: [number, number][] = [
    [55, 92],
    [153, 88],
    [104, 34],
    [183, 62],
  ];
  const edges: [number, number][] = [
    [0, 2],
    [1, 2],
    [0, 1],
    [2, 3],
  ];
  return (
    <svg viewBox="0 0 200 120" className="h-28 w-full" aria-hidden="true">
      <GridBackground id="problem-grid-2" />
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="#0a0a0a"
          strokeOpacity="0.22"
          strokeWidth="1"
          className="transition-all duration-300 group-hover:stroke-[#38afd8] group-hover:stroke-opacity-50"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="6.5"
          fill="#f5f5f5"
          stroke="#0a0a0a"
          strokeWidth="1.5"
          className="origin-center transition-all duration-300 group-hover:scale-125 group-hover:fill-[#38afd8]/15 group-hover:stroke-[#38afd8]"
          style={{ transformOrigin: `${x}px ${y}px`, transitionDelay: `${i * 60}ms` }}
        />
      ))}
    </svg>
  );
}

const CONTEXT_BOXES = ["Design", "Data", "Model", "Decision"];

function FragmentedLearningDiagram() {
  return (
    <div className="grid h-28 grid-cols-2 gap-3">
      {CONTEXT_BOXES.map((label, i) => (
        <div
          key={label}
          className="flex items-center justify-center rounded-sm border border-black/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/50"
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/50">{label}</span>
        </div>
      ))}
    </div>
  );
}

const COLUMNS = [
  {
    number: "01",
    label: "Limited experiments",
    title: "Physical experimentation is scarce.",
    body: "The design space is far larger than the laboratory can physically sample.",
    Diagram: LimitedExperimentsDiagram,
  },
  {
    number: "02",
    label: "Interacting variables",
    title: "Parameters affect one another.",
    body: "Understanding one variable in isolation rarely explains the process.",
    Diagram: InteractingVariablesDiagram,
  },
  {
    number: "03",
    label: "Fragmented learning",
    title: "Context breaks between tools.",
    body: "Design, evidence, assumptions, models and decisions often live in different systems, or different people.",
    Diagram: FragmentedLearningDiagram,
  },
];

export function Problem() {
  return (
    <section className="bg-surface py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>Problem</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-4xl font-bold leading-[0.95] tracking-tight text-ink md:text-6xl">
          The best process you have tested is not necessarily the best
          process you can achieve.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/60">
          Bioprocess teams must understand a large, interacting design space
          using a small number of expensive experiments. The task is never
          just to find a condition that works — it&apos;s to determine what
          variables matter, what interactions matter, where performance may
          remain unexplored, where the process is robust, and what evidence
          is still missing.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 border-t border-black/10 pt-10 sm:grid-cols-3 sm:divide-x sm:divide-black/10">
          {COLUMNS.map((column, index) => (
            <Reveal
              key={column.label}
              delay={index * 0.1}
              className="group cursor-default pb-10 sm:px-8 sm:pb-0 sm:first:pl-0 sm:last:pr-0"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45">
                {column.number} / {column.label}
              </p>
              <div className="mt-6">
                <column.Diagram />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-ink">{column.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/55">{column.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16 border-t border-black/10 pt-10">
          <p className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
            The process space is larger than the laboratory can physically
            sample.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
