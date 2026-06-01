import React, { useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diveState } from './useScrollProgress';
import { SURFACE_CROSSING_PROGRESS, SECTIONS } from './diveConfig';

export default function PostProcessing() {
  const dofRef = useRef<any>(null);
  const noiseRef = useRef<any>(null);
  const vignetteRef = useRef<any>(null);
  const chromaRef = useRef<any>(null);

  useFrame((state, delta) => {
    const { progress } = diveState;
    const camY = state.camera.position.y;

    // 1) DoF : focus sur la section de lecture la plus proche du progress.
    if (dofRef.current && dofRef.current.target) {
      let nearest = SECTIONS[0];
      let best = Infinity;
      for (const s of SECTIONS) {
        const dist = Math.abs(s.readingProgress - progress);
        if (dist < best) { best = dist; nearest = s; }
      }
      dofRef.current.target.set(0, 0, nearest.sectionZ);
    }

    // 2) Profondeur : grain + vignette croissants une fois immergé.
    const submerged = THREE.MathUtils.clamp((1.5 - camY) / 3.0, 0, 1);
    if (noiseRef.current?.blendMode) {
      const tgt = submerged * 0.03;
      noiseRef.current.blendMode.opacity.value = THREE.MathUtils.damp(noiseRef.current.blendMode.opacity.value, tgt, 4, delta);
    }
    if (vignetteRef.current?.uniforms) {
      const d = vignetteRef.current.uniforms.get('darkness');
      if (d) d.value = THREE.MathUtils.damp(d.value, submerged * 1.0, 4, delta);
    }

    // 3) Crossing de surface : réfraction DISCRÈTE et brève.
    //    Petite bosse d’aberration chromatique autour du franchissement,
    //    sinon valeur de repos quasi nulle. Pas d’effet spectaculaire.
    if (chromaRef.current?.offset) {
      const w = 0.04; // largeur de la fenêtre de crossing en progress
      const t = THREE.MathUtils.clamp(1 - Math.abs(progress - SURFACE_CROSSING_PROGRESS) / w, 0, 1);
      const pulse = t * t; // 0 hors fenêtre → 1 au passage
      const amt = 0.0008 + pulse * 0.0018; // repos ~0.0008, pic ~0.0026 (subtil)
      chromaRef.current.offset.set(amt, amt);
    }
  });

  return (
    // multisampling={0}: cf. note historique — DoF + MSAA blit invalide.
    <EffectComposer multisampling={0}>
      <DepthOfField ref={dofRef} target={new THREE.Vector3(0, 0, 0)} focalLength={0.02} bokehScale={2} />
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} intensity={1.2} radius={0.8} mipmapBlur />
      <ChromaticAberration ref={chromaRef} offset={new THREE.Vector2(0.0008, 0.0008)} radialModulation={false} modulationOffset={0} />
      <Noise ref={noiseRef} opacity={0} />
      <Vignette ref={vignetteRef} eskil={false} offset={0.2} darkness={0} />
    </EffectComposer>
  );
}
