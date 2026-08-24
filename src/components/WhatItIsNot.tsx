import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const LINES = [
  "Not a black-box that decides for you",
  "Not a lab-execution or instrument-control system",
  "Not an ELN or system of record",
  "Every irreversible decision sits behind a human",
];

export function WhatItIsNot() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-page">
        <Eyebrow>Where Trellis Stops</Eyebrow>
        <Reveal className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl">
          Trellis does one thing well — and stays out of the rest.
        </Reveal>

        <ul className="mt-14 max-w-xl divide-y divide-white/10 border-t border-white/10">
          {LINES.map((line, index) => (
            <Reveal key={line} as="li" delay={index * 0.06} className="py-5 text-lg text-white/70">
              {line}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
