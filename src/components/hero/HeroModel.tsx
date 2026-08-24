"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

type GroupProps = ThreeElements["group"];

/**
 * ── SWAP-IN SLOT ─────────────────────────────────────────────────────────
 * Drop the slide-deck 3D export at /public/models/trellis-hero.glb, then
 * flip USE_HERO_MODEL to true in HeroScene.tsx. No other code changes needed.
 * This component loads and centers that asset once it exists.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function HeroModel(props: GroupProps) {
  const { scene } = useGLTF("/models/trellis-hero.glb");
  return <primitive object={scene} {...props} />;
}

/** Stand-in shown only if USE_HERO_MODEL is on before the real asset is dropped in. */
export function HeroModelPlaceholder(props: GroupProps) {
  return (
    <group {...props}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#38afd8"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </group>
  );
}
