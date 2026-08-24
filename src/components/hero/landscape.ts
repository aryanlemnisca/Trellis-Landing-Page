/**
 * Shared math for the hero visualization: a vast, non-linear design space —
 * a handful of local minima and one global minimum, explored by a single
 * marker that hops from valley to valley before settling on the best one.
 */

export const PLANE_SIZE = 14;
export const SEGMENTS = 72;

export type Bump = { x: number; z: number; height: number; sigma: number };

/** Textural hills — purely terrain, not destinations. */
const PEAKS: Bump[] = [
  { x: -1.0, z: 0.8, height: 1.5, sigma: 1.5 },
  { x: 2.0, z: -0.8, height: 1.25, sigma: 1.3 },
  { x: -1.8, z: -3.2, height: 1.05, sigma: 1.2 },
  { x: 4.0, z: 3.4, height: 1.15, sigma: 1.4 },
  { x: -4.4, z: 1.6, height: 0.95, sigma: 1.3 },
  { x: 1.2, z: 4.2, height: 0.9, sigma: 1.2 },
];

export type Valley = { x: number; z: number; depth: number; sigma: number };

/**
 * Visiting order: four local minima of varying (imperfect) quality, then the
 * global minimum. Depth is a positive magnitude — larger digs deeper.
 */
export const VALLEYS: Valley[] = [
  { x: -4.2, z: -2.0, depth: 1.15, sigma: 1.15 },
  { x: 3.2, z: -3.4, depth: 1.5, sigma: 1.2 },
  { x: -3.0, z: 3.2, depth: 1.3, sigma: 1.15 },
  { x: 4.2, z: 2.2, depth: 1.85, sigma: 1.25 },
  { x: 0.4, z: -0.5, depth: 2.7, sigma: 1.35 },
];

export const GLOBAL_MINIMUM_INDEX = VALLEYS.length - 1;

/** Where the search begins each loop — a neutral, unexplored corner. */
export const START_POINT = { x: -5.6, z: 4.6 };

function gaussianBump(x: number, z: number, bump: Bump): number {
  const dx = x - bump.x;
  const dz = z - bump.z;
  return bump.height * Math.exp(-(dx * dx + dz * dz) / (2 * bump.sigma * bump.sigma));
}

export function landscapeHeight(x: number, z: number): number {
  let h = 0;
  for (const peak of PEAKS) h += gaussianBump(x, z, peak);
  for (const valley of VALLEYS) {
    h -= gaussianBump(x, z, { x: valley.x, z: valley.z, height: valley.depth, sigma: valley.sigma });
  }
  h += 0.1 * Math.sin(x * 1.1) * Math.cos(z * 0.9);
  h += 0.05 * Math.sin(x * 2.3 + z * 0.5);
  return h;
}
