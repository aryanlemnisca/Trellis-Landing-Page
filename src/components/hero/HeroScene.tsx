"use client";

import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ProcessSurfaces } from "./ProcessSurfaces";
import { EvidenceLayer } from "./EvidenceLayer";
import { HeroModel, HeroModelPlaceholder } from "./HeroModel";
import { HeroStaticFallback } from "./HeroStaticFallback";
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

/** Subtle mouse parallax (desktop) + a small controlled scroll-depth transition. No idle auto-rotation. */
function CameraRig({ interactive }: { interactive: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollFraction = useRef(0);
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

  useFrame(() => {
    const targetX = 6.5 + (interactive ? mouse.current.x * 0.35 : 0);
    const targetY = 4.5 + (interactive ? -mouse.current.y * 0.25 : 0);
    const targetZ = 7 - scrollFraction.current * 0.7;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(PEAK.x * 0.25, 0.5, PEAK.z * 0.25);
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
        camera={{ position: [6.5, 4.5, 7], fov: 42 }}
      >
        <CameraRig interactive={!reduced && !isMobile} />
        <ProcessSurfaces animate={animate} showAlternatives={!isMobile} />
        <EvidenceLayer animate={animate} />

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
