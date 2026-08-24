"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import * as THREE from "three";
import { landscapeHeight, PEAK, PLANE_SIZE } from "./landscape";

const CYCLE_SECONDS = 18;
const SCOUT_COUNT = 18;

type Candidate = {
  scatter: THREE.Vector3;
  settled: THREE.Vector3;
  phase: number;
  hoverStart: number;
  wobbleFreq: number;
};

function randomCandidate(): Candidate {
  const bound = PLANE_SIZE * 0.42;
  const sx = (Math.random() * 2 - 1) * bound;
  const sz = (Math.random() * 2 - 1) * bound;
  const hoverStart = 0.35 + Math.random() * 0.5;

  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 0.55;
  const settled = new THREE.Vector3(
    PEAK.x + Math.cos(angle) * radius,
    0,
    PEAK.z + Math.sin(angle) * radius
  );
  settled.y = landscapeHeight(settled.x, settled.z) + 0.14;

  return {
    scatter: new THREE.Vector3(sx, landscapeHeight(sx, sz) + hoverStart, sz),
    settled,
    phase: Math.random() * 0.5,
    hoverStart,
    wobbleFreq: 0.4 + Math.random() * 0.6,
  };
}

/** Ease with a slow start/end — feels deliberate, not mechanical. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Convergence progress for one candidate at global cycle time t (0..1). */
function convergenceAt(t: number, candidate: Candidate) {
  const local = THREE.MathUtils.clamp((t - candidate.phase * 0.2) / 0.7, 0, 1);
  return easeInOutCubic(smoothstep(0.08, 0.92, local));
}

/** Overall swarm convergence (independent of any single candidate's stagger) — drives the confidence ring. */
function overallConvergenceAt(t: number) {
  return easeInOutCubic(smoothstep(0.15, 0.85, t));
}

function positionAt(t: number, elapsed: number, candidate: Candidate, out: THREE.Vector3) {
  const conv = convergenceAt(t, candidate);
  out.copy(candidate.scatter).lerp(candidate.settled, conv);

  const wobble = (1 - conv) * 0.22 * Math.sin(elapsed * candidate.wobbleFreq + candidate.phase * 10);
  out.x += wobble;
  out.z += wobble * 0.6;
  out.y = landscapeHeight(out.x, out.z) + THREE.MathUtils.lerp(candidate.hoverStart, 0.1, conv);

  return conv;
}

type SwarmProps = {
  count?: number;
  animate?: boolean;
};

/** Candidate experiments scattering across the design space, then converging on the optimum. */
export function Swarm({ count = 650, animate = true }: SwarmProps) {
  const candidates = useMemo(() => Array.from({ length: count }, randomCandidate), [count]);
  const scoutCandidates = useMemo(() => candidates.slice(0, SCOUT_COUNT), [candidates]);

  const pointsRef = useRef<THREE.Points>(null);
  const scoutRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Under prefers-reduced-motion, seed positions already-converged so the
  // static render shows the "confidence" end state, not the scattered start.
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p = animate ? candidates[i].scatter : candidates[i].settled;
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [candidates, count, animate]);

  useFrame(({ clock }) => {
    if (!animate) return;

    const elapsed = clock.getElapsedTime();
    const t = (elapsed % CYCLE_SECONDS) / CYCLE_SECONDS;
    const envelope = Math.min(smoothstep(0, 0.05, t), 1 - smoothstep(0.95, 1, t));

    const positions = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      positionAt(t, elapsed, candidates[i], tmp);
      positions.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    positions.needsUpdate = true;

    const material = (pointsRef.current?.material as THREE.PointsMaterial) ?? null;
    if (material) material.opacity = 0.85 * envelope;

    scoutCandidates.forEach((candidate, i) => {
      const mesh = scoutRefs.current[i];
      if (!mesh) return;
      positionAt(t, elapsed, candidate, tmp);
      mesh.position.copy(tmp);
    });

    if (ringRef.current) {
      const convForRing = overallConvergenceAt(t);
      const scale = THREE.MathUtils.lerp(2.6, 0.75, convForRing);
      ringRef.current.scale.setScalar(scale);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.5 * envelope * convForRing;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(elapsed * 0.03) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          color="#38afd8"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={animate ? 0 : 0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {animate &&
        scoutCandidates.map((_, i) => (
          <Trail key={i} width={1.1} length={5} color="#38afd8" attenuation={(t) => t * t} decay={1}>
            <mesh
              ref={(el) => {
                scoutRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.03, 6, 6]} />
              <meshBasicMaterial color="#38afd8" transparent opacity={0.6} />
            </mesh>
          </Trail>
        ))}

      <mesh
        ref={ringRef}
        position={[PEAK.x, landscapeHeight(PEAK.x, PEAK.z) + 0.05, PEAK.z]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.85, 0.92, 64]} />
        <meshBasicMaterial color="#38afd8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
