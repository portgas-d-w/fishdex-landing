import React from 'react';
import CameraRig from './CameraRig';
import WaterSurface from './WaterSurface';
import PostProcessing from './PostProcessing';
import EnvironmentParticles from './Environment/Particles';
import Fauna from './Environment/Fauna';

export default function Scene() {
  return (
    <>
      {/* Fog to simulate depth - color will be animated based on depth */}
      <fog attach="fog" args={['#031c36', 5, 40]} />

      {/* Global Lighting */}
      <ambientLight intensity={0.4} color="#48a6a6" />
      <directionalLight 
        position={[0, 10, -10]} 
        intensity={1.5} 
        color="#ffffff" 
        castShadow 
      />

      <CameraRig />
      
      {/* 3D Elements */}
      <WaterSurface position={[0, 0, 0]} />
      <EnvironmentParticles />
      <Fauna count={50} />

      {/* Post Processing Effects */}
      <PostProcessing />
    </>
  );
}
