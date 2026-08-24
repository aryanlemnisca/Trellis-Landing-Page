"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ALTERNATIVE_PEAKS,
  CYCLE_SECONDS,
  PEAK,
  PLANE_SIZE,
  SEGMENTS,
  STAGES,
  heightWithPeak,
  landscapeHeight,
  type Bump,
} from "./landscape";
import { smoothstep } from "./easing";

function buildPlaneGeometry() {
  const geo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, SEGMENTS, SEGMENTS);
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function applyHeight(geo: THREE.BufferGeometry, heightFn: (x: number, z: number) => number) {
  const position = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    position.setY(i, heightFn(position.getX(i), position.getZ(i)));
  }
  position.needsUpdate = true;
  geo.computeVertexNormals();
}

/** Very quick fade at the very start/end of the cycle — masks the loop reset. */
function envelopeAt(t: number) {
  return smoothstep(0, 0.035, t) * (1 - smoothstep(0.965, 1, t));
}

type ProcessSurfacesProps = {
  animate: boolean;
  showAlternatives: boolean;
};

/**
 * Three layers sharing one true shape:
 *  - a constant, faint near-black wireframe — the space itself, always partly visible
 *  - a cyan wireframe over the same shape that strengthens as evidence accumulates
 *  - (desktop only) alternative hypothesis surfaces that converge into the true
 *    shape and fade out as the model resolves them
 */
export function ProcessSurfaces({ animate, showAlternatives }: ProcessSurfacesProps) {
  const baseGeometry = useMemo(() => {
    const geo = buildPlaneGeometry();
    applyHeight(geo, landscapeHeight);
    return geo;
  }, []);

  const primaryMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const altGeometries = useMemo(
    () => (showAlternatives ? ALTERNATIVE_PEAKS.map(() => buildPlaneGeometry()) : []),
    [showAlternatives]
  );
  const altMaterialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = (clock.getElapsedTime() % CYCLE_SECONDS) / CYCLE_SECONDS;
    const env = envelopeAt(t);
    const learn = smoothstep(STAGES.modelLearns[0], STAGES.modelLearns[1], t);

    if (primaryMaterialRef.current) {
      primaryMaterialRef.current.opacity = THREE.MathUtils.lerp(0.08, 0.85, learn) * env;
    }

    if (showAlternatives) {
      ALTERNATIVE_PEAKS.forEach((altPeak, i) => {
        const geo = altGeometries[i];
        const material = altMaterialRefs.current[i];
        if (!geo || !material) return;

        applyHeight(geo, (x, z) => {
          const blended: Bump = {
            x: THREE.MathUtils.lerp(altPeak.x, PEAK.x, learn),
            z: THREE.MathUtils.lerp(altPeak.z, PEAK.z, learn),
            height: THREE.MathUtils.lerp(altPeak.height, PEAK.height, learn),
            sigma: THREE.MathUtils.lerp(altPeak.sigma, PEAK.sigma, learn),
          };
          return heightWithPeak(x, z, blended);
        });

        material.opacity = THREE.MathUtils.lerp(0.35, 0, learn) * env;
      });
    }
  });

  return (
    <group>
      <mesh geometry={baseGeometry}>
        <meshBasicMaterial color="#0a0a0a" wireframe transparent opacity={0.08} depthWrite={false} />
      </mesh>

      <mesh geometry={baseGeometry}>
        <meshBasicMaterial
          ref={primaryMaterialRef}
          color="#38afd8"
          wireframe
          transparent
          opacity={animate ? 0.08 : 0.85}
          depthWrite={false}
        />
      </mesh>

      {showAlternatives &&
        animate &&
        altGeometries.map((geo, i) => (
          <mesh key={i} geometry={geo}>
            <meshBasicMaterial
              ref={(el) => {
                altMaterialRefs.current[i] = el;
              }}
              color="#0a0a0a"
              wireframe
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
        ))}
    </group>
  );
}
