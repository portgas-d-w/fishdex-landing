import React, { useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diveState } from './useScrollProgress';
import { SECTIONS } from './diveConfig';

export default function PostProcessing() {
  const dofRef = useRef<any>(null);
  const noiseRef = useRef<any>(null);
  const vignetteRef = useRef<any>(null);

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
    //    (Le franchissement de surface reste discret : pas d’effet spectaculaire,
    //    la réfraction est portée par cette montée douce + l’aberration statique.)
    const submerged = THREE.MathUtils.clamp((1.5 - camY) / 3.0, 0, 1);
    if (noiseRef.current?.blendMode) {
      const tgt = submerged * 0.03;
      noiseRef.current.blendMode.opacity.value = THREE.MathUtils.damp(noiseRef.current.blendMode.opacity.value, tgt, 4, delta);
    }
    if (vignetteRef.current?.uniforms) {
      const d = vignetteRef.current.uniforms.get('darkness');
      if (d) d.value = THREE.MathUtils.damp(d.value, submerged * 1.0, 4, delta);
    }
  });

  return (
    // multisampling={0}: cf. note historique — DoF + MSAA blit invalide.
    <EffectComposer multisampling={0}>
      <DepthOfField ref={dofRef} target={new THREE.Vector3(0, 0, 0)} focalLength={0.02} bokehScale={2} />
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} intensity={1.2} radius={0.8} mipmapBlur />
      {/* Aberration chromatique STATIQUE et subtile (réfraction discrète, pas de ref :
          ChromaticAberration est un wrapEffect déclaratif — l’animer par ref plante). */}
      <ChromaticAberration offset={new THREE.Vector2(0.0009, 0.0009)} radialModulation={false} modulationOffset={0} />
      <Noise ref={noiseRef} opacity={0} />
      <Vignette ref={vignetteRef} eskil={false} offset={0.2} darkness={0} />
    </EffectComposer>
  );
}
