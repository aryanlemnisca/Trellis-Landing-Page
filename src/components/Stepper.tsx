"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const STEPS = [
  { number: "01", label: "State the objective" },
  { number: "02", label: "Trellis designs the runs" },
  { number: "03", label: "You run at the bench" },
  { number: "04", label: "Model recommends the next move" },
];

export function Stepper() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.3"],
  });
  const activeFloat = useTransform(scrollYProgress, [0, 1], [0, STEPS.length - 1]);

  return (
    <section ref={sectionRef} className="border-y border-white/10 bg-ink">
      <div className="container-page py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-0">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-start gap-4">
              <StepCell step={step} index={index} activeFloat={activeFloat} />
              {index < STEPS.length - 1 && (
                <span className="mt-1 hidden pt-1 font-mono text-white/20 md:block">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCell({
  step,
  index,
  activeFloat,
}: {
  step: { number: string; label: string };
  index: number;
  activeFloat: MotionValue<number>;
}) {
  const opacity = useTransform(activeFloat, (value) => (value >= index - 0.4 ? 1 : 0.4));

  return (
    <motion.div className="flex flex-1 flex-col gap-2" style={{ opacity }}>
      <span className="font-mono text-sm text-accent">{step.number}</span>
      <span className="text-sm leading-snug text-white/85 md:text-base">{step.label}</span>
    </motion.div>
  );
}
