import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function UnderwaterBackground() {
  const texture = useTexture('/images/new/section-2.png');
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;

    // Follow the camera on X and Z, but place it far in the background
    meshRef.current.position.copy(state.camera.position);
    meshRef.current.translateZ(-250);
    
    // The image has godrays coming from the top. We offset it upwards slightly.
    meshRef.current.position.y += 30;

    // Calculate opacity based on camera plunge and depth
    const y = state.camera.position.y;
    // 0 at surface (y=3.5), 1 when underwater (y=-1)
    const plungeProgress = THREE.MathUtils.clamp((3.5 - y) / 4.5, 0, 1);
    
    // 0 at Section 2 (z=-50), 1 at Section 4 (z=-300)
    const z = state.camera.position.z;
    const deepProgress = THREE.MathUtils.clamp((-50 - z) / 250, 0, 1);
    
    // Smooth blending : visible only underwater, and fades to black when going deep
    matRef.current.opacity = plungeProgress * (1 - Math.pow(deepProgress, 2));
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      {/* 16:9 plane to match typical screen ratio and image ratio */}
      <planeGeometry args={[800, 450]} />
      <meshBasicMaterial 
        ref={matRef} 
        map={texture} 
        transparent={true} 
        opacity={0} 
        depthWrite={false} 
        depthTest={false}
        fog={false} 
        toneMapped={false}
      />
    </mesh>
  );
}
