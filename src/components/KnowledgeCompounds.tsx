"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

type Node = { id: string; x: number; y: number; label?: string };

/** Five labeled concepts, plus filler nodes that flesh out the mesh between them. */
const NODES: Node[] = [
  { id: "interactions", x: 30, y: 8, label: "Interactions" },
  { id: "assumptions", x: 76, y: 15, label: "Assumptions" },
  { id: "observations", x: 10, y: 58, label: "Observations" },
  { id: "uncertainty", x: 90, y: 50, label: "Uncertainty" },
  { id: "decisions", x: 60, y: 36, label: "Decisions" },
  { id: "f1", x: 16, y: 30 },
  { id: "f2", x: 45, y: 15 },
  { id: "f3", x: 58, y: 8 },
  { id: "f4", x: 37, y: 40 },
  { id: "f5", x: 21, y: 45 },
  { id: "f6", x: 49, y: 55 },
  { id: "f7", x: 71, y: 30 },
  { id: "f8", x: 80, y: 63 },
  { id: "f9", x: 39, y: 62 },
  { id: "f10", x: 63, y: 58 },
  { id: "f11", x: 85, y: 24 },
];

const EDGES: [string, string][] = [
  ["interactions", "f2"],
  ["f2", "f3"],
  ["f3", "assumptions"],
  ["interactions", "f1"],
  ["f1", "observations"],
  ["f1", "f4"],
  ["f4", "decisions"],
  ["f4", "f5"],
  ["f5", "observations"],
  ["f5", "f9"],
  ["f9", "f6"],
  ["f6", "decisions"],
  ["f6", "f10"],
  ["f10", "uncertainty"],
  ["decisions", "f7"],
  ["f7", "assumptions"],
  ["f7", "f11"],
  ["f11", "uncertainty"],
  ["decisions", "uncertainty"],
  ["decisions", "f10"],
  ["f10", "f8"],
  ["f8", "uncertainty"],
  ["assumptions", "f11"],
];

/** Rounds cycle through which concept is currently informing a decision, converging on "decisions" each lap. */
const ROUND_ORDER = ["observations", "interactions", "assumptions", "uncertainty", "decisions"];
const ROUND_MS = 2600;

function nodeById(id: string) {
  return NODES.find((n) => n.id === id) as Node;
}

function Lattice({ activeId }: { activeId: string }) {
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full overflow-visible" aria-hidden="true">
      {EDGES.map(([a, b], i) => {
        const isActive = a === activeId || b === activeId;
        const nodeA = nodeById(a);
        const nodeB = nodeById(b);
        return (
          <line
            key={i}
            x1={nodeA.x}
            y1={nodeA.y}
            x2={nodeB.x}
            y2={nodeB.y}
            stroke={isActive ? "#38afd8" : "#ffffff"}
            strokeOpacity={isActive ? 0.6 : 0.12}
            strokeWidth={isActive ? 1 : 0.6}
            style={{ transition: "stroke-opacity 0.6s ease, stroke-width 0.6s ease" }}
          />
        );
      })}

      {NODES.map((node) => {
        const isActive = node.id === activeId;
        return (
          <g key={node.id}>
            {isActive && (
              <circle
                cx={node.x}
                cy={node.y}
                r={6.5}
                fill="#38afd8"
                fillOpacity={0.16}
                style={{ transition: "opacity 0.6s ease" }}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={isActive ? 2.6 : node.label ? 1.4 : 1}
              fill={isActive ? "#38afd8" : "none"}
              stroke={isActive ? "none" : "#ffffff"}
              strokeOpacity={node.label ? 0.55 : 0.3}
              strokeWidth={0.6}
              style={{ transition: "r 0.6s ease" }}
            />
          </g>
        );
      })}

      {NODES.filter((n): n is Node & { label: string } => Boolean(n.label)).map((node) => (
        <text
          key={node.id}
          x={node.x}
          y={node.y - 4.2}
          textAnchor="middle"
          fontSize="2.8"
          className="font-mono uppercase"
          fill={node.id === activeId ? "#38afd8" : "#ffffff"}
          fillOpacity={node.id === activeId ? 0.9 : 0.4}
          style={{ transition: "fill-opacity 0.6s ease" }}
        >
          {node.label}
        </text>
      ))}
    </svg>
  );
}

export function KnowledgeCompounds() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  // default to the culminating state — used as-is when reduced motion is on
  const [roundIndex, setRoundIndex] = useState(ROUND_ORDER.length - 1);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = sectionRef.current;
    if (!node) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const start = () => {
      if (interval) return;
      setRoundIndex(0);
      interval = setInterval(() => {
        setRoundIndex((i) => (i + 1) % ROUND_ORDER.length);
      }, ROUND_MS);
    };

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.3,
    });
    observer.observe(node);

    return () => {
      stop();
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  const activeId = ROUND_ORDER[roundIndex];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div
        aria-hidden="true"
        className="motion-safe:animate-grid-pulse pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <Eyebrow>Process understanding</Eyebrow>
          <Reveal className="mt-4 max-w-lg text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
            Your process should not forget what it has already learned.
          </Reveal>
          <Reveal delay={0.08} className="mt-6 max-w-md text-lg leading-relaxed text-white/50">
            Each experimental round adds to the same evolving body of process
            understanding, instead of forcing the team to reconstruct
            analytical context from scratch.
          </Reveal>
          <Reveal delay={0.14} className="mt-8 max-w-md border-t border-white/10 pt-8">
            <p className="text-lg font-bold text-white">
              What one experiment teaches should strengthen the next.
            </p>
          </Reveal>
        </div>

        <div>
          <div className="relative aspect-[10/7] w-full">
            <Lattice activeId={activeId} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">Round</p>
            <p className="font-mono text-2xl font-bold text-accent">{String(roundIndex + 1).padStart(2, "0")}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
              Evolving process context
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
