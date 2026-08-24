/**
 * Shared math + staging data for the hero response-surface visualization.
 *
 * The scene depicts a bioprocess design space being progressively understood
 * from a small number of experiments: a true (but initially unknown) process
 * surface, a couple of alternative plausible surfaces that get ruled out as
 * evidence accumulates, a sparse set of measured observations that appear in
 * deliberate batches, a candidate robust operating region, and one flagged
 * "next experiment" location where consequential uncertainty remains.
 */

export const PLANE_SIZE = 12;
export const SEGMENTS = 56;
export const CYCLE_SECONDS = 13;

export type Bump = { x: number; z: number; height: number; sigma: number };

/** The true optimum — unknown to the model until evidence accumulates. */
export const PEAK: Bump = { x: 1.6, z: -1.2, height: 2.4, sigma: 1.6 };

/** Background texture shared by every surface — the parts of the space that stay ambiguous. */
const SECONDARY: Bump[] = [
  { x: -2.8, z: 1.8, height: 1.1, sigma: 1.3 },
  { x: 2.6, z: 2.4, height: 0.8, sigma: 1.1 },
  { x: -1.6, z: -2.6, height: 0.9, sigma: 1.0 },
];

/** Two alternative hypotheses — plausible until the evidence disambiguates them. */
export const ALTERNATIVE_PEAKS: Bump[] = [
  { x: -1.8, z: 2.2, height: 2.1, sigma: 1.5 },
  { x: 3.0, z: -2.6, height: 1.9, sigma: 1.4 },
];

/** Where consequential uncertainty remains — the location Trellis flags next. */
export const UNCERTAIN_POINT = { x: -0.6, z: 0.9 };

function gaussianBump(x: number, z: number, bump: Bump): number {
  const dx = x - bump.x;
  const dz = z - bump.z;
  return bump.height * Math.exp(-(dx * dx + dz * dz) / (2 * bump.sigma * bump.sigma));
}

function terrainTexture(x: number, z: number): number {
  let h = 0;
  for (const bump of SECONDARY) h += gaussianBump(x, z, bump);
  h += 0.12 * Math.sin(x * 1.3) * Math.cos(z * 1.1);
  h += 0.06 * Math.sin(x * 2.7 + z * 0.6);
  return h;
}

/** Height of a surface built around an arbitrary candidate peak (used for alt models). */
export function heightWithPeak(x: number, z: number, peak: Bump): number {
  return gaussianBump(x, z, peak) + terrainTexture(x, z);
}

/** Height of the true process surface. */
export function landscapeHeight(x: number, z: number): number {
  return heightWithPeak(x, z, PEAK);
}

export type EvidencePoint = { x: number; z: number; appearAt: number };

/**
 * Sparse, deliberately-staged measured observations — cumulative reveal across
 * the cycle. Never all-at-once: this is "a few observations," not a data rain.
 */
export const EVIDENCE_POINTS: EvidencePoint[] = [
  { x: -3.2, z: -0.5, appearAt: 0.02 },
  { x: 2.0, z: 3.0, appearAt: 0.05 },
  { x: -1.0, z: -3.0, appearAt: 0.17 },
  { x: 0.5, z: 2.2, appearAt: 0.21 },
  { x: 3.4, z: 0.8, appearAt: 0.25 },
  { x: -2.5, z: 2.0, appearAt: 0.29 },
  { x: 1.2, z: -1.8, appearAt: 0.33 },
  { x: 2.8, z: -2.3, appearAt: 0.37 },
  { x: 1.9, z: -0.6, appearAt: 0.42 },
  { x: -1.4, z: -2.4, appearAt: 0.46 },
  { x: 1.3, z: -1.5, appearAt: 0.52 },
  { x: 0.9, z: -1.9, appearAt: 0.58 },
];

/** Cycle-fraction stage boundaries — kept in one place so every hero layer agrees on timing. */
export const STAGES = {
  sparse: [0, 0.15],
  accumulate: [0.15, 0.42],
  modelLearns: [0.3, 0.6],
  robustRegion: [0.55, 0.72],
  nextExperiment: [0.72, 0.88],
  becomesEvidence: [0.88, 0.97],
  reset: [0.97, 1],
} as const;
