"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cta } from "@/components/ui/Cta";

const LINKS = [
  { label: "Tune", href: "https://www.lemnisca.bio/tune" },
  { label: "Thrust", href: "https://www.lemnisca.bio/thrust" },
  { label: "Torch", href: "https://www.lemnisca.bio/torch" },
  { label: "Trellis", href: "#", current: true },
];

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <a
          href="#"
          className="font-mono text-sm font-medium tracking-tight text-ink transition-opacity hover:opacity-70"
        >
          TRELLIS <span className="text-black/40">by Lemnisca</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={`group relative pb-1 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                link.current ? "text-ink" : "text-ink/50 hover:text-ink"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-[1px] h-[2px] bg-accent transition-transform duration-300 ease-out ${
                  link.current ? "" : "origin-left scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </a>
          ))}
          <Cta href="#request" className="!px-4 !py-2">
            Request a conversation
          </Cta>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 transition-transform active:scale-90 md:hidden"
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/40 bg-white/60 backdrop-blur-xl md:hidden"
          >
            <motion.div
              className="container-page flex flex-col gap-5 py-6"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              initial="hidden"
              animate="visible"
            >
              {LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  variants={mobileLinkVariants}
                  className={`font-mono text-xs uppercase tracking-[0.15em] ${
                    link.current ? "text-ink" : "text-ink/50"
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div variants={mobileLinkVariants}>
                <Cta href="#request" className="w-fit" onClick={() => setOpen(false)}>
                  Request a conversation
                </Cta>
              </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
