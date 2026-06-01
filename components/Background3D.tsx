"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Scene from './canvas/Scene';
import { initScrollTracking } from './canvas/useScrollProgress';
import { detectQualityTier, readDeviceEnv, QUALITY_TIERS, type QualityTier } from './canvas/qualityTier';
import { START_Z } from './canvas/diveConfig';

export default function Background3D() {
  const [tier, setTier] = useState<QualityTier | null>(null);

  useEffect(() => {
    const t = detectQualityTier(readDeviceEnv());
    setTier(t);
    if (t !== 'dom-fallback') {
      initScrollTracking();
      ScrollTrigger.refresh();
    }
  }, []);

  // Avant détection : rien (évite un flash).
  if (tier === null) return null;

  // Fallback DOM (reduced-motion / WebGL absent / device très faible) : dégradé CSS.
  if (tier === 'dom-fallback') {
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

  const params = QUALITY_TIERS[tier];

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
        camera={{ position: [0, 3.5, START_Z], fov: 60 }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, params.dprCap) : 1}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false
        }}
      >
        <color attach="background" args={['#040a0d']} />
        <Suspense fallback={null}>
          <Scene tier={tier} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
