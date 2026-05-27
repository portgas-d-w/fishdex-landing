"use client";

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Scene from './canvas/Scene';

export default function Background3D() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Assurer que ScrollTrigger utilise le body/document pour le scroll global
    ScrollTrigger.refresh();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1, // En arrière plan
      pointerEvents: 'none' // Laisse passer les clics vers le site
    }}>
      <Canvas
        camera={{ position: [0, 2, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false // Opaque background
        }}
      >
        <color attach="background" args={['#010613']} />
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
