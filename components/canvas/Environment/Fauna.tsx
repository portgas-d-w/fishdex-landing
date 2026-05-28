import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Clone } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollVelocity } from '../useScrollProgress';

// Preload models (adjust paths carefully due to spaces in folder name)
const MODEL_CARP = '/image 3d/carp_fish.glb';
const MODEL_AYU = '/image 3d/cc0____ayu_sweetfish.glb';
const MODEL_BREAM = '/image 3d/lahna_-_braxen_-_bream.glb';

useGLTF.preload(MODEL_CARP);
useGLTF.preload(MODEL_AYU);
useGLTF.preload(MODEL_BREAM);

interface FishProps {
  curve: THREE.CatmullRomCurve3;
  modelUrl: string;
  speed: number;
  scale: number;
  timeOffset: number;
}

function GltfFish({ curve, modelUrl, speed, scale, timeOffset }: FishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollVelocity = useScrollVelocity();
  
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    // Play the first animation found (usually the swim cycle)
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      actions[actionNames[0]]?.play();
    }
  }, [actions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    let t = (state.clock.elapsedTime * speed + timeOffset) % 1;
    
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    
    groupRef.current.position.copy(pos);
    
    const lookAtPos = pos.clone().add(tangent);
    groupRef.current.lookAt(lookAtPos);
    
    // Adjust swim animation speed based on scroll
    const vel = Math.abs(scrollVelocity.current);
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]!.timeScale = 1 + vel * 0.2;
    }
  });

  // Most GLTF models need a rotation fix if they aren't facing +Z natively
  // We wrap Clone in a group so we can easily tweak orientation if needed later
  return (
    <group ref={groupRef} scale={scale}>
      {/* Rotation Y by PI to flip it if it swims backwards. You might need to adjust this depending on the model's export axis. */}
      <group rotation={[0, Math.PI, 0]}>
        <Clone object={scene} />
      </group>
    </group>
  );
}

function FaunaGroup() {
  const fishes = useMemo(() => {
    const models = [MODEL_CARP, MODEL_AYU, MODEL_BREAM, MODEL_CARP, MODEL_BREAM];
    
    return models.map((modelUrl, i) => {
      const isSurface = i < 3;
      
      // Push fish far on the Z-axis
      const zCenter = isSurface ? -350 - Math.random() * 150 : -600 - Math.random() * 300;
      
      // Force fish to swim only on the edges (left/right or top/bottom)
      // They will center around x = ±40 or y = ±25
      const isSide = Math.random() > 0.5;
      const xCenter = isSide ? (Math.random() > 0.5 ? 1 : -1) * (35 + Math.random() * 15) : (Math.random() - 0.5) * 20;
      // Camera underwater is at Y = -1. Keep them away from Y = -1.
      const yCenter = isSide ? -10 + (Math.random() - 0.5) * 10 : (Math.random() > 0.5 ? 15 : -20) - Math.random() * 10;
      
      const radiusX = 10 + Math.random() * 10;
      const radiusZ = 15 + Math.random() * 15;
      
      const points = [];
      for(let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const x = xCenter + Math.cos(a) * radiusX + (Math.random() - 0.5) * 5;
        const y = yCenter + (Math.random() - 0.5) * 5; 
        const z = zCenter + Math.sin(a) * radiusZ + (Math.random() - 0.5) * 10;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const curve = new THREE.CatmullRomCurve3(points, true);
      
      return {
        curve,
        modelUrl,
        speed: isSurface ? 0.015 + Math.random() * 0.01 : 0.005 + Math.random() * 0.005,
        scale: 4.0 + Math.random() * 2.0, // Scale adjusted for GLTF
        timeOffset: Math.random()
      };
    });
  }, []);

  return (
    <group>
      {fishes.map((f, i) => (
        <GltfFish key={i} {...f} />
      ))}
    </group>
  );
}

export default function Fauna() {
  return (
    <Suspense fallback={null}>
      <FaunaGroup />
    </Suspense>
  );
}
