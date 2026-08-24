import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const DOMAINS = [
  "Bioprocess development",
  "Process engineering",
  "Experimental design",
  "Statistical & mechanistic modelling",
  "Machine learning",
  "AI",
  "Scientific software",
];

export function Credibility() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <Eyebrow>Built for bioprocess development</Eyebrow>
        <Reveal className="mt-4 max-w-2xl text-4xl font-bold leading-[0.95] tracking-tight text-ink md:text-5xl">
          A multidisciplinary team across the complete development workflow.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-xl text-base leading-relaxed text-ink/60">
          The team behind Trellis has worked across bioprocess development,
          process engineering, experimental design, statistical and
          mechanistic modelling, machine learning, AI and scientific
          software — brought together around the same development workflow.
        </Reveal>

        <Reveal delay={0.14} className="mt-10 flex flex-wrap gap-2.5 border-t border-black/10 pt-8">
          {DOMAINS.map((domain) => (
            <span
              key={domain}
              className="cursor-default rounded-sm border border-black/15 bg-white/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/70 hover:text-ink hover:shadow-glow-sm"
            >
              {domain}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
