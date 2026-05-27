import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Create random positions, speeds, and scales for particles (bubbles/plankton)
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      // Particles distributed deep into the Y-axis
      const y = Math.random() * -250;
      const z = (Math.random() - 0.5) * 40;
      
      const speed = 0.1 + Math.random() * 0.5;
      const scale = 0.02 + Math.random() * 0.05;
      
      temp.push({ x, y, z, speed, scale, initialY: y });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      // Move particles upwards (bubbles) or slowly drifting
      particle.y += particle.speed * delta;
      
      // Reset position if it goes too high above surface
      if (particle.y > 2) {
        particle.y = -250 + Math.random() * 20;
      }
      
      // Add some subtle X/Z drift
      const time = state.clock.elapsedTime;
      const driftX = Math.sin(time * particle.speed + i) * 0.01;
      const driftZ = Math.cos(time * particle.speed + i) * 0.01;
      
      particle.x += driftX;
      particle.z += driftZ;

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
}
