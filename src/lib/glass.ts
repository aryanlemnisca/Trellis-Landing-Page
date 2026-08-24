/**
 * Shared glassmorphism class fragments — kept as plain strings (not a
 * wrapper component) so each section can compose them with its own layout
 * classes. Only ever built from white/ink/accent at reduced opacity, per the
 * site's 4-color system — never a new hue.
 */

/** Frosted panel on a light (surface/white) section. */
export const GLASS_LIGHT =
  "rounded-md border border-white/70 bg-white/55 backdrop-blur-md shadow-glass-lift";

/** Frosted panel on a dark (ink) section. */
export const GLASS_DARK = "rounded-md border border-white/10 bg-white/[0.06] backdrop-blur-md";

/**
 * Border + glow only (no transform) — pair with RevealCard, which already
 * owns the hover lift via framer-motion. An inline-style transform from
 * framer-motion always wins over a CSS hover:translate class, so mixing the
 * two here would make the CSS half silently do nothing.
 */
export const GLASS_HOVER = "transition-colors duration-300 ease-out hover:border-accent/50 hover:shadow-glow";
