import React from 'react';
import CameraRig from './CameraRig';
import WaterSurface from './WaterSurface';
import PostProcessing from './PostProcessing';
import EnvironmentParticles from './Environment/Particles';
import Fauna from './Environment/Fauna';
import Caustics from './Environment/Caustics';
import * as THREE from 'three';
import GodRays from './GodRays';

export default function Scene() {
  return (
    <>
      {/* Camera Rig — piloted by scroll */}
      <CameraRig />

      {/* Fog — exponential, grows denser as camera goes deeper */}
      <fogExp2 attach="fog" color="#040a0d" density={0.004} />

      {/* Lighting — soft, diffused, no hard shadows */}
      {/* Ambient — deep underwater tint */}
      <ambientLight intensity={0.15} color="#1a3d4d" />
      
      {/* Sun — positioned at the surface (z=0), warm golden light */}
      <directionalLight
        position={[5, 10, 10]}
        intensity={1.8}
        color="#ffe8b0"
      />
      
      {/* Fill light — subtle blue from below */}
      <pointLight
        position={[0, -5, -200]}
        intensity={0.4}
        color="#0a3050"
        distance={500}
        decay={2}
      />

      {/* 3D Elements */}
      <GodRays />
      <WaterSurface />
      <Caustics />
      <EnvironmentParticles />
      <Fauna />

      {/* Post-processing — Bloom + Chromatic Aberration */}
      <PostProcessing />
    </>
  );
}
