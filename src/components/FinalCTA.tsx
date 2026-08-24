import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/ui/Cta";

export function FinalCTA() {
  return (
    <section id="request" className="bg-ink py-24 md:py-36">
      <div className="container-page max-w-2xl">
        <Reveal>
          <Eyebrow>Start with a real development decision</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Bring one process. One objective. One unresolved question.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            Trellis is easiest to evaluate against a bounded
            process-development question — where the decision matters,
            existing evidence exists, important uncertainty remains,
            additional experimentation is possible, and success can be
            defined before the work begins.
          </p>
        </Reveal>
        <Reveal delay={0.18} className="mt-10">
          <Cta href="#request" tone="onDark">
            Request a conversation →
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}
