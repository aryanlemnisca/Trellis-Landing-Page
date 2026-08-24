"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PLANE_SIZE } from "./landscape";

const WIDTH = PLANE_SIZE + 1;
const HEIGHT = 5.6;
const CENTER_Y = -0.5;

/** A static hairline box framing the design space — the "vast, bounded space" this is all happening inside. */
export function BoundingFrame() {
  const geometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(WIDTH, HEIGHT, WIDTH)),
    []
  );

  return (
    <lineSegments geometry={geometry} position={[0, CENTER_Y, 0]}>
      <lineBasicMaterial color="#0a0a0a" transparent opacity={0.12} />
    </lineSegments>
  );
}
