"use client";

import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

/**
 * Subtle mouse parallax (desktop) + a small controlled scroll-depth transition,
 * plus a slow, lagging camera follow of wherever the explorer currently is.
 * No idle auto-rotation, no free orbit.
 */
function CameraRig({ interactive, animate }: { interactive: boolean; animate: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollFraction = useRef(0);
  const followTarget = useRef({ ...REST_TARGET });
  const { camera } = useThree();

  useEffect(() => {
    if (!interactive) return;
    const onPointerMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollFraction.current = Math.min(window.scrollY / (window.innerHeight || 1), 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [interactive]);

  useFrame(({ clock }) => {
    if (animate) {
      const state = getExplorerState(clock.getElapsedTime());
      followTarget.current.x += (state.x * 0.5 - followTarget.current.x) * 0.02;
      followTarget.current.z += (state.z * 0.5 - followTarget.current.z) * 0.02;
    } else {
      followTarget.current.x += (REST_TARGET.x - followTarget.current.x) * 0.05;
      followTarget.current.z += (REST_TARGET.z - followTarget.current.z) * 0.05;
    }

    const targetX = 9 + (interactive ? mouse.current.x * 0.4 : 0);
    const targetY = 6.5 + (interactive ? -mouse.current.y * 0.3 : 0);
    const targetZ = 10.5 - scrollFraction.current * 0.8;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(followTarget.current.x, -0.3, followTarget.current.z);
  });

  return null;
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

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [9, 6.5, 10.5], fov: 38 }}
      >
        <CameraRig interactive={!reduced && !isMobile} animate={animate} />
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
