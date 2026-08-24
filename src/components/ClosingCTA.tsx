import { Reveal } from "@/components/ui/Reveal";

export function ClosingCTA() {
  return (
    <section id="request" className="bg-black py-24 md:py-32">
      <div className="container-page text-center">
        <Reveal className="mx-auto max-w-2xl text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl">
          Stop running experiments you&apos;re not sure about.
        </Reveal>
        <Reveal delay={0.08} className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Tell us where your process is stuck. We&apos;ll show you what your
          current data says about the next experiment worth running.
        </Reveal>
        <Reveal delay={0.16} className="mt-10">
          <a
            href="#request"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-black transition-colors hover:bg-white"
          >
            Request a Trellis conversation →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
