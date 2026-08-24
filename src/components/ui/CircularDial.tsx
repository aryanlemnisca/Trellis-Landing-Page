"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type DialStage = { number: string; title: string; tagline: string };

type CircularDialProps = {
  stages: readonly DialStage[];
  activeIndex: number;
  /** Continuous 0..stages.length-1 scroll-linked value — drives the ring/arrow smoothly, no re-renders. */
  progress: MotionValue<number>;
};

/** A glassmorphic circular progress dial — the loop, traced by an arrow riding the ring as you scroll. */
export function CircularDial({ stages, activeIndex, progress }: CircularDialProps) {
  const angle = useTransform(progress, (v) => (v / stages.length) * 360);
  const dashOffset = useTransform(angle, (a) => CIRCUMFERENCE * (1 - a / 360));
  const arrowX = useTransform(angle, (a) => CENTER + RADIUS * Math.sin((a * Math.PI) / 180));
  const arrowY = useTransform(angle, (a) => CENTER - RADIUS * Math.cos((a * Math.PI) / 180));

  const active = stages[activeIndex];

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#0a0a0a" strokeOpacity="0.1" strokeWidth="1.5" />

        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#38afd8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset: dashOffset }}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />

        {stages.map((stage, i) => {
          const tickAngle = (i / stages.length) * 2 * Math.PI;
          const x = CENTER + RADIUS * Math.sin(tickAngle);
          const y = CENTER - RADIUS * Math.cos(tickAngle);
          const reached = i <= activeIndex;
          return (
            <circle
              key={stage.number}
              cx={x}
              cy={y}
              r={reached ? 4 : 3}
              fill={reached ? "#38afd8" : "transparent"}
              stroke={reached ? "none" : "#0a0a0a"}
              strokeOpacity={reached ? 1 : 0.25}
              strokeWidth="1"
              className="transition-all duration-300"
            />
          );
        })}

        <motion.g style={{ x: arrowX, y: arrowY, rotate: angle }}>
          <path d="M -4 -4 L 5 0 L -4 4 Z" fill="#38afd8" />
        </motion.g>
      </svg>

      <div className="absolute inset-[30px] flex flex-col items-center justify-center rounded-full border border-white/60 bg-white/70 text-center shadow-glass-lift backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
          {String(activeIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
        </p>
        <p className="mt-1 text-lg font-bold tracking-tight text-ink">{active.title}</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-accent">{active.tagline}</p>
      </div>
    </div>
  );
}
