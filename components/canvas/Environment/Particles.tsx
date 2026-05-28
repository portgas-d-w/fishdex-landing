import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollVelocity } from '../useScrollProgress';

const DUST_COUNT = 2500;
const BUBBLE_COUNT = 100;

export default function Particles() {
  const dustRef = useRef<THREE.InstancedMesh>(null);
  const bubbleRef = useRef<THREE.InstancedMesh>(null);
  const scrollVelocity = useScrollVelocity();

  // Pre-calculate initial positions and data for dust
  const dustData = useMemo(() => {
    const data = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      // Z: 0 to -800, denser near surface. We use a power curve for distribution
      const zFactor = Math.pow(Math.random(), 1.5);
      const z = -zFactor * 800;
      
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      
      // Color selection
      const isGreen = Math.random() > 0.7;
      const color = new THREE.Color(isGreen ? '#8FBFA3' : '#F4F0E8');
      
      // Opacity via alpha (we can't easily do per-instance opacity in standard InstancedMesh without custom shaders, 
      // but we can bake it into color slightly or just rely on a low base opacity for the material)
      
      // Size: 0.8 to 1.5
      const scale = 0.8 + Math.random() * 0.7;
      
      // Brownian motion parameters
      const speedX = (Math.random() - 0.5) * 0.05;
      const speedY = (Math.random() - 0.5) * 0.05;
      const speedZ = (Math.random() - 0.5) * 0.05;
      
      data.push({ x, y, z, scale, color, speedX, speedY, speedZ });
    }
    return data;
  }, []);

  // Pre-calculate initial positions for bubbles
  const bubbleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const z = -Math.random() * 800;
      const x = (Math.random() - 0.5) * 40;
      
      // Bubbles rise on Y axis
      const y = (Math.random() - 0.5) * 60;
      
      const scale = 0.5 + Math.random() * 2.5;
      const speed = 0.5 + Math.random() * 1.5;
      const wobbleSpeed = 1 + Math.random() * 2;
      const wobbleAmp = 0.5 + Math.random() * 1.5;
      
      data.push({ x, y, z, scale, speed, wobbleSpeed, wobbleAmp, initialX: x });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize instance properties
  useEffect(() => {
    if (!dustRef.current) return;
    
    dustData.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.set(d.scale, d.scale, d.scale);
      dummy.updateMatrix();
      dustRef.current!.setMatrixAt(i, dummy.matrix);
      dustRef.current!.setColorAt(i, d.color);
    });
    dustRef.current.instanceMatrix.needsUpdate = true;
    if (dustRef.current.instanceColor) dustRef.current.instanceColor.needsUpdate = true;

    if (!bubbleRef.current) return;
    bubbleData.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.set(d.scale, d.scale, d.scale);
      dummy.updateMatrix();
      bubbleRef.current!.setMatrixAt(i, dummy.matrix);
    });
    bubbleRef.current.instanceMatrix.needsUpdate = true;
  }, [dustData, bubbleData, dummy]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const vel = Math.abs(scrollVelocity.current);

    if (dustRef.current) {
      dustData.forEach((d, i) => {
        // Brownian motion
        d.x += Math.sin(time * d.speedX) * 0.01;
        d.y += Math.cos(time * d.speedY) * 0.01;
        d.z += Math.sin(time * d.speedZ) * 0.01;
        
        // Slightly react to scroll
        d.y += scrollVelocity.current * 0.05;

        dummy.position.set(d.x, d.y, d.z);
        dummy.scale.setScalar(d.scale);
        dummy.updateMatrix();
        dustRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dustRef.current.instanceMatrix.needsUpdate = true;
    }

    if (bubbleRef.current) {
      bubbleData.forEach((d, i) => {
        // Rise upward
        const baseRise = d.speed * 0.05;
        // Scroll velocity pushes bubbles up faster
        const scrollPush = vel * 0.2;
        d.y += baseRise + scrollPush;

        // Reset if too high
        if (d.y > 30) {
          d.y = -30;
          d.x = d.initialX; // Reset X to avoid extreme drifting
        }

        // Wobble horizontally
        d.x = d.initialX + Math.sin(time * d.wobbleSpeed + i) * d.wobbleAmp;

        dummy.position.set(d.x, d.y, d.z);
        dummy.scale.setScalar(d.scale);
        dummy.updateMatrix();
        bubbleRef.current!.setMatrixAt(i, dummy.matrix);
      });
      bubbleRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Dust / Plankton */}
      <instancedMesh ref={dustRef} args={[undefined, undefined, DUST_COUNT]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.05} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Bubbles */}
      <instancedMesh ref={bubbleRef} args={[undefined, undefined, BUBBLE_COUNT]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhysicalMaterial 
          transparent
          opacity={0.12}
          transmission={0.9}
          roughness={0}
          ior={1.1}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#ffffff"
        />
      </instancedMesh>
    </group>
  );
}
