"use client";

import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ProcessSurfaces } from "./ProcessSurfaces";
import { Explorer } from "./Explorer";
import { BoundingFrame } from "./BoundingFrame";
import { HeroModel, HeroModelPlaceholder } from "./HeroModel";
import { HeroStaticFallback } from "./HeroStaticFallback";
import { GLOBAL_MINIMUM_INDEX, VALLEYS } from "./landscape";
import { getExplorerState } from "./explorerPath";

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

/** Catches WebGL context-creation failures and anything else the scene throws. */
class SceneErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <HeroStaticFallback /> : this.props.children;
  }
}

const GLOBAL_VALLEY = VALLEYS[GLOBAL_MINIMUM_INDEX];
const REST_TARGET = { x: GLOBAL_VALLEY.x * 0.5, z: GLOBAL_VALLEY.z * 0.5 };

const INITIAL_CAMERA_POSITION: [number, number, number] = [9, 6.5, 10.5];
const INITIAL_TARGET: [number, number, number] = [REST_TARGET.x, -0.3, REST_TARGET.z];

// A restricted "peek around" range computed from the initial framing — not a free orbit.
const AZIMUTH_RANGE = 0.55;
const POLAR_RANGE = 0.3;
const initialOffset = new THREE.Vector3(...INITIAL_CAMERA_POSITION).sub(new THREE.Vector3(...INITIAL_TARGET));
const initialSpherical = new THREE.Spherical().setFromVector3(initialOffset);
const MIN_AZIMUTH = initialSpherical.theta - AZIMUTH_RANGE;
const MAX_AZIMUTH = initialSpherical.theta + AZIMUTH_RANGE;
const MIN_POLAR = Math.max(initialSpherical.phi - POLAR_RANGE, 0.35);
const MAX_POLAR = Math.min(initialSpherical.phi + POLAR_RANGE, 1.45);

/** Camera that eases toward a base framing and follows wherever the explorer is — no user input. */
function PassiveCameraRig({ animate }: { animate: boolean }) {
  const followTarget = useRef({ ...REST_TARGET });
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (animate) {
      const state = getExplorerState(clock.getElapsedTime());
      followTarget.current.x += (state.x * 0.5 - followTarget.current.x) * 0.02;
      followTarget.current.z += (state.z * 0.5 - followTarget.current.z) * 0.02;
    } else {
      followTarget.current.x += (REST_TARGET.x - followTarget.current.x) * 0.05;
      followTarget.current.z += (REST_TARGET.z - followTarget.current.z) * 0.05;
    }

    camera.position.x += (INITIAL_CAMERA_POSITION[0] - camera.position.x) * 0.04;
    camera.position.y += (INITIAL_CAMERA_POSITION[1] - camera.position.y) * 0.04;
    camera.position.z += (INITIAL_CAMERA_POSITION[2] - camera.position.z) * 0.04;
    camera.lookAt(followTarget.current.x, -0.3, followTarget.current.z);
  });

  return null;
}

/**
 * Desktop only: drag to look around within a restricted range (no zoom, no
 * pan, no full free-orbit) — the look-at point still gently follows the
 * explorer, it's just now the user who's holding the camera.
 */
function InteractiveCameraRig({ animate }: { animate: boolean }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const followTarget = useRef({ ...REST_TARGET });

  useFrame(({ clock }) => {
    if (animate) {
      const state = getExplorerState(clock.getElapsedTime());
      followTarget.current.x += (state.x * 0.5 - followTarget.current.x) * 0.02;
      followTarget.current.z += (state.z * 0.5 - followTarget.current.z) * 0.02;
    } else {
      followTarget.current.x += (REST_TARGET.x - followTarget.current.x) * 0.05;
      followTarget.current.z += (REST_TARGET.z - followTarget.current.z) * 0.05;
    }

    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(followTarget.current.x, -0.3, followTarget.current.z);
      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={INITIAL_TARGET}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.45}
      minAzimuthAngle={MIN_AZIMUTH}
      maxAzimuthAngle={MAX_AZIMUTH}
      minPolarAngle={MIN_POLAR}
      maxPolarAngle={MAX_POLAR}
    />
  );
}

type HeroSceneProps = {
  reduced: boolean;
  isMobile: boolean;
};

function HeroSceneInner({ reduced, isMobile }: HeroSceneProps) {
  const [active, setActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);

    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const animate = !reduced && active;
  const interactive = !reduced && !isMobile;

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 38 }}
      >
        {interactive ? <InteractiveCameraRig animate={animate} /> : <PassiveCameraRig animate={animate} />}
        <BoundingFrame />
        <ProcessSurfaces animate={animate} />
        <Explorer animate={animate} />

        {USE_HERO_MODEL && (
          <Suspense fallback={<HeroModelPlaceholder position={[0, 3, 0]} />}>
            <ModelErrorBoundary>
              <HeroModel position={[0, 3, 0]} />
            </ModelErrorBoundary>
          </Suspense>
        )}
      </Canvas>
    </div>
  );
}

export function HeroScene(props: HeroSceneProps) {
  return (
    <SceneErrorBoundary>
      <HeroSceneInner {...props} />
    </SceneErrorBoundary>
  );
}
