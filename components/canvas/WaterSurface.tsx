import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend, ThreeElement } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Water } from 'three-stdlib';

extend({ Water });

declare module '@react-three/fiber' {
  interface ThreeElements {
    water: ThreeElement<typeof Water>;
  }
}

export default function WaterSurface() {
  const ref = useRef<Water>(null);
  const { camera } = useThree();
  const gl = useThree((state) => state.gl);
  
  const normalMap = useTexture('/textures/waternormals.jpg');
  
  useEffect(() => {
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  }, [normalMap]);

  const waterGeometry = useMemo(() => new THREE.PlaneGeometry(1000, 1000), []);
  
  const waterOptions = useMemo(() => {
    return {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: normalMap,
      sunDirection: new THREE.Vector3(-30, 2, -100).normalize(), // Match scene light
      sunColor: 0xFFAA55, // Match scene light
      waterColor: 0x071512, // Dark deep water color
      distortionScale: 3.7,
      fog: true,
    };
  }, [normalMap]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta * 0.2;
      
      // Hide water once the camera has plunged below the surface
      ref.current.visible = camera.position.y > -1;
    }
  });

  return (
    <water
      ref={ref}
      args={[waterGeometry, waterOptions]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 5]}
    />
  );
}
