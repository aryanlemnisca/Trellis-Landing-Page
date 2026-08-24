/**
 * Shared math for the hero visualization: a vast, non-linear design space —
 * a handful of local minima and one global minimum, explored by a single
 * marker that hops from valley to valley before settling on the best one.
 */

export const PLANE_SIZE = 14;
export const SEGMENTS = 72;

export type Bump = { x: number; z: number; height: number; sigma: number };

/** Textural hills — purely terrain, not destinations. Tall and steep for real visual drama. */
const PEAKS: Bump[] = [
  { x: -1.0, z: 0.8, height: 2.6, sigma: 1.15 },
  { x: 2.0, z: -0.8, height: 2.2, sigma: 1.0 },
  { x: -1.8, z: -3.2, height: 1.9, sigma: 0.95 },
  { x: 4.0, z: 3.4, height: 2.1, sigma: 1.1 },
  { x: -4.4, z: 1.6, height: 1.7, sigma: 1.0 },
  { x: 1.2, z: 4.2, height: 1.6, sigma: 0.95 },
];

export type Valley = { x: number; z: number; depth: number; sigma: number };

/**
 * Visiting order: four local minima of varying (imperfect) quality, then the
 * global minimum. Depth is a positive magnitude — larger digs deeper.
 */
export const VALLEYS: Valley[] = [
  { x: -4.2, z: -2.0, depth: 2.0, sigma: 0.9 },
  { x: 3.2, z: -3.4, depth: 2.5, sigma: 0.95 },
  { x: -3.0, z: 3.2, depth: 2.2, sigma: 0.9 },
  { x: 4.2, z: 2.2, depth: 3.0, sigma: 1.0 },
  { x: 0.4, z: -0.5, depth: 4.3, sigma: 1.1 },
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
