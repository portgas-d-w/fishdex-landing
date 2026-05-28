import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cinematicState, useScrollProgress } from '../useScrollProgress';

export default function FishingLine() {
  const lineRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const scrollProgress = useScrollProgress();

  useFrame((state) => {
    if (!lineRef.current || !materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    const { phase, biteProgress } = cinematicState;
    
    // The line starts at the float and goes up.
    // Float X=0, Z=-5
    // Top of float is approx Y=0.9
    let yBase = 0.9;
    
    if (phase === 'SURFACE') {
      yBase += Math.sin(time * 3) * 0.05; // Follow float bobbing
    } else if (phase === 'BITING' || phase === 'DIVING') {
      if (biteProgress < 0.133) {
        const t = biteProgress / 0.133;
        yBase += -0.2 * Math.sin(t * Math.PI / 2);
      } else if (biteProgress < 0.333) {
        const t = (biteProgress - 0.133) / 0.2;
        const ease = t * t * t;
        yBase += -0.2 - ease * 8.0;
      } else {
        yBase += -8.2;
      }
    }
    
    // We position the center of the cylinder halfway between yBase and Y=50
    const topY = 50;
    const length = topY - yBase;
    
    lineRef.current.position.y = yBase + length / 2;
    lineRef.current.scale.y = length;
    
    // Fade out as we dive deeper (scrollProgress > 0.1)
    if (phase === 'DIVING') {
      const fade = 1.0 - THREE.MathUtils.smoothstep(scrollProgress.current, 0.1, 0.3);
      materialRef.current.opacity = fade * 0.3; // base opacity is 0.3
    } else {
      materialRef.current.opacity = 0.3;
    }
  });

  return (
    <mesh ref={lineRef} position={[0, 0, -5]}>
      {/* 1 unit long cylinder, scaled dynamically */}
      <cylinderGeometry args={[0.005, 0.005, 1, 4]} />
      <meshBasicMaterial 
        ref={materialRef} 
        color="#ffffff" 
        transparent 
        opacity={0.3} 
        depthWrite={false} 
      />
    </mesh>
  );
}
