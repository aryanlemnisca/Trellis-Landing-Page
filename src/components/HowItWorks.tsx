"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CircularDial } from "@/components/ui/CircularDial";

const STAGES = [
  {
    number: "01",
    title: "Question",
    tagline: "Scope the question",
    body: [
      "What is the team trying to improve?",
      "What constraints matter?",
      "What evidence already exists?",
      "What remains uncertain?",
    ],
  },
  {
    number: "02",
    title: "Design",
    tagline: "Information value",
    body: ["Select experiments appropriate to the current scientific question."],
  },
  {
    number: "03",
    title: "Protocol",
    tagline: "Executable plan",
    body: ["Turn experimental intent into an executable plan."],
  },
  {
    number: "04",
    title: "Data",
    tagline: "Consistent structure",
    body: ["Bring experimental results and context into a consistent analytical structure."],
  },
  {
    number: "05",
    title: "Model",
    tagline: "Evidence fit",
    body: ["Apply an appropriate modelling approach to understand what the evidence supports."],
  },
  {
    number: "06",
    title: "Simulate",
    tagline: "Trade-offs",
    body: ["Explore sensitivities, interactions, uncertainty, trade-offs and candidate regions."],
  },
  {
    number: "07",
    title: "Decide",
    tagline: "Next experiment",
    body: ["Identify the physical experiment or decision that would create the most useful next evidence."],
  },
] as const;

function CompactDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex items-center gap-2">
      {STAGES.map((stage, i) => (
        <span
          key={stage.number}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            i <= activeIndex ? "bg-accent" : "bg-ink/15"
          }`}
        />
      ))}
    </div>
  );
}

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.55", "end 0.45"],
  });
  const stageProgress = useTransform(scrollYProgress, [0, 1], [0, STAGES.length - 1]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(stageProgress, "change", (value) => {
    const clamped = Math.min(Math.max(Math.round(value), 0), STAGES.length - 1);
    setActiveIndex(clamped);
  });

  return (
    <section id="how-it-works" className="bg-white py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>How Trellis works</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-4xl font-bold leading-[0.95] tracking-tight text-ink md:text-6xl">
          One continuous scientific learning loop.
        </Reveal>
        <Reveal delay={0.08} className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-ink/40">
          Question → Design → Protocol → Data → Model → Simulate → Decide
        </Reveal>
      </div>

      <div ref={trackRef} className="container-page mt-16 lg:grid lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col">
          {STAGES.map((stage, i) => (
            <div
              key={stage.number}
              className="relative flex min-h-[42vh] flex-col justify-center overflow-hidden border-t border-black/10 py-10 first:border-t-0 lg:min-h-[48vh]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-sans text-[13rem] font-bold leading-none text-ink/[0.04] md:text-[16rem]"
              >
                {stage.number}
              </span>

              <span className="relative font-mono text-xs uppercase tracking-[0.15em] text-accent">
                {stage.number}
              </span>
              <h3 className="relative mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">{stage.title}</h3>
              <div className="relative mt-4 max-w-sm space-y-1.5">
                {stage.body.map((line) => (
                  <p key={line} className="text-base leading-relaxed text-ink/60">
                    {line}
                  </p>
                ))}
              </div>

              {/* mobile: compact progress, since the sticky panel is desktop-only */}
              <div className="relative mt-8 lg:hidden">
                <CompactDots activeIndex={i} />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-28 flex h-[68vh] flex-col items-center justify-center gap-6">
            <CircularDial stages={STAGES} activeIndex={activeIndex} progress={stageProgress} />
            <p
              className={`font-mono text-[10px] uppercase tracking-[0.15em] transition-opacity duration-500 ${
                activeIndex === STAGES.length - 1 ? "text-accent opacity-100" : "opacity-0"
              }`}
            >
              → the loop continues
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
