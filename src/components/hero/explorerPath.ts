/**
 * A deterministic, pure function of elapsed time describing where the
 * explorer marker is and what it's doing — travelling between valleys,
 * settling, sampling nearby, or resting at the global minimum.
 *
 * Kept as a pure function (not React state) so the visual marker, its trail,
 * and the camera can each independently derive the same position every
 * frame without needing to coordinate through refs or context.
 */

import { GLOBAL_MINIMUM_INDEX, START_POINT, VALLEYS, landscapeHeight } from "./landscape";
import { arcHeight, dampedBounce, easeInOutCubic, smoothstep } from "./easing";

type StopPoint = { x: number; z: number };

const STOPS: StopPoint[] = [START_POINT, ...VALLEYS.map((v) => ({ x: v.x, z: v.z }))];

const TRAVEL_SHARE = 0.38;
const SETTLE_SHARE = 0.14;
const SAMPLE_SHARE = 0.33;
// remaining share (per exploratory hop only) is the "escape" anticipation crouch.

/** Non-uniform hop durations (seconds) — the final approach gets more room to breathe. */
const HOP_DURATIONS = [2.15, 2.15, 2.15, 2.15, 3.4];
const HOLD_AT_GLOBAL = 2.3;
const RESET_PAUSE = 0.55;

export const TOTAL_DURATION =
  HOP_DURATIONS.reduce((a, b) => a + b, 0) + HOLD_AT_GLOBAL + RESET_PAUSE;

const HOP_START: number[] = [];
{
  let acc = 0;
  for (const d of HOP_DURATIONS) {
    HOP_START.push(acc);
    acc += d;
  }
}
const LAST_HOP = HOP_DURATIONS.length - 1;
const HOLD_START = HOP_START[LAST_HOP] + HOP_DURATIONS[LAST_HOP];
const RESET_START = HOLD_START + HOLD_AT_GLOBAL;

export type ExplorerPhase = "travel" | "settle" | "sample" | "escape" | "hold" | "reset";

export type ExplorerState = {
  x: number;
  z: number;
  y: number;
  phase: ExplorerPhase;
  stopIndex: number; // 1..VALLEYS.length — the valley just reached or being approached
  localT: number; // 0..1 progress within the current phase
  isGlobalMinimum: boolean;
  /** How far through the whole journey we are, 0..1 — drives the surface's rising confidence. */
  journeyProgress: number;
  /** Fades to 0 right at the loop seam so the reset is invisible. */
  envelope: number;
};

function envelopeAt(t: number): number {
  const fadeIn = smoothstep(0, 0.25, t);
  const fadeOut = 1 - smoothstep(TOTAL_DURATION - 0.35, TOTAL_DURATION, t);
  return Math.min(fadeIn, fadeOut);
}

function restState(phase: "hold" | "reset", localT: number, envelope: number): ExplorerState {
  const stop = STOPS[STOPS.length - 1];
  return {
    x: stop.x,
    z: stop.z,
    y: landscapeHeight(stop.x, stop.z),
    phase,
    stopIndex: GLOBAL_MINIMUM_INDEX + 1,
    localT,
    isGlobalMinimum: true,
    journeyProgress: 1,
    envelope,
  };
}

export function getExplorerState(elapsed: number): ExplorerState {
  const t = elapsed % TOTAL_DURATION;
  const envelope = envelopeAt(t);

  if (t >= RESET_START) return restState("reset", 1, envelope);
  if (t >= HOLD_START) return restState("hold", (t - HOLD_START) / HOLD_AT_GLOBAL, envelope);

  let hopIndex = LAST_HOP;
  for (let i = 0; i < HOP_DURATIONS.length; i++) {
    if (t < HOP_START[i] + HOP_DURATIONS[i]) {
      hopIndex = i;
      break;
    }
  }

  const hopT = (t - HOP_START[hopIndex]) / HOP_DURATIONS[hopIndex];
  const isFinalHop = hopIndex === LAST_HOP;
  const from = STOPS[hopIndex];
  const to = STOPS[hopIndex + 1];
  const stopIndex = hopIndex + 1;
  const journeyProgress = Math.min((hopIndex + hopT) / STOPS.length, 1);

  const travelShare = isFinalHop ? 0.42 : TRAVEL_SHARE;
  const settleShare = isFinalHop ? 0.22 : SETTLE_SHARE;
  const sampleShare = isFinalHop ? 1 - travelShare - settleShare : SAMPLE_SHARE;

  const travelEnd = travelShare;
  const settleEnd = travelEnd + settleShare;
  const sampleEnd = settleEnd + sampleShare; // === 1 for the final hop

  const fromY = landscapeHeight(from.x, from.z);
  const toY = landscapeHeight(to.x, to.z);

  if (hopT < travelEnd) {
    const u = easeInOutCubic(hopT / travelEnd);
    const x = from.x + (to.x - from.x) * u;
    const z = from.z + (to.z - from.z) * u;
    const baseY = fromY + (toY - fromY) * u;
    const leap = arcHeight(u) * 2.1;
    return {
      x,
      z,
      y: baseY + leap,
      phase: "travel",
      stopIndex,
      localT: hopT / travelEnd,
      isGlobalMinimum: false,
      journeyProgress,
      envelope,
    };
  }

  if (hopT < settleEnd) {
    const localT = (hopT - travelEnd) / settleShare;
    const bounce = Math.max(dampedBounce(localT), 0) * 0.5;
    return {
      x: to.x,
      z: to.z,
      y: toY + bounce,
      phase: "settle",
      stopIndex,
      localT,
      isGlobalMinimum: isFinalHop,
      journeyProgress,
      envelope,
    };
  }

  if (hopT < sampleEnd) {
    const localT = (hopT - settleEnd) / sampleShare;
    const wobble = Math.sin(localT * Math.PI * 5) * 0.035;
    return {
      x: to.x,
      z: to.z,
      y: toY + wobble,
      phase: "sample",
      stopIndex,
      localT,
      isGlobalMinimum: isFinalHop,
      journeyProgress,
      envelope,
    };
  }

  // "escape" — a tiny anticipatory crouch before the next leap (exploratory hops only)
  const localT = (hopT - sampleEnd) / (1 - sampleEnd);
  const crouch = -Math.sin(localT * Math.PI) * 0.12;
  return {
    x: to.x,
    z: to.z,
    y: toY + crouch,
    phase: "escape",
    stopIndex,
    localT,
    isGlobalMinimum: false,
    journeyProgress,
    envelope,
  };
}

export const STOP_POSITIONS = STOPS;
