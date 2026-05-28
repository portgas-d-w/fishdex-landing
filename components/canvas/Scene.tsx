import React, { useRef } from 'react';
import CameraRig from './CameraRig';
import WaterSurface from './WaterSurface';
import PostProcessing from './PostProcessing';
import EnvironmentParticles from './Environment/Particles';
import Fauna from './Environment/Fauna';
import Caustics from './Environment/Caustics';
import * as THREE from 'three';
import FishingFloat from './Environment/FishingFloat';
import FishingLine from './Environment/FishingLine';
import GodRays from './GodRays';
import HtmlSections from './UI/HtmlSections';
import { Environment, useTexture } from '@react-three/drei';
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
    const plungeProgress = THREE.MathUtils.clamp((3.5 - y) / 4.5, 0, 1); // 0 at surface, 1 underwater
    
    // 2. Depth transition (Z-based)
    // Section 2 is at -150 (Z target -50), Section 5 is at -600 (Z target -500)
    const deepProgress = THREE.MathUtils.clamp((-50 - z) / 450, 0, 1); // 0 at Sec 2, 1 at Sec 5+
    
    if (fogRef.current) {
      // Density increases during plunge, then increases more in deep abyss
      const targetDensity = 0.002 + plungeProgress * 0.0035 + deepProgress * 0.002;
      fogRef.current.density = THREE.MathUtils.damp(fogRef.current.density, targetDensity, 4, delta);
      
      // Color logic
      const targetColor = new THREE.Color();
      if (plungeProgress < 1) {
        // Blending into the water
        targetColor.lerpColors(colorSurface, colorSec2, plungeProgress);
      } else {
        // Deep diving
        if (deepProgress < 0.5) {
          // Sec 2 to Sec 3/4
          targetColor.lerpColors(colorSec2, colorSec4, deepProgress * 2);
        } else {
          // Sec 4 to Abyss
          targetColor.lerpColors(colorSec4, colorAbyss, (deepProgress - 0.5) * 2);
        }
      }
      
      fogRef.current.color.lerp(targetColor, 0.1);
    }
    
    if (ambientRef.current) {
      // Intensity: 0.4 at surface, 0.2 underwater, 0.05 in abyss
      const targetIntensity = 0.4 - plungeProgress * 0.2 - deepProgress * 0.15;
      ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, targetIntensity, 4, delta);
      
      // Color logic matches fog
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

  const envMap = useTexture('/images/new/section-1.png');
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#051014', 0.002]} />
      <ambientLight ref={ambientRef} intensity={0.4} color="#0f2b38" />
      <Environment map={envMap} background />
    </>
  );
}

export default function Scene() {
  return (
    <>
      <CameraRig />
      <DynamicEnvironment />
      
      {/* Sun — bas gauche, horizon, face à la caméra */}
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
      <FishingFloat />
      <FishingLine />
      <WaterSurface />
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
