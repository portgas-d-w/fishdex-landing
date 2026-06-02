import React, { useRef, useMemo } from 'react';
import CameraRig from './CameraRig';
import PostProcessing from './PostProcessing';
import EnvironmentParticles from './Environment/Particles';
import Fauna from './Environment/Fauna';
import Caustics from './Environment/Caustics';
import * as THREE from 'three';
import GodRays from './GodRays';
import HtmlSections from './UI/HtmlSections';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { diveState } from './useScrollProgress';
import { sampleDepthGrading } from './diveConfig';
import WaterSurface from './WaterSurface';
import UnderwaterAudio from './audio/UnderwaterAudio';
import FluidLayer from './fluid/FluidLayer';
import { FluidDisplacementEffect } from './fluid/FluidDisplacementEffect';
import { QUALITY_TIERS, type QualityTier } from './qualityTier';

import UnderwaterBackground from './Environment/UnderwaterBackground';

// Skybox 360° (vrai HDRI équirectangulaire Poly Haven, .hdr via RGBELoader) +
// IBL pour les reflets sur l'eau. Pleine au-dessus de l'eau, s'assombrit en
// plongeant → se fond dans le fog. PAS de flou (rendu net demandé).
function LakeEnvironment() {
  const scene = useThree((s) => s.scene);
  useFrame((state) => {
    const y = state.camera.position.y;
    const submerge = THREE.MathUtils.clamp((1 - y) / 4, 0, 1); // 0 au-dessus, 1 en profondeur
    scene.backgroundIntensity = THREE.MathUtils.lerp(1.0, 0.0, submerge);
    scene.backgroundBlurriness = 0; // net — pas d'effet de flou
  });
  return <Environment files="/assets/ultimate/bell_park_pier_2k.hdr" background />;
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

      {/* Section 1 : skybox HDRI 360° (desktop). Mobile = fond sombre/fog (perf). */}
      {tier === 'high' && <LakeEnvironment />}
      
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

      {/* Audio spatial (Web Audio API) : surface + abysse, lowpass au passage Y=0 */}
      <UnderwaterAudio />

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
