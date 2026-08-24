"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { CYCLE_SECONDS, EVIDENCE_POINTS, PEAK, STAGES, UNCERTAIN_POINT, landscapeHeight } from "./landscape";
import { smoothstep } from "./easing";

function envelopeAt(t: number) {
  return smoothstep(0, 0.035, t) * (1 - smoothstep(0.965, 1, t));
}

/** A single measured observation — appears once, deliberately, and stays. */
function EvidencePoint({
  x,
  z,
  appearAt,
  animate,
}: {
  x: number;
  z: number;
  appearAt: number;
  animate: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const y = landscapeHeight(x, z) + 0.09;

  useFrame(({ clock }) => {
    if (!animate || !ref.current) return;
    const t = (clock.getElapsedTime() % CYCLE_SECONDS) / CYCLE_SECONDS;
    const env = envelopeAt(t);
    const reveal = smoothstep(appearAt, appearAt + 0.035, t);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1, reveal));
    (ref.current.material as THREE.MeshBasicMaterial).opacity = reveal * env;
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <sphereGeometry args={[0.09, 12, 12]} />
      <meshBasicMaterial color="#0a0a0a" transparent opacity={animate ? 0 : 1} />
    </mesh>
  );
}

/** The candidate robust operating region — an area, not a single dot. */
function RobustRegion({ animate }: { animate: boolean }) {
  const fillRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const y = landscapeHeight(PEAK.x, PEAK.z) + 0.03;

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = (clock.getElapsedTime() % CYCLE_SECONDS) / CYCLE_SECONDS;
    const env = envelopeAt(t);
    const reveal = smoothstep(STAGES.robustRegion[0], STAGES.robustRegion[1], t);
    if (fillRef.current) (fillRef.current.material as THREE.MeshBasicMaterial).opacity = reveal * 0.14 * env;
    if (ringRef.current) (ringRef.current.material as THREE.MeshBasicMaterial).opacity = reveal * 0.55 * env;
  });

  return (
    <group position={[PEAK.x, y, PEAK.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={fillRef}>
        <circleGeometry args={[1.35, 48]} />
        <meshBasicMaterial color="#38afd8" transparent opacity={animate ? 0 : 0.14} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[1.3, 1.35, 48]} />
        <meshBasicMaterial color="#38afd8" transparent opacity={animate ? 0 : 0.55} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Where consequential uncertainty remains — a hollow marker that becomes a measured point. */
function NextExperimentMarker({ animate }: { animate: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const solidRef = useRef<THREE.Mesh>(null);
  const [showLabel, setShowLabel] = useState(false);
  const y = landscapeHeight(UNCERTAIN_POINT.x, UNCERTAIN_POINT.z);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = (clock.getElapsedTime() % CYCLE_SECONDS) / CYCLE_SECONDS;
    const env = envelopeAt(t);

    const ringIn = smoothstep(STAGES.nextExperiment[0], STAGES.nextExperiment[1], t);
    const ringOut = smoothstep(STAGES.becomesEvidence[0], STAGES.becomesEvidence[1], t);
    const ringOpacity = ringIn * (1 - ringOut);
    const solidIn = smoothstep(STAGES.becomesEvidence[0], STAGES.becomesEvidence[1], t);

    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = ringOpacity * 0.9 * env;
      ringRef.current.scale.setScalar(THREE.MathUtils.lerp(0.6, 1, ringIn));
    }
    if (solidRef.current) {
      (solidRef.current.material as THREE.MeshBasicMaterial).opacity = solidIn * env;
      solidRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1, solidIn));
    }

    const shouldShow = ringOpacity > 0.05;
    if (shouldShow !== showLabel) setShowLabel(shouldShow);
  });

  return (
    <group position={[UNCERTAIN_POINT.x, y, UNCERTAIN_POINT.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.16, 0.21, 32]} />
        <meshBasicMaterial color="#38afd8" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={solidRef} position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={animate ? 0 : 1} />
      </mesh>
      {animate && (
        <Html position={[0, 0.55, 0]} center style={{ pointerEvents: "none" }}>
          <div
            className="whitespace-nowrap rounded-sm border border-accent/40 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent transition-opacity duration-300"
            style={{ opacity: showLabel ? 1 : 0 }}
          >
            Next experiment
          </div>
        </Html>
      )}
    </group>
  );
}

export function EvidenceLayer({ animate }: { animate: boolean }) {
  return (
    <group>
      {EVIDENCE_POINTS.map((point, i) => (
        <EvidencePoint key={i} x={point.x} z={point.z} appearAt={point.appearAt} animate={animate} />
      ))}
      <RobustRegion animate={animate} />
      <NextExperimentMarker animate={animate} />
    </group>
  );
}
