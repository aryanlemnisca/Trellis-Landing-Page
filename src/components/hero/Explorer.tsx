"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLOBAL_MINIMUM_INDEX, VALLEYS, landscapeHeight } from "./landscape";
import { getExplorerState, STOP_POSITIONS } from "./explorerPath";
import { hash } from "@/lib/hash";
import { smoothstep } from "./easing";

const SCATTER_COUNT = 10;

/** Small dark marker left behind at each valley once the explorer has reached it. */
function VisitedMarker({
  index,
  animate,
}: {
  index: number; // 0-based into VALLEYS
  animate: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const valley = VALLEYS[index];
  const y = landscapeHeight(valley.x, valley.z) + 0.05;

  useFrame(({ clock }) => {
    if (!animate || !ref.current) return;
    const state = getExplorerState(clock.getElapsedTime());
    const reachedIndex = state.phase === "travel" ? state.stopIndex - 1 : state.stopIndex;
    const reached = index + 1 <= reachedIndex;
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = (reached ? 1 : 0) * state.envelope;
  });

  return (
    <mesh ref={ref} position={[valley.x, y, valley.z]}>
      <sphereGeometry args={[0.07, 10, 10]} />
      <meshBasicMaterial color="#0a0a0a" transparent opacity={animate ? 0 : 1} />
    </mesh>
  );
}

/** A flurry of quick, staggered local samples around the valley currently being explored. */
function SamplingScatter({ animate }: { animate: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const offsets = useMemo(
    () =>
      Array.from({ length: SCATTER_COUNT }, (_, i) => {
        const angle = hash(i * 2) * Math.PI * 2;
        const radius = 0.45 + hash(i * 2 + 1) * 0.7;
        return { dx: Math.cos(angle) * radius, dz: Math.sin(angle) * radius, appearAt: (i / SCATTER_COUNT) * 0.72 };
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!animate) return;
    const state = getExplorerState(clock.getElapsedTime());
    const active = state.phase === "sample";

    offsets.forEach((offset, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      if (!active) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        return;
      }
      const x = state.x + offset.dx;
      const z = state.z + offset.dz;
      mesh.position.set(x, landscapeHeight(x, z) + 0.06, z);
      const flicker =
        smoothstep(offset.appearAt, offset.appearAt + 0.05, state.localT) *
        (1 - smoothstep(offset.appearAt + 0.16, offset.appearAt + 0.24, state.localT));
      (mesh.material as THREE.MeshBasicMaterial).opacity = flicker * 0.7 * state.envelope;
    });
  });

  if (!animate) return null;

  return (
    <group>
      {offsets.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#38afd8" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The candidate for the next experiment: a hollow ring at the destination
 * valley, flagged while the marker is still travelling there — so every hop
 * visibly reads as "here's the next experiment worth running" before it
 * resolves into a measured local or global minimum.
 */
function CandidateMarker({ animate }: { animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [showLabel, setShowLabel] = useState(false);

  useFrame(({ clock }) => {
    if (!animate) return;
    const state = getExplorerState(clock.getElapsedTime());
    const destination = STOP_POSITIONS[Math.min(state.stopIndex, STOP_POSITIONS.length - 1)];
    const y = landscapeHeight(destination.x, destination.z);

    const active = state.phase === "travel";
    const fadeIn = smoothstep(0, 0.2, state.localT);
    const fadeOut = 1 - smoothstep(0.7, 0.92, state.localT);
    const opacity = active ? fadeIn * fadeOut : 0;

    if (groupRef.current) {
      groupRef.current.position.set(destination.x, y + 0.05, destination.z);
      groupRef.current.visible = active;
    }
    if (ringRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 4.2) * 0.1;
      ringRef.current.scale.setScalar(pulse);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.85 * state.envelope;
    }

    const shouldShow = opacity > 0.15;
    if (shouldShow !== showLabel) setShowLabel(shouldShow);
  });

  if (!animate) return null;

  return (
    <group ref={groupRef}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.17, 0.23, 32]} />
        <meshBasicMaterial
          color="#38afd8"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <Html position={[0, 0.5, 0]} center style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap rounded-sm border border-accent/40 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent transition-opacity duration-300"
          style={{ opacity: showLabel ? 1 : 0 }}
        >
          Next experiment
        </div>
      </Html>
    </group>
  );
}

/** The expanding ring marking the moment the global minimum is found. */
function ArrivalRing({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const globalValley = VALLEYS[GLOBAL_MINIMUM_INDEX];
  const y = landscapeHeight(globalValley.x, globalValley.z) + 0.03;

  useFrame(({ clock }) => {
    if (!animate || !ref.current) return;
    const state = getExplorerState(clock.getElapsedTime());
    const arriving = state.phase === "hold" || state.phase === "reset";
    const progress = arriving ? smoothstep(0, 0.5, state.localT) : 0;
    const scale = THREE.MathUtils.lerp(0.4, 2.1, arriving ? Math.min(state.localT * 1.6, 1) : 0);
    ref.current.scale.setScalar(Math.max(scale, 0.001));
    (ref.current.material as THREE.MeshBasicMaterial).opacity = progress * 0.6 * state.envelope;
  });

  return (
    <mesh ref={ref} position={[globalValley.x, y, globalValley.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.85, 0.95, 48]} />
      <meshBasicMaterial
        color="#38afd8"
        transparent
        opacity={animate ? 0 : 0.6}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

type ExplorerProps = { animate: boolean };

/** The single marker exploring the design space: hop, settle, sample, escape — then find the best valley. */
export function Explorer({ animate }: ExplorerProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const labelGroupRef = useRef<THREE.Group>(null);
  const [labelText, setLabelText] = useState<string | null>(null);

  const globalValley = VALLEYS[GLOBAL_MINIMUM_INDEX];
  const restPosition: [number, number, number] = [
    globalValley.x,
    landscapeHeight(globalValley.x, globalValley.z) + 0.12,
    globalValley.z,
  ];

  useFrame(({ clock }) => {
    if (!animate) return;
    const state = getExplorerState(clock.getElapsedTime());

    if (coreRef.current) {
      coreRef.current.position.set(state.x, state.y + 0.12, state.z);
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = state.envelope;
    }
    if (glowRef.current) {
      glowRef.current.position.set(state.x, state.y + 0.12, state.z);
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.6) * 0.08;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.22 * state.envelope;
    }
    if (labelGroupRef.current) {
      labelGroupRef.current.position.set(state.x, state.y + 0.65, state.z);
    }

    const showLabel = state.phase === "settle" || state.phase === "sample" || (state.phase === "hold" && state.localT < 0.5);
    const nextText = showLabel ? (state.isGlobalMinimum ? "Global minimum" : "Local minimum") : null;
    if (nextText !== labelText) setLabelText(nextText);
  });

  return (
    <group>
      {VALLEYS.map((_, i) => (
        <VisitedMarker key={i} index={i} animate={animate} />
      ))}
      <SamplingScatter animate={animate} />
      <CandidateMarker animate={animate} />
      <ArrivalRing animate={animate} />

      {animate ? (
        <Trail width={2.2} length={6} color="#38afd8" attenuation={(t) => t * t} decay={1}>
          <mesh ref={coreRef} position={restPosition}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color="#38afd8" transparent opacity={1} />
          </mesh>
        </Trail>
      ) : (
        <mesh position={restPosition}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#38afd8" />
        </mesh>
      )}

      <mesh ref={glowRef} position={restPosition}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color="#38afd8"
          transparent
          opacity={animate ? 0 : 0.18}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {animate && (
        <group ref={labelGroupRef}>
          <Html center style={{ pointerEvents: "none" }}>
            <div
              className="whitespace-nowrap rounded-sm border border-accent/40 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent transition-opacity duration-300"
              style={{ opacity: labelText ? 1 : 0 }}
            >
              {labelText ?? " "}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
