"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANE_SIZE, SEGMENTS, landscapeHeight } from "./landscape";
import { getExplorerState } from "./explorerPath";

function buildPlaneGeometry() {
  const geo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, SEGMENTS, SEGMENTS);
  geo.rotateX(-Math.PI / 2);
  const position = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    position.setY(i, landscapeHeight(position.getX(i), position.getZ(i)));
  }
  position.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

type ProcessSurfacesProps = { animate: boolean };

/**
 * The design space itself: a constant, faint near-black wireframe (the space
 * as it exists, whether or not anyone has looked yet) with a cyan overlay
 * that strengthens as the explorer covers more of the journey — confidence
 * rising as more of the space gets ruled out.
 */
export function ProcessSurfaces({ animate }: ProcessSurfacesProps) {
  const geometry = useMemo(buildPlaneGeometry, []);
  const primaryMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!animate || !primaryMaterialRef.current) return;
    const state = getExplorerState(clock.getElapsedTime());
    primaryMaterialRef.current.opacity = THREE.MathUtils.lerp(0.06, 0.8, state.journeyProgress) * state.envelope;
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#0a0a0a" wireframe transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={primaryMaterialRef}
          color="#38afd8"
          wireframe
          transparent
          opacity={animate ? 0.06 : 0.8}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
