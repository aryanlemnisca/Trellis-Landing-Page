"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

const FAQS = [
  {
    q: "Where in development does Trellis fit?",
    a: "During process development — between early feasibility and a locked, pilot-ready process, while the team is still deciding which conditions to test and why.",
  },
  {
    q: "Is Trellis a replacement for DoE software?",
    a: "No. Trellis is not a DoE tool. It decides what to test next using an evolving process model and its uncertainty — a different approach from a fixed, upfront experimental design.",
  },
  {
    q: "Does Trellis replace mechanistic or statistical modelling?",
    a: "No. Trellis applies whichever modelling approach — statistical or mechanistic — is appropriate to the evidence available, and reports what that evidence actually supports.",
  },
  {
    q: "Does Trellis run laboratory experiments?",
    a: "No. Trellis recommends and helps design experiments; the bench remains human-operated, and every physical run is carried out by the team.",
  },
  {
    q: "How does Trellis choose what experiment should come next?",
    a: "By simulating the current process model across the design space and identifying where the next physical result would most reduce decision-relevant uncertainty, or confirm a candidate operating region.",
  },
  {
    q: "What happens when the available evidence is insufficient?",
    a: "Trellis says so. Where the evidence does not support a confident conclusion, it reports that directly rather than presenting a recommendation as more certain than it is.",
  },
  {
    q: "Can scientists reject or change a recommendation?",
    a: "Yes. Every recommended experiment or decision is reviewed by the scientist, who can accept, adjust or reject it before it reaches the bench.",
  },
  {
    q: "How does Trellis represent uncertainty?",
    a: "Explicitly, as a property of the model and its predictions rather than a single confident answer. Candidate regions are shown alongside how well the current evidence supports them.",
  },
  {
    q: "What types of experimental data can Trellis work with?",
    a: "Experimental data from bioprocess development — for example titer, viability, product quality and other process measurements — brought into a consistent analytical structure regardless of the instrument or format it originated in.",
  },
  {
    q: "What does an initial engagement look like?",
    a: "It is scoped around one real process-development question, where the decision matters, existing evidence is available, and meaningful uncertainty remains — with success criteria agreed before the work begins.",
  },
];

function FaqRow({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between gap-6 rounded-sm px-3 py-6 text-left transition-colors duration-300 -mx-3 hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <span className="text-base font-medium text-ink md:text-lg">{question}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 font-mono text-xl leading-none text-ink/40 transition-all duration-200 group-hover:text-accent ${
            isOpen ? "rotate-45 text-accent" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink/60">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface py-24 md:py-36">
      <div className="container-page">
        <Eyebrow>Questions</Eyebrow>

        <div className="mt-10 border-t border-black/10">
          {FAQS.map((faq, i) => (
            <FaqRow
              key={faq.q}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
