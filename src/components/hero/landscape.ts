/**
 * Shared math for the hero "fitness landscape" — a response-surface metaphor
 * for Trellis's core idea: exploring a design space and converging on an optimum.
 * Used by both the surface mesh (FitnessSurface) and the particle swarm (Swarm)
 * so candidate points sit flush with the terrain they're exploring.
 */

export const PLANE_SIZE = 12;
export const SEGMENTS = 90;

type Bump = { x: number; z: number; height: number; sigma: number };

/** The optimum — the single tallest peak the swarm converges toward. */
export const PEAK: Bump = { x: 1.6, z: -1.2, height: 2.4, sigma: 1.6 };

/** Secondary local optima — texture for the landscape, not converged on. */
const SECONDARY: Bump[] = [
  { x: -2.8, z: 1.8, height: 1.1, sigma: 1.3 },
  { x: 2.6, z: 2.4, height: 0.8, sigma: 1.1 },
  { x: -1.6, z: -2.6, height: 0.9, sigma: 1.0 },
];

function gaussianBump(x: number, z: number, bump: Bump): number {
  const dx = x - bump.x;
  const dz = z - bump.z;
  return bump.height * Math.exp(-(dx * dx + dz * dz) / (2 * bump.sigma * bump.sigma));
}

export function landscapeHeight(x: number, z: number): number {
  let h = gaussianBump(x, z, PEAK);
  for (const bump of SECONDARY) h += gaussianBump(x, z, bump);
  h += 0.12 * Math.sin(x * 1.3) * Math.cos(z * 1.1);
  h += 0.06 * Math.sin(x * 2.7 + z * 0.6);
  return h;
}
