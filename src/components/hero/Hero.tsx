"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/** Lazy-loaded so three.js / R3F never blocks first paint. */
const HeroScene = dynamic(() => import("./HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
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
    <section className="relative overflow-hidden bg-black">
      {/* 3D response-surface scene — right/background half on desktop, full-bleed behind text on mobile */}
      <div className="absolute inset-0 md:left-[36%]">
        {mounted && (
          <HeroScene reduced={Boolean(prefersReducedMotion)} count={isMobile ? 260 : 650} />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent md:via-black/35" />
      <div className="absolute inset-0 bg-black/50 md:hidden" />

      <div className="container-page relative z-10 flex min-h-[88vh] flex-col justify-center py-28 md:min-h-screen">
        <div className="max-w-xl">
          <Reveal>
            <h1 className="text-[2.5rem] font-medium leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              &ldquo;I hope this works&rdquo; is the most expensive sentence in your lab.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70 md:text-xl">
              Trellis is a scientist-led platform for model-driven bioprocess
              development. It tells you which experiment is worth running —
              and how much to trust it — before you commit the time, the
              material, and the batch.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href="#request"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-black transition-colors hover:bg-white"
            >
              Request a Trellis conversation →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
