import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Vegetation() {
  const groupRef = useRef<THREE.Group>(null);
  
  // We procedurally generate a simple texture that looks like blurry dark reeds/grass.
  // In a real project you'd load a PNG with an alpha channel.
  const reedTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Transparent background
    ctx.clearRect(0, 0, 256, 512);
    
    // Draw some thick dark green/brown lines (reeds)
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const xStart = Math.random() * 256;
      const xEnd = xStart + (Math.random() - 0.5) * 40;
      ctx.moveTo(xStart, 512);
      ctx.quadraticCurveTo(xStart, 256, xEnd, Math.random() * 200);
      
      ctx.lineWidth = 4 + Math.random() * 8;
      ctx.strokeStyle = `rgba(${10 + Math.random() * 20}, ${20 + Math.random() * 20}, ${10 + Math.random() * 10}, ${0.8 + Math.random() * 0.2})`;
      ctx.stroke();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Only visible when above water (camera Y > 0)
    // We fade it out quickly as we plunge
    const y = state.camera.position.y;
    const isVisible = y > -0.5;
    groupRef.current.visible = isVisible;
    
    if (isVisible) {
      // Wind sway effect
      const t = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 0.5 + i) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left side reeds - positioned close to camera for strong bokeh effect */}
      <mesh position={[-6, 2, 95]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial 
          map={reedTexture} 
          transparent={true} 
          opacity={0.9} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[-8, 1, 92]} rotation={[0, 0.2, 0]}>
        <planeGeometry args={[10, 15]} />
        <meshBasicMaterial 
          map={reedTexture} 
          transparent={true} 
          opacity={0.6} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right side reeds */}
      <mesh position={[6, 2, 95]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial 
          map={reedTexture} 
          transparent={true} 
          opacity={0.9} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[9, 1, 91]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[12, 16]} />
        <meshBasicMaterial 
          map={reedTexture} 
          transparent={true} 
          opacity={0.6} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
