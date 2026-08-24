"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { fadeUp, revealViewport } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  as?: "div" | "li";
};

/** Fade + short rise on scroll into view. Framer Motion disables this automatically under prefers-reduced-motion via MotionConfig in the root layout. */
export function Reveal({ children, className, style, delay = 0, as = "div" }: RevealProps) {
  const sharedProps = {
    className,
    style,
    variants: fadeUp,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: revealViewport,
    transition: { delay },
  };

  if (as === "li") {
    return <motion.li {...sharedProps}>{children}</motion.li>;
  }

  return <motion.div {...sharedProps}>{children}</motion.div>;
}
