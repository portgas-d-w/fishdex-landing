import React from 'react';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      {/* Subtle bloom on light points and caustics */}
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      
      {/* Very subtle chromatic aberration — increases sense of depth */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0006, 0.0006)}
        radialModulation={true}
        modulationOffset={0.2}
      />
      
      {/* Vignette — darkens edges for cinematic framing */}
      <Vignette
        eskil={false}
        offset={0.15}
        darkness={0.8}
      />
    </EffectComposer>
  );
}
