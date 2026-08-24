"use client";

import { Component, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { FitnessSurface } from "./FitnessSurface";
import { Swarm } from "./Swarm";
import { HeroModel, HeroModelPlaceholder } from "./HeroModel";
import { PEAK } from "./landscape";

/** Flip to true once /public/models/trellis-hero.glb exists — see HeroModel.tsx. */
const USE_HERO_MODEL = false;

class ModelErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <HeroModelPlaceholder position={[0, 3, 0]} /> : this.props.children;
  }
}

/** Slow idle drift plus a subtle scroll-linked tilt — never full user-driven orbit. */
function CameraRig({ reduced }: { reduced: boolean }) {
  const scrollFraction = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      scrollFraction.current = Math.min(window.scrollY / (window.innerHeight || 1), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const idle = Math.sin(clock.getElapsedTime() * 0.05) * 0.15;
    camera.position.x = 6.5 + idle;
    camera.position.y = 4.5 + scrollFraction.current * 0.4;
    camera.lookAt(PEAK.x * 0.3, 0.6, PEAK.z * 0.3);
  });

  return null;
}

type HeroSceneProps = {
  reduced: boolean;
  count: number;
};

export function HeroScene({ reduced, count }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [6.5, 4.5, 7], fov: 42 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 2]} intensity={0.6} color="#ffffff" />
      <fog attach="fog" args={["#000000", 8, 20]} />

      <CameraRig reduced={reduced} />
      <FitnessSurface />
      <Swarm count={count} animate={!reduced} />

      {USE_HERO_MODEL && (
        <Suspense fallback={<HeroModelPlaceholder position={[0, 3, 0]} />}>
          <ModelErrorBoundary>
            <HeroModel position={[0, 3, 0]} />
          </ModelErrorBoundary>
        </Suspense>
      )}
    </Canvas>
  );
}
