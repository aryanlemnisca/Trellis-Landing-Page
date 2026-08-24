"use client";

import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, revealViewport } from "@/lib/motion";

const NODES = [
  {
    key: "experiments",
    label: "Informative experiments",
    body: "Each physical run is chosen partly for what it can teach.",
    x: 16,
    y: 14,
  },
  {
    key: "model",
    label: "Predictive process model",
    body: "Experimental evidence updates a model of process behaviour, with uncertainty made explicit.",
    x: 84,
    y: 14,
  },
  {
    key: "virtual",
    label: "Virtual process space",
    body: "The model explores conditions that cannot all be physically tested, and surfaces candidate regions.",
    x: 50,
    y: 86,
  },
] as const;

const EDGES: { from: number; to: number; label?: string }[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 0, label: "MODEL → NEXT EXPERIMENT" },
];

/** Shrink each end by a fixed fraction so the line — and its arrowhead — stop short of the node dot. */
function edgePath(a: (typeof NODES)[number], b: (typeof NODES)[number]) {
  const inset = 0.12;
  const x1 = a.x + (b.x - a.x) * inset;
  const y1 = a.y + (b.y - a.y) * inset;
  const x2 = a.x + (b.x - a.x) * (1 - inset);
  const y2 = a.y + (b.y - a.y) * (1 - inset);
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export function NewParadigm() {
  return (
    <section className="bg-white py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>The new paradigm</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Let experiments build the model that guides the experiments.
        </Reveal>

        <div className="relative mx-auto mt-20 aspect-square w-full max-w-xl md:mt-24">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <marker id="paradigm-arrow" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38afd8" />
              </marker>
            </defs>
            {EDGES.map((edge, i) => (
              <motion.path
                key={i}
                d={edgePath(NODES[edge.from], NODES[edge.to])}
                fill="none"
                stroke="#38afd8"
                strokeOpacity={0.55}
                strokeWidth={0.4}
                markerEnd="url(#paradigm-arrow)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={revealViewport}
                transition={{ duration: 1, delay: i * 0.25, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {EDGES.filter((e) => e.label).map((edge, i) => {
            const a = NODES[edge.from];
            const b = NODES[edge.to];
            return (
              <span
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-accent"
                style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2 + 8}%` }}
              >
                {edge.label}
              </span>
            );
          })}

          {NODES.map((node, i) => (
            <motion.div
              key={node.key}
              className="absolute w-44 -translate-x-1/2 -translate-y-1/2 text-center sm:w-56"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              transition={{ delay: 0.15 + i * 0.1 }}
            >
              <div className="mx-auto h-2 w-2 rounded-full bg-accent" />
              <p className="mt-3 text-sm font-medium text-ink">{node.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/55">{node.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
