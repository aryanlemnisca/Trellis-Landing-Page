"use client";

import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { revealViewport } from "@/lib/motion";

const ROWS = 4;
const COLS = 6;

/**
 * Deterministic pseudo-noise (seeded by index), integer bit-mixing only.
 * Math.sin-based hashes are NOT guaranteed bit-identical across JS engines
 * (server vs. browser), which caused a hydration mismatch here; bitwise
 * operators are exactly specified, so this is stable across environments.
 */
function hash(i: number) {
  let x = Math.imul(i + 1, 2654435761);
  x = (x ^ (x >>> 13)) >>> 0;
  x = Math.imul(x, 2246822519);
  x = (x ^ (x >>> 16)) >>> 0;
  return (x % 1000) / 1000;
}

type Node = { row: number; col: number; x: number; y: number };

const NODES: Node[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    const jitterX = (hash(i * 2) - 0.5) * 3.5;
    const jitterY = (hash(i * 2 + 1) - 0.5) * 3.5;
    NODES.push({
      row: r,
      col: c,
      x: (c / (COLS - 1)) * 100 + jitterX,
      y: (r / (ROWS - 1)) * 64 + jitterY,
    });
  }
}

function nodeAt(r: number, c: number) {
  return NODES[r * COLS + c];
}

type Edge = { from: Node; to: Node; delay: number };

const EDGES: Edge[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const from = nodeAt(r, c);
    if (c < COLS - 1) EDGES.push({ from, to: nodeAt(r, c + 1), delay: (r + c) * 0.035 + 0.25 });
    if (r < ROWS - 1) EDGES.push({ from, to: nodeAt(r + 1, c), delay: (r + c) * 0.035 + 0.25 });
    if (r < ROWS - 1 && c < COLS - 1) {
      EDGES.push({ from, to: nodeAt(r + 1, c + 1), delay: (r + c) * 0.035 + 0.35 });
    }
  }
}

function Lattice() {
  return (
    <svg viewBox="0 0 100 64" preserveAspectRatio="none" className="h-full w-full overflow-visible">
      {EDGES.map((edge, i) => (
        <motion.line
          key={i}
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke="#38afd8"
          strokeOpacity={0.28}
          strokeWidth={0.25}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.5, delay: edge.delay, ease: "easeOut" }}
        />
      ))}
      {NODES.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={0.9}
          fill="#0a0a0a"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.4, delay: (node.row + node.col) * 0.035, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

export function KnowledgeCompounds() {
  return (
    <section className="bg-surface py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>Process understanding</Eyebrow>
        <Reveal className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Your process should not forget what it has already learned.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
          Each experimental round adds to the same evolving body of process
          understanding, instead of forcing the team to reconstruct
          analytical context from scratch.
        </Reveal>

        <div className="mt-16 h-[320px] w-full md:h-[420px]">
          <Lattice />
        </div>

        <Reveal delay={0.1} className="mt-4">
          <p className="text-lg font-medium text-ink">
            What one experiment teaches should strengthen the next.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
