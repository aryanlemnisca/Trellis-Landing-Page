import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/** A pause in the narrative — no cards, no CTA. Just the principle. */
export function DarkThesis() {
  return (
    <section className="relative overflow-hidden bg-ink py-32 md:py-48">
      <div
        aria-hidden="true"
        className="motion-safe:animate-grid-pulse pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="text-center">The principle</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-5 text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Every experiment should make the next decision clearer.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-lg text-white/50">
            Not another isolated analysis. An evolving understanding of the
            process.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
