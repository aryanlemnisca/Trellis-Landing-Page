"use client";

import { motion } from "framer-motion";
import { revealViewport } from "@/lib/motion";

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

type RevealCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Punchier than Reveal: scale+rise spring entrance, plus a hover lift. Adds `group` for child hover animations. */
export function RevealCard({ children, className = "", delay = 0 }: RevealCardProps) {
  return (
    <motion.div
      className={`group ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
    >
      {children}
    </motion.div>
  );
}
