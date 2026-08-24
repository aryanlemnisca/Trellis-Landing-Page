"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { landscapeHeight, PEAK, PLANE_SIZE, SEGMENTS } from "./landscape";

/** The response-surface / optimization-landscape mesh the swarm explores. */
export function FitnessSurface() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);

    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      position.setY(i, landscapeHeight(x, z));
    }

    const low = new THREE.Color("#0a0a0a");
    const high = new THREE.Color("#38afd8");
    const tmp = new THREE.Color();
    const colors = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i++) {
      const t = THREE.MathUtils.clamp(position.getY(i) / (PEAK.height * 0.85), 0, 1);
      tmp.copy(low).lerp(high, Math.pow(t, 1.6));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.7} metalness={0.15} />
      </mesh>
      {/* faint grid overlay for a "scientific instrument" feel */}
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#38afd8" wireframe transparent opacity={0.04} />
      </mesh>
      <pointLight
        position={[PEAK.x, PEAK.height + 1.4, PEAK.z]}
        color="#38afd8"
        intensity={14}
        distance={7}
      />
    </group>
  );
}
