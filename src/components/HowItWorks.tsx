import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const AGENTS = [
  {
    number: "01",
    title: "Design",
    body: "Chooses the most informative experiments to run next, and reports what the design can and can't tell you.",
  },
  {
    number: "02",
    title: "Protocol",
    body: "Turns the plan into a bench-executable protocol and a results sheet, pinning what can be controlled and recording what can't.",
  },
  {
    number: "03",
    title: "Data",
    body: "Ingests results in whatever shape the instruments produced and canonicalizes them, with provenance for every number.",
  },
  {
    number: "04",
    title: "Model",
    body: "Fits the data, selects the best-fitting model, and reports what the evidence actually supports — it says so when there isn't enough signal.",
  },
  {
    number: "05",
    title: "Optimize",
    body: "Simulates the design space to find the optimum and the robust region around it, then hands recommended conditions back to you.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <Eyebrow>How Trellis Works</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Design, protocol, data, model, optimize — one continuous loop.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-2xl text-lg text-ink/60">
          Trellis is five specialized agents, one per stage of the loop. Each
          supports the scientist; deterministic scientific tools do the
          computation, so results are grounded, not hallucinated.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:divide-x lg:divide-black/10">
          {AGENTS.map((agent, index) => (
            <Reveal key={agent.number} delay={index * 0.06} className="lg:px-5 lg:first:pl-0">
              <span className="font-mono text-sm text-accent">{agent.number}</span>
              <h3 className="mt-3 text-lg font-medium text-ink">{agent.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{agent.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
