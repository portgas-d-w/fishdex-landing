import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollVelocity } from '../useScrollProgress';

// Generate a simple low-poly fish geometry
function createFishGeometry() {
  const geom = new THREE.BufferGeometry();
  
  // A simple 3D diamond/ellipsoid for the body, plus a V tail
  const vertices = new Float32Array([
    // Body (diamond shape)
    // nose
    0, 0, 2,     // 0
    // middle cross section
    0.5, 0, 0,   // 1 (right)
    -0.5, 0, 0,  // 2 (left)
    0, 0.8, 0,   // 3 (top)
    0, -0.6, 0,  // 4 (bottom)
    // tail base
    0, 0, -2,    // 5
    // tail fins
    0, 1, -3,    // 6 (tail top)
    0, -1, -3,   // 7 (tail bottom)
  ]);

  const indices = [
    // Nose to middle
    0, 1, 3,
    0, 3, 2,
    0, 2, 4,
    0, 4, 1,
    // Middle to tail base
    1, 5, 3,
    3, 5, 2,
    2, 5, 4,
    4, 5, 1,
    // Tail fin (flat on X)
    5, 6, 7,
    7, 6, 5 // double sided
  ];

  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

const fishGeometry = createFishGeometry();

interface FishProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  speed: number;
  scale: number;
  opacity: number;
  timeOffset: number;
}

function Fish({ curve, color, speed, scale, opacity, timeOffset }: FishProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollVelocity = useScrollVelocity();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Base time progression
    let t = (state.clock.elapsedTime * speed + timeOffset) % 1;
    
    // Accelerate if scrolling fast
    const vel = Math.abs(scrollVelocity.current);
    const speedMult = 1 + vel * 0.3;
    
    // Note: To properly implement variable speed along a curve without jumping,
    // we would need to integrate speed over time. For simplicity, we just use the raw t
    // and rely on the fact that vel is a continuous derivative, but this is a simplified version.
    // In a perfect system, we'd store local elapsed time per fish.
    
    // Get position on curve
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    
    meshRef.current.position.copy(pos);
    
    // Look along the tangent
    const lookAtPos = pos.clone().add(tangent);
    meshRef.current.lookAt(lookAtPos);
    
    // Body undulation (rotation on Y based on time)
    meshRef.current.rotateY(Math.sin(state.clock.elapsedTime * speed * 20) * 0.2);
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <primitive object={fishGeometry} attach="geometry" />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={opacity} 
        flatShading 
        metalness={0.1} 
        roughness={0.7} 
      />
    </mesh>
  );
}

export default function Fauna() {
  const fishes = useMemo(() => {
    // Generate 5 unique paths
    return Array.from({ length: 5 }).map((_, i) => {
      // Determine if surface or deep fish based on index
      const isSurface = i < 3;
      
      const zCenter = isSurface ? -100 - Math.random() * 100 : -400 - Math.random() * 200;
      const radiusX = 20 + Math.random() * 20;
      const radiusZ = 15 + Math.random() * 15;
      
      // Create a wavy loop path
      const points = [];
      for(let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const x = Math.cos(a) * radiusX + (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = Math.sin(a) * radiusZ + zCenter + (Math.random() - 0.5) * 10;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const curve = new THREE.CatmullRomCurve3(points, true);
      
      return {
        curve,
        color: isSurface ? '#8FBFA3' : '#1a3d30',
        opacity: isSurface ? 0.6 : 0.4,
        speed: isSurface ? 0.015 + Math.random() * 0.01 : 0.005 + Math.random() * 0.005,
        scale: 1.0 + Math.random() * 1.5,
        timeOffset: Math.random()
      };
    });
  }, []);

  return (
    <group>
      {fishes.map((f, i) => (
        <Fish key={i} {...f} />
      ))}
    </group>
  );
}
