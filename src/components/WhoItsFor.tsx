import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const COLUMNS = [
  {
    title: "Process-development leaders",
    body: "Know your program is genuinely progressing, not just busy.",
  },
  {
    title: "Bench & PD scientists",
    body: "Know which experiment is worth running next.",
  },
  {
    title: "Modeling specialists",
    body: "Make the modeling repeatable, stop being the bottleneck.",
  },
];

export function WhoItsFor() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="container-page">
        <Eyebrow>Who It&apos;s For</Eyebrow>
        <Reveal className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          For the people accountable for reaching a process that works.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 sm:grid-cols-3 sm:divide-x sm:divide-black/10">
          {COLUMNS.map((column, index) => (
            <Reveal key={column.title} delay={index * 0.08} className="sm:px-6 sm:first:pl-0">
              <h3 className="text-lg font-medium leading-snug text-ink">{column.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{column.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16} className="mt-12 text-sm text-ink/50">
          Covers both microbial fermentation and mammalian cell culture.
        </Reveal>
      </div>
    </section>
  );
}
