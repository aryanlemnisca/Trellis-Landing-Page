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

function InformativeExperimentsDiagram() {
  const dots: [number, number][] = [
    [34, 86],
    [150, 30],
    [96, 60],
  ];
  return (
    <svg viewBox="0 0 200 120" className="h-28 w-full" aria-hidden="true">
      <GridBackground id="paradigm-grid" />
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

function PredictiveProcessModelDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="h-28 w-full" aria-hidden="true">
      <path
        d="M10,50 C60,0 140,0 190,40 L190,80 C140,40 60,40 10,90 Z"
        fill="#38afd8"
        className="origin-center transition-all duration-300 group-hover:scale-105"
        fillOpacity="0.15"
        style={{ transformOrigin: "100px 60px" }}
      />
      <path
        d="M10,70 C60,20 140,20 190,60"
        fill="none"
        stroke="#38afd8"
        strokeWidth="2"
        className="origin-center transition-all duration-300 group-hover:scale-105"
        style={{ transformOrigin: "100px 60px" }}
      />
    </svg>
  );
}

function VirtualProcessSpaceDiagram() {
  const rings = [70, 58, 46, 34];
  return (
    <svg viewBox="0 0 200 120" className="h-28 w-full" aria-hidden="true">
      {rings.map((rx, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="60"
          rx={rx}
          ry={rx * 0.6}
          fill="none"
          stroke="#0a0a0a"
          strokeOpacity={0.06 + i * 0.03}
          strokeWidth="1"
        />
      ))}
      <ellipse
        cx="118"
        cy="52"
        rx="22"
        ry="14"
        fill="#38afd8"
        fillOpacity="0.16"
        stroke="#38afd8"
        strokeOpacity="0.55"
        strokeWidth="1"
        className="origin-center transition-all duration-300 group-hover:scale-110"
        style={{ transformOrigin: "118px 52px" }}
      />
    </svg>
  );
}

const STAGES = [
  {
    number: "01",
    title: "Informative experiments",
    body: "Each physical run is chosen partly for what it can teach.",
    Diagram: InformativeExperimentsDiagram,
  },
  {
    number: "02",
    title: "Predictive process model",
    body: "Experimental evidence updates a model of process behaviour, with uncertainty made explicit.",
    Diagram: PredictiveProcessModelDiagram,
  },
  {
    number: "03",
    title: "Virtual process space",
    body: "The model explores conditions that cannot all be physically tested, and surfaces candidate regions.",
    Diagram: VirtualProcessSpaceDiagram,
  },
] as const;

const FLOW_ARROWS = [
  { left: 33.33, label: "Evidence" },
  { left: 66.66, label: "Explore" },
];

function FlowArrow({ left, label }: { left: number; label: string }) {
  return (
    <div className="absolute top-10 hidden -translate-x-1/2 flex-col items-center sm:flex" style={{ left: `${left}%` }}>
      <p className="mb-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.15em] text-accent">
        {label}
      </p>
      <svg width="64" height="14" viewBox="0 0 64 14" aria-hidden="true">
        <line x1="0" y1="7" x2="52" y2="7" stroke="#38afd8" strokeOpacity="0.6" strokeWidth="1" />
        <path d="M52 3 L60 7 L52 11 Z" fill="#38afd8" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

export function NewParadigm() {
  return (
    <section className="bg-surface py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>The new paradigm</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-4xl font-bold leading-[0.95] tracking-tight text-ink md:text-6xl">
          Let experiments build the model that guides the experiments.
        </Reveal>

        <div className="relative mt-16 border-t border-black/10 pt-10">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-10">
            {STAGES.map((stage, index) => (
              <Reveal key={stage.title} delay={index * 0.1} className="group cursor-default">
                <div className="h-28">
                  <stage.Diagram />
                </div>
                <p className="mt-6 font-mono text-xs text-ink/40">{stage.number}</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{stage.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-10 h-28">
            {FLOW_ARROWS.map((arrow) => (
              <FlowArrow key={arrow.label} left={arrow.left} label={arrow.label} />
            ))}
          </div>
        </div>

        <Reveal delay={0.3} className="mx-auto mt-10 max-w-xl rounded-sm border border-black/10 py-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
            Model → Next experiment
          </p>
        </Reveal>
      </div>
    </section>
  );
}
