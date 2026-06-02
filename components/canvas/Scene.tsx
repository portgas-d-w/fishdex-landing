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
import { Environment, useTexture } from '@react-three/drei';
import { diveState } from './useScrollProgress';
import { sampleDepthGrading } from './diveConfig';
import WaterSurface from './WaterSurface';
import UnderwaterAudio from './audio/UnderwaterAudio';
import FluidLayer from './fluid/FluidLayer';
import { FluidDisplacementEffect } from './fluid/FluidDisplacementEffect';
import { QUALITY_TIERS, type QualityTier } from './qualityTier';

import UnderwaterBackground from './Environment/UnderwaterBackground';

// HDRI du lac (PNG équirectangulaire) → IBL/réflexions pour la surface d'eau.
// NB : l'asset livré est un .png (pas .hdr), donc on le charge en texture et on
// le passe à <Environment map={...}> (le loader `files` de drei ne gère pas .png).
function LakeEnvironment() {
  const scene = useThree((s) => s.scene);
  // Skybox 360° (vrai HDRI équirectangulaire Poly Haven) + IBL pour les reflets.
  // Pleine au-dessus de l'eau, s'assombrit/floute en plongeant → fond vers le fog.
  useFrame((state) => {
    const y = state.camera.position.y;
    const submerge = THREE.MathUtils.clamp((1 - y) / 4, 0, 1); // 0 au-dessus, 1 en profondeur
    scene.backgroundIntensity = THREE.MathUtils.lerp(1.0, 0.0, submerge);
    scene.backgroundBlurriness = THREE.MathUtils.lerp(0.0, 0.4, submerge);
  });
  return <Environment files="/assets/ultimate/bell_park_pier_4k.hdr" background />;
}

/**
 * Fond plat cinématique de la section 1 : un plan attaché à la caméra (toujours
 * cadré), texturé avec le paysage de lac. Plein au-dessus de l'eau, s'efface à
 * la plongée (révèle le fond sombre + fog). Pas de fog/depth → toujours net.
 */
function LakeBackdrop() {
  const tex = useTexture('/assets/ultimate/lake-backdrop.png');
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const dir = useRef(new THREE.Vector3());
  const DIST = 60; // TUNE — distance du plan devant la caméra

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.getWorldDirection(dir.current);
    mesh.position.copy(cam.position).addScaledVector(dir.current, DIST);
    mesh.quaternion.copy(cam.quaternion);
    // Échelle pour remplir le champ de vision à cette distance.
    const h = 2 * DIST * Math.tan((cam.fov * Math.PI) / 360);
    mesh.scale.set(h * cam.aspect, h, 1);
    if (matRef.current) {
      const y = cam.position.y;
      matRef.current.opacity = THREE.MathUtils.clamp((y + 0.5) / 2, 0, 1); // y>1.5→1, y<-0.5→0
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-1000} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={matRef}
        map={tex}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </mesh>
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

      {/* Section 1 : skybox HDRI 360° (desktop) ou fond plat léger (mobile, perf) */}
      {tier === 'high' ? <LakeEnvironment /> : <LakeBackdrop />}
      
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
