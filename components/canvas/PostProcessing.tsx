import React, { useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * dof : activé seulement quand le qualityTier l'autorise (palier `high`).
 * Sur mobile (med/low) on ne paie pas la passe de profondeur du DepthOfField.
 *
 * NB : les enfants de <EffectComposer> doivent être des éléments JSX DIRECTS
 * (pas un tableau / fragment) — sinon le câblage des passes casse au runtime.
 * D'où les deux variantes explicites du composer ci-dessous.
 */
export default function PostProcessing({ dof }: { dof: boolean }) {
  const dofRef = useRef<any>(null);
  const noiseRef = useRef<any>(null);
  const vignetteRef = useRef<any>(null);

  // Temporaires préalloués (évite des allocations par frame).
  const focusPoint = useRef(new THREE.Vector3());
  const viewDir = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const camY = state.camera.position.y;

    // DoF : focus à 5 unités DEVANT la caméra (point monde = pos + dir * 5).
    if (dofRef.current?.target) {
      const cam = state.camera;
      cam.getWorldDirection(viewDir.current);
      focusPoint.current.copy(cam.position).addScaledVector(viewDir.current, 5);
      dofRef.current.target.copy(focusPoint.current);
    }

    // Profondeur : grain + vignette croissants une fois immergé.
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

  // Palier high : avec DepthOfField (passe de profondeur). multisampling={0} : cf.
  // note historique — DoF + MSAA blit invalide.
  if (dof) {
    return (
      <EffectComposer multisampling={0}>
        <DepthOfField ref={dofRef} target={new THREE.Vector3(0, 0, 0)} focalLength={0.02} bokehScale={2} />
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} intensity={1.2} radius={0.8} mipmapBlur />
        <ChromaticAberration offset={new THREE.Vector2(0.0009, 0.0009)} radialModulation={false} modulationOffset={0} />
        <Noise ref={noiseRef} opacity={0} />
        <Vignette ref={vignetteRef} eskil={false} offset={0.2} darkness={0} />
      </EffectComposer>
    );
  }

  // Paliers sans DoF (mobile med) : on garde le reste du post-processing.
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.5} intensity={1.2} radius={0.8} mipmapBlur />
      <ChromaticAberration offset={new THREE.Vector2(0.0009, 0.0009)} radialModulation={false} modulationOffset={0} />
      <Noise ref={noiseRef} opacity={0} />
      <Vignette ref={vignetteRef} eskil={false} offset={0.2} darkness={0} />
    </EffectComposer>
  );
}
