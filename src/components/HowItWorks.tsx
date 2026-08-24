"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const STAGES = [
  {
    number: "01",
    title: "Question",
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
    body: ["Select experiments appropriate to the current scientific question."],
  },
  {
    number: "03",
    title: "Protocol",
    body: ["Turn experimental intent into an executable plan."],
  },
  {
    number: "04",
    title: "Data",
    body: ["Bring experimental results and context into a consistent analytical structure."],
  },
  {
    number: "05",
    title: "Model",
    body: ["Apply an appropriate modelling approach to understand what the evidence supports."],
  },
  {
    number: "06",
    title: "Simulate",
    body: ["Explore sensitivities, interactions, uncertainty, trade-offs and candidate regions."],
  },
  {
    number: "07",
    title: "Decide",
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

function StageTimeline({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex h-full flex-col justify-center">
      {STAGES.map((stage, i) => {
        const reached = i <= activeIndex;
        const isActive = i === activeIndex;
        return (
          <div key={stage.number} className="flex items-stretch">
            <div className="flex flex-col items-center">
              <span
                className={`h-3 w-3 shrink-0 rounded-full border transition-colors duration-300 ${
                  reached ? "border-accent bg-accent" : "border-ink/20 bg-transparent"
                } ${isActive ? "ring-4 ring-accent/15" : ""}`}
              />
              {i < STAGES.length - 1 && (
                <span
                  className={`w-px flex-1 transition-colors duration-500 ${
                    i < activeIndex ? "bg-accent/40" : "bg-ink/10"
                  }`}
                  style={{ minHeight: "2.75rem" }}
                />
              )}
            </div>
            <div className="ml-4 pb-11">
              <p
                className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                  reached ? "text-ink" : "text-ink/30"
                }`}
              >
                {stage.number} · {stage.title}
              </p>
            </div>
          </div>
        );
      })}
      <p
        className={`ml-7 font-mono text-[10px] uppercase tracking-[0.15em] transition-opacity duration-500 ${
          activeIndex === STAGES.length - 1 ? "text-accent opacity-100" : "opacity-0"
        }`}
      >
        → the loop continues
      </p>
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
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          One continuous scientific learning loop.
        </Reveal>
        <Reveal delay={0.08} className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-ink/40">
          Question → Design → Protocol → Data → Model → Simulate → Decide
        </Reveal>
      </div>

      <div ref={trackRef} className="container-page mt-16 lg:grid lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col">
          {STAGES.map((stage, i) => (
            <div key={stage.number} className="flex min-h-[62vh] flex-col justify-center border-t border-black/10 py-10 first:border-t-0 lg:min-h-[68vh]">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">{stage.number}</span>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-ink md:text-3xl">{stage.title}</h3>
              <div className="mt-4 max-w-sm space-y-1.5">
                {stage.body.map((line) => (
                  <p key={line} className="text-base leading-relaxed text-ink/60">
                    {line}
                  </p>
                ))}
              </div>

              {/* mobile: compact progress, since the sticky panel is desktop-only */}
              <div className="mt-8 lg:hidden">
                <CompactDots activeIndex={i} />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-28 h-[68vh]">
            <StageTimeline activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}
