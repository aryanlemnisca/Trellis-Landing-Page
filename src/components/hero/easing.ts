export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 0→1→0 pulse across [start, mid, end] — used for a value that ramps in then holds then fades. */
export function rampHold(t: number, rampIn: number, holdEnd: number, rampOut: number): number {
  if (t < rampIn) return smoothstep(0, rampIn, t);
  if (t < holdEnd) return 1;
  return 1 - smoothstep(holdEnd, rampOut, t);
}

/** 0 at both ends, 1 at the midpoint — the height of a leap between two points, u in [0,1]. */
export function arcHeight(u: number): number {
  return Math.sin(Math.PI * Math.min(Math.max(u, 0), 1));
}

/** A quick decaying oscillation — the bounce as the ball settles into a valley, u in [0,1]. */
export function dampedBounce(u: number): number {
  const decay = Math.exp(-5.5 * u);
  return decay * Math.cos(u * Math.PI * 3.2);
}
