"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PLANE_SIZE } from "./landscape";

const HALF = (PLANE_SIZE + 1) / 2;
const TOP_Y = 3.4;

/**
 * Just the four top edges of a bounding box — a frame floating above the
 * terrain, suggesting "a vast bounded space" without the front vertical
 * edges that read as a hard-edged box cutting across the composition.
 */
export function BoundingFrame() {
  const geometry = useMemo(() => {
    const corners = [
      [-HALF, TOP_Y, -HALF],
      [HALF, TOP_Y, -HALF],
      [HALF, TOP_Y, HALF],
      [-HALF, TOP_Y, HALF],
    ];
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < corners.length; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % corners.length];
      points.push(new THREE.Vector3(...a), new THREE.Vector3(...b));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#0a0a0a" transparent opacity={0.1} />
    </lineSegments>
  );
}
