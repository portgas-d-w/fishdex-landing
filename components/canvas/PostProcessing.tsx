import React from 'react';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    // Simulate murky underwater visibility, soft glow, cinematic noise and dark edges
    <EffectComposer enableNormalPass={false} multisampling={4}>
      <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={2} height={480} />
      <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} opacity={1.5} />
      <Noise opacity={0.03} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
