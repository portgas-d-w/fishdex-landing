import React from 'react';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      {/* Simulate murky underwater visibility */}
      <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={2} height={480} />
      
      {/* Soft glow for light rays and highlights */}
      <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} opacity={1.5} />
      
      {/* Cinematic noise */}
      <Noise opacity={0.03} />
      
      {/* Dark edges for depth immersion */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
