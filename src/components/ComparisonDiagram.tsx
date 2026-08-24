"use client";

import { Reveal } from "@/components/ui/Reveal";

const WITHOUT_STEPS = ["Run experiments", "Analyse", "KPIs achieved?"];
const WITH_STEPS = [
  "State objective",
  "Build predictive model",
  "Simulate the design space",
  "Validate recommended runs",
  "KPIs achieved?",
];

function FlowStep({
  label,
  tone,
  delay,
}: {
  label: string;
  tone: "muted" | "accent";
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={`w-full rounded-lg border px-5 py-4 text-center text-sm font-medium ${
        tone === "accent"
          ? "border-accent/40 bg-accent/10 text-ink"
          : "border-black/15 bg-white text-ink/75"
      }`}
    >
      {label}
    </Reveal>
  );
}

function FlowArrow({ tone, delay }: { tone: "muted" | "accent"; delay: number }) {
  return (
    <Reveal delay={delay} className="flex justify-center py-1">
      <svg
        width="16"
        height="22"
        viewBox="0 0 16 22"
        className={tone === "accent" ? "text-accent" : "text-black/25"}
      >
        <path
          d="M8 0 V16 M8 16 L2 10 M8 16 L14 10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </Reveal>
  );
}

export function ComparisonDiagram() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="container-page">
        <Reveal className="max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Trellis explores 1000× the design space. Run fewer, smarter
          experiments.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10">
          {/* Without Trellis */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">
              Without Trellis
            </p>
            <div className="relative mt-6 pl-8">
              {/* loop-back bracket: this cycle repeats before eventually converging */}
              <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-5">
                <div className="h-full w-4 rounded-l-md border-y border-l border-black/20" />
                <span className="absolute -top-2.5 left-2.5 text-xs text-black/35">↺</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                {WITHOUT_STEPS.map((step, index) => (
                  <div key={step} className="flex w-full flex-col items-center">
                    <FlowStep label={step} tone="muted" delay={index * 0.08} />
                    {index < WITHOUT_STEPS.length - 1 && (
                      <FlowArrow tone="muted" delay={index * 0.08 + 0.04} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-sm text-ink/50">
              ~40 experiments a year — guided by intuition, high uncertainty.
            </p>
          </div>

          {/* With Trellis */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              With Trellis
            </p>
            <div className="mt-6 flex flex-col items-center gap-1">
              {WITH_STEPS.map((step, index) => (
                <div key={step} className="flex w-full flex-col items-center">
                  <FlowStep label={step} tone="accent" delay={index * 0.08} />
                  {index < WITH_STEPS.length - 1 && (
                    <FlowArrow tone="accent" delay={index * 0.08 + 0.04} />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink/60">
              Thousands of virtual experiments per loop — only the winning
              runs go to the bench.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
