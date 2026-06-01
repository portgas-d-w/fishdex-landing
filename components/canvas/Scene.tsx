import React, { useRef } from 'react';
import CameraRig from './CameraRig';
import PostProcessing from './PostProcessing';
import EnvironmentParticles from './Environment/Particles';
import Fauna from './Environment/Fauna';
import Caustics from './Environment/Caustics';
import * as THREE from 'three';
import GodRays from './GodRays';
import HtmlSections from './UI/HtmlSections';
import { useFrame } from '@react-three/fiber';
import { cinematicState } from './useScrollProgress';

import UnderwaterBackground from './Environment/UnderwaterBackground';
import { SECTION_Z_POSITIONS } from './useScrollProgress';

function DynamicEnvironment() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  // Depth colors based on section Z targets
  const colorSurface = new THREE.Color('#051014');
  const colorSec2 = new THREE.Color('#1a3520'); // Golden green
  const colorSec4 = new THREE.Color('#0d2820'); // Dark green
  const colorAbyss = new THREE.Color('#071118'); // Pitch black

  useFrame((state, delta) => {
    const y = state.camera.position.y;
    const z = state.camera.position.z;
    
    // 1. Plunge transition (Y-based)
    const plungeProgress = THREE.MathUtils.clamp((3.5 - y) / 4.5, 0, 1);
    
    // 2. Depth transition (Z-based)
    const deepProgress = THREE.MathUtils.clamp((-50 - z) / 450, 0, 1);
    
    if (fogRef.current) {
      const targetDensity = 0.002 + plungeProgress * 0.0035 + deepProgress * 0.002;
      fogRef.current.density = THREE.MathUtils.damp(fogRef.current.density, targetDensity, 4, delta);
      
      const targetColor = new THREE.Color();
      if (plungeProgress < 1) {
        targetColor.lerpColors(colorSurface, colorSec2, plungeProgress);
      } else {
        if (deepProgress < 0.5) {
          targetColor.lerpColors(colorSec2, colorSec4, deepProgress * 2);
        } else {
          targetColor.lerpColors(colorSec4, colorAbyss, (deepProgress - 0.5) * 2);
        }
      }
      
      fogRef.current.color.lerp(targetColor, 0.1);
    }
    
    if (ambientRef.current) {
      const targetIntensity = 0.4 - plungeProgress * 0.2 - deepProgress * 0.15;
      ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, targetIntensity, 4, delta);
      
      const targetColor = new THREE.Color();
      if (plungeProgress < 1) {
        targetColor.lerpColors(new THREE.Color('#0f2b38'), colorSec2, plungeProgress);
      } else {
        if (deepProgress < 0.5) {
          targetColor.lerpColors(colorSec2, colorSec4, deepProgress * 2);
        } else {
          targetColor.lerpColors(colorSec4, colorAbyss, (deepProgress - 0.5) * 2);
        }
      }
      ambientRef.current.color.lerp(targetColor, 0.1);
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#051014', 0.002]} />
      <ambientLight ref={ambientRef} intensity={0.4} color="#0f2b38" />
    </>
  );
}

export default function Scene() {
  return (
    <>
      <CameraRig />
      <DynamicEnvironment />
      
      {/* Sun — golden hour */}
      <directionalLight
        position={[-30, 2, -100]}
        intensity={1.5}
        color="#FFAA55"
      />
      
      {/* Fill light — subtle blue from below */}
      <pointLight
        position={[0, -5, -200]}
        intensity={0.6}
        color="#0a3050"
        distance={500}
        decay={2}
      />

      {/* 3D Elements */}
      <UnderwaterBackground />
      <GodRays />
      <Caustics />
      <EnvironmentParticles />
      <Fauna />
      
      {/* 3D UI Layers */}
      <HtmlSections />

      {/* Post-processing — Bloom + Chromatic Aberration */}
      <PostProcessing />
    </>
  );
}
