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
import { diveState } from './useScrollProgress';
import { sampleDepthGrading } from './diveConfig';
import WaterSurface from './WaterSurface';
import { QUALITY_TIERS, type QualityTier } from './qualityTier';

import UnderwaterBackground from './Environment/UnderwaterBackground';

function DynamicEnvironment() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame((state, delta) => {
    const g = sampleDepthGrading(diveState.progress);
    if (fogRef.current) {
      fogRef.current.density = THREE.MathUtils.damp(fogRef.current.density, g.fogDensity, 4, delta);
      fogRef.current.color.lerp(g.fogColor, 1 - Math.exp(-4 * delta));
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, g.ambientIntensity, 4, delta);
      ambientRef.current.color.lerp(g.ambientColor, 1 - Math.exp(-4 * delta));
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#7a8c84', 0.0025]} />
      <ambientLight ref={ambientRef} intensity={0.5} color="#9fb8c0" />
    </>
  );
}

export default function Scene({ tier }: { tier: QualityTier }) {
  const params = tier === 'dom-fallback' ? QUALITY_TIERS.low : QUALITY_TIERS[tier];
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

      {/* Surface du lac (visible au-dessus de l’eau) */}
      <WaterSurface />

      {/* 3D Elements */}
      <UnderwaterBackground />
      <GodRays />
      <Caustics />
      <EnvironmentParticles />
      <Fauna />
      
      {/* 3D UI Layers */}
      <HtmlSections />

      {/* Post-processing — Bloom + Chromatic Aberration (désactivé en palier bas) */}
      {params.postProcessing && <PostProcessing dof={params.depthOfField} />}
    </>
  );
}
