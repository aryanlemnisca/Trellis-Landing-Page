/**
 * Deterministic pseudo-noise (seeded by index), integer bit-mixing only.
 * Math.sin-based hashes are NOT guaranteed bit-identical across JS engines
 * (server vs. browser), which causes React hydration mismatches; bitwise
 * operators are exactly specified, so this is stable across environments.
 */
export function hash(i: number): number {
  let x = Math.imul(i + 1, 2654435761);
  x = (x ^ (x >>> 13)) >>> 0;
  x = Math.imul(x, 2246822519);
  x = (x ^ (x >>> 16)) >>> 0;
  return (x % 1000) / 1000;
}
