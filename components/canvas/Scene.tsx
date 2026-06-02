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
import { Environment, Lightformer } from '@react-three/drei';
import { diveState } from './useScrollProgress';
import { sampleDepthGrading } from './diveConfig';
import WaterSurface from './WaterSurface';
import UnderwaterAudio from './audio/UnderwaterAudio';
import FluidLayer from './fluid/FluidLayer';
import { FluidDisplacementEffect } from './fluid/FluidDisplacementEffect';
import { QUALITY_TIERS, type QualityTier } from './qualityTier';

import UnderwaterBackground from './Environment/UnderwaterBackground';
import LakeBackdrop from './Environment/LakeBackdrop';

// IBL only (plus de skybox HDRI 360°) : un petit Environment alimenté par des
// Lightformers procéduraux (ciel + horizon chaud + soleil) → reflets golden
// hour sur la surface de l'eau, sans fichier .hdr. `frames={1}` : baké une seule
// fois (env statique) → coût négligeable. Pas de `background` : sert uniquement
// scene.environment. Le décor visible est géré par <LakeBackdrop />.
function LightEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Voûte céleste — bleu doux, éclaire par le haut */}
      <Lightformer
        form="rect"
        intensity={0.7}
        color="#9ec6e8"
        scale={[120, 120, 1]}
        position={[0, 60, -40]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* Bande d'horizon chaude (golden hour) */}
      <Lightformer
        form="rect"
        intensity={1.2}
        color="#ffce95"
        scale={[160, 12, 1]}
        position={[0, 4, -90]}
      />
      {/* Soleil rasant — reflet doré principal sur l'eau */}
      <Lightformer
        form="ring"
        intensity={3.5}
        color="#ffb066"
        scale={[26, 26, 1]}
        position={[-40, 9, -70]}
      />
    </Environment>
  );
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

      {/* Décor cinématographique fixe de bord de lac (tous les tiers WebGL). */}
      <LakeBackdrop />

      {/* IBL Lightformers pour les reflets sur l'eau (desktop puissant + moyen). */}
      {(tier === 'high' || tier === 'med') && <LightEnvironment />}
      
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
