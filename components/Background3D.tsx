"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Scene from './canvas/Scene';
import { initScrollTracking } from './canvas/useScrollProgress';

export default function Background3D() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      setShouldRender(false);
      return;
    }
    
    setShouldRender(true);
    
    initScrollTracking();
    ScrollTrigger.refresh();
  }, []);

  // Sur mobile ou si "reduced motion", on rend un simple dégradé CSS (via classes Tailwind ou inline)
  if (!shouldRender) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: 'linear-gradient(to bottom, #0d2820 0%, #040a0d 100%)',
        pointerEvents: 'none'
      }} />
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none',
      background: '#040a0d' // Fallback color
    }}>
      <Canvas
        camera={{ position: [0, 5, 100], fov: 60 }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false
        }}
      >
        <color attach="background" args={['#040a0d']} />
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
