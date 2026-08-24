import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

function LimitedExperimentsDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden="true">
      <defs>
        <pattern id="ledg" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="#0a0a0a" strokeOpacity="0.1" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#ledg)" />
      <circle cx="34" cy="86" r="3.5" fill="#0a0a0a" />
      <circle cx="150" cy="30" r="3.5" fill="#0a0a0a" />
      <circle cx="96" cy="60" r="3.5" fill="#0a0a0a" />
    </svg>
  );
}

function InteractingVariablesDiagram() {
  const nodes = [
    [40, 30],
    [160, 24],
    [100, 66],
    [30, 96],
    [165, 92],
  ];
  const edges: [number, number][] = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [0, 3],
  ];
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="#0a0a0a"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#0a0a0a" />
      ))}
    </svg>
  );
}

function FragmentedLearningDiagram() {
  const boxes: [number, number][] = [
    [10, 20],
    [110, 14],
    [60, 74],
    [140, 78],
  ];
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden="true">
      {boxes.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="34"
          height="24"
          fill="none"
          stroke="#0a0a0a"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

const COLUMNS = [
  {
    label: "Limited experiments",
    body: "Physical experimentation is scarce — a large design space, sampled by very few measured observations.",
    Diagram: LimitedExperimentsDiagram,
  },
  {
    label: "Interacting variables",
    body: "Process parameters affect one another. Understanding one in isolation rarely explains the process.",
    Diagram: InteractingVariablesDiagram,
  },
  {
    label: "Fragmented learning",
    body: "Experimental design, data, modelling assumptions and decisions often live in different systems, or different people.",
    Diagram: FragmentedLearningDiagram,
  },
];

export function Problem() {
  return (
    <section className="bg-surface py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>Problem</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
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

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 sm:grid-cols-3 sm:gap-8 sm:divide-x sm:divide-black/10">
          {COLUMNS.map((column, index) => (
            <Reveal key={column.label} delay={index * 0.08} className="sm:px-6 sm:first:pl-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45">
                {column.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{column.body}</p>
              <column.Diagram />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16 border-t border-black/10 pt-10">
          <p className="text-2xl font-medium tracking-tight text-ink md:text-3xl">
            The process space is larger than the laboratory can physically
            sample.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
