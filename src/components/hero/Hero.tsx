"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";
import { HeroStaticFallback } from "./HeroStaticFallback";

/** Lazy-loaded so three.js / R3F never blocks first paint or LCP. */
const HeroScene = dynamic(() => import("./HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
});

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia("(max-width: 767px)");
    setIsMobile(query.matches);
    const listener = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <section className="bg-surface">
      <div className="container-page flex flex-col gap-12 py-20 md:py-28 lg:grid lg:grid-cols-[44fr_56fr] lg:items-center lg:gap-8 lg:py-0 lg:min-h-[92vh]">
        <div className="max-w-xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/45">
              Trellis / Model-driven bioprocess development
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl">
              Don&apos;t settle for a process that merely works.
              <br />
              Reach the <span className="text-accent">true potential</span> of your process.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
              Trellis connects experimental design, process data, modelling and
              next-experiment selection so every experimental round sharpens
              process understanding and makes the next decision clearer.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta href="#request">Request a conversation →</Cta>
              <Cta href="#how-it-works" variant="secondary">
                See how Trellis works ↓
              </Cta>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/35">
              Scientist-led · Model-driven · Human-approved
            </p>
          </Reveal>
        </div>

        <div className="h-[340px] w-full sm:h-[420px] lg:h-[70vh]">
          {mounted ? (
            <HeroScene reduced={Boolean(prefersReducedMotion)} isMobile={isMobile} />
          ) : (
            <HeroStaticFallback />
          )}
        </div>
      </div>
    </section>
  );
}
