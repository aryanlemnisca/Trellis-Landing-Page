import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const CARDS = [
  {
    title: "The design space is enormous.",
    body: "Dozens of interacting parameters combine in thousands of ways; a person can hold three or four in their head at once, so most of the space goes unexplored.",
  },
  {
    title: "Every experiment is expensive and slow.",
    body: "A run takes weeks; a good team gets ~40 experiments a year. Which ones you pick matters more than anything downstream.",
  },
  {
    title: "Every batch feels like a new experiment.",
    body: "Runs don't reproduce cleanly, so each cycle starts from scratch.",
  },
  {
    title: "The knowledge leaves with the people.",
    body: "Reasoning and decisions live in heads and scattered spreadsheets, lost at every handoff.",
  },
];

export function Problem() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="container-page">
        <Eyebrow>Problem</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Even your best scientist is guessing between runs.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-2xl text-lg text-ink/60">
          Process development doesn&apos;t stall for lack of expertise. It
          stalls because there&apos;s no signal telling you whether the next
          experiment is the right one — before you spend weeks finding out.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:divide-x lg:divide-black/10">
          {CARDS.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06} className="lg:px-6 lg:first:pl-0">
              <h3 className="text-lg font-medium leading-snug text-ink">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{card.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16 border-t border-black/10 pt-10">
          <p className="text-2xl font-medium tracking-tight text-ink md:text-3xl">
            Time, material, and batches go in. Certainty does not come out.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
