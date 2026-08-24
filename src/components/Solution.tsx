import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const CARDS = [
  {
    title: "Know the next move is worth it.",
    body: "Trellis ranks each candidate experiment by how likely it is to move you toward your target, with quantified uncertainty, before you commit.",
  },
  {
    title: "Learn the whole process, not one variable.",
    body: "The model tracks 20–30 parameters at once and learns process behaviour round by round.",
  },
  {
    title: "Every run either reduces uncertainty or confirms a decision.",
    body: "No run is wasted on blind optimization.",
  },
  {
    title: "The scientist stays in control.",
    body: "Trellis chooses and learns; the bench stays human, and every step is approved by a person.",
  },
];

export function Solution() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <Eyebrow>The Solution</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Trellis replaces guesswork with a model that tells you what to run
          next — and how much to trust it.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:divide-x lg:divide-black/10">
          {CARDS.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06} className="lg:px-6 lg:first:pl-0">
              <h3 className="text-lg font-medium leading-snug text-ink">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{card.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
