import React, { useRef, useMemo } from 'react';
import CameraRig from './CameraRig';
import PostProcessing from './PostProcessing';
import EnvironmentParticles from './Environment/Particles';
import Fauna from './Environment/Fauna';
import Caustics from './Environment/Caustics';
import * as THREE from 'three';
import GodRays from './GodRays';
import HtmlSections from './UI/HtmlSections';
import { useFrame } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { diveState } from './useScrollProgress';
import { sampleDepthGrading } from './diveConfig';
import WaterSurface from './WaterSurface';
import FluidLayer from './fluid/FluidLayer';
import { FluidDisplacementEffect } from './fluid/FluidDisplacementEffect';
import { QUALITY_TIERS, type QualityTier } from './qualityTier';

import UnderwaterBackground from './Environment/UnderwaterBackground';

// HDRI du lac (PNG équirectangulaire) → IBL/réflexions pour la surface d'eau.
// NB : l'asset livré est un .png (pas .hdr), donc on le charge en texture et on
// le passe à <Environment map={...}> (le loader `files` de drei ne gère pas .png).
function LakeEnvironment() {
  const envMap = useTexture('/assets/ultimate/hdri-lake.png');
  useMemo(() => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
  }, [envMap]);
  return <Environment map={envMap} />;
}

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
  // Effet de displacement partagé entre la sim de fluide et le composer.
  const fluidEffect = useMemo(() => new FluidDisplacementEffect(0.03), []);
  return (
    <>
      <CameraRig />
      <DynamicEnvironment />

      {/* IBL : la surface d'eau réfléchit le paysage du lac (HDRI) */}
      <LakeEnvironment />
      
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

      {/* Simulation de fluide interactive (curseur) — desktop uniquement */}
      {params.fluidSim && <FluidLayer effect={fluidEffect} />}

      {/* Post-processing — Bloom + Chromatic Aberration (désactivé en palier bas) */}
      {params.postProcessing && (
        <PostProcessing
          dof={params.depthOfField}
          fluidEffect={params.fluidSim ? fluidEffect : null}
        />
      )}
    </>
  );
}
