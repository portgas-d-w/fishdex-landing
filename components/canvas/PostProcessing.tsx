import React, { useRef } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SECTION_Z_POSITIONS, cinematicState } from './useScrollProgress';

export default function PostProcessing() {
  const dofRef = useRef<any>(null);
  const noiseRef = useRef<any>(null);
  const vignetteRef = useRef<any>(null);

  // Single source of truth for section depths (see useScrollProgress.ts)
  const sectionsZ = SECTION_Z_POSITIONS;

  useFrame((state, delta) => {
    // 1. Depth of Field focus logic
    // Focus on the ACTIVE section's content plane, not the section z nearest to
    // the camera. The content always sits ~100 units in front of the camera's
    // settled position (SECTION_Z = CAMERA_Z - 100), so picking "nearest to
    // camera" focused on the *previous* section's plane and left the actual
    // content out of focus — that was the washed-out / blurry section look.
    if (dofRef.current && dofRef.current.target) {
      const cameraZ = state.camera.position.z;
      const focusZ = sectionsZ[cinematicState.activeSection] ?? cameraZ - 100;
      dofRef.current.target.set(0, 0, focusZ);
    }

    // 2. Animate underwater effects based on camera Y
    const y = state.camera.position.y;
    // Normalized plunge progress: 0 at surface (y=3.5), 1 when underwater (y=0 or below)
    const plungeProgress = THREE.MathUtils.clamp((3.5 - y) / 3.5, 0, 1);
    
    if (noiseRef.current && noiseRef.current.blendMode) {
      const targetNoise = plungeProgress * 0.035;
      noiseRef.current.blendMode.opacity.value = THREE.MathUtils.damp(noiseRef.current.blendMode.opacity.value, targetNoise, 4, delta);
    }
    
    if (vignetteRef.current && vignetteRef.current.uniforms) {
      const darknessUniform = vignetteRef.current.uniforms.get('darkness');
      if (darknessUniform) {
        const targetVignette = plungeProgress * 1.1;
        darknessUniform.value = THREE.MathUtils.damp(darknessUniform.value, targetVignette, 4, delta);
      }
    }
  });

  return (
    // multisampling={0}: the default MSAA render target can't blit its
    // depth/stencil when a depth-based effect (DepthOfField) is present, which
    // flooded the console with GL_INVALID_OPERATION every frame and caused
    // render glitches. DoF/Bloom soften edges anyway, so MSAA isn't needed.
    <EffectComposer multisampling={0}>
      <DepthOfField
        ref={dofRef}
        target={new THREE.Vector3(0, 0, 0)}
        focalLength={0.02}
        bokehScale={2}
      />
      <Bloom 
        luminanceThreshold={0.8} 
        luminanceSmoothing={0.5} 
        intensity={1.2} 
        radius={0.8} 
        mipmapBlur 
      />
      <ChromaticAberration 
        offset={new THREE.Vector2(0.001, 0.001)} 
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise ref={noiseRef} opacity={0} />
      <Vignette ref={vignetteRef} eskil={false} offset={0.2} darkness={0} />
    </EffectComposer>
  );
}
