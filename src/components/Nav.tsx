"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Tune", href: "https://www.lemnisca.bio/tune" },
  { label: "Thrust", href: "https://www.lemnisca.bio/thrust" },
  { label: "Torch", href: "https://www.lemnisca.bio/torch" },
  { label: "Trellis", href: "#", current: true },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <a href="#" className="font-mono text-sm font-medium tracking-tight text-ink">
          TRELLIS <span className="text-black/40">by Lemnisca</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                link.current ? "text-accent" : "text-ink/60 hover:text-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#request"
            className="rounded-full bg-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent hover:text-ink"
          >
            Request a conversation
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
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
            className="overflow-hidden border-t border-black/10 md:hidden"
          >
            <div className="container-page flex flex-col gap-5 py-6">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-mono text-xs uppercase tracking-[0.15em] ${
                    link.current ? "text-accent" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#request"
                onClick={() => setOpen(false)}
                className="w-fit rounded-full bg-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-white"
              >
                Request a conversation
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
