import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const MIST_COUNT = 40;

export default function SurfaceMist() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mistTexture = useTexture('/assets/lake-realism/mist-sprite.png');

  // Configuration des particules de brume
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < MIST_COUNT; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 150, // Large zone X
          Math.random() * 2 + 0.5,     // Juste au-dessus de l'eau (Y)
          (Math.random() - 0.5) * 100 - 50 // Principalement au loin (Z)
        ),
        speed: Math.random() * 0.5 + 0.2,
        scale: Math.random() * 20 + 20, // Très grands sprites doux
        opacityBase: Math.random() * 0.15 + 0.05 // Opacité très faible pour le réalisme
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      // Dérive lente vers la droite
      p.position.x += p.speed * delta;
      
      // Boucle infinie
      if (p.position.x > 75) p.position.x = -75;

      // Légère oscillation verticale
      const yOscillation = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.5;

      dummy.position.copy(p.position);
      dummy.position.y += yOscillation;
      
      // Les sprites doivent toujours faire face à la caméra
      dummy.rotation.y = Math.atan2(
        state.camera.position.x - dummy.position.x,
        state.camera.position.z - dummy.position.z
      );

      dummy.scale.set(p.scale, p.scale, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Pulsation douce de l'opacité
      const currentOpacity = p.opacityBase * (0.8 + 0.2 * Math.sin(state.clock.elapsedTime * 0.3 + i));
      meshRef.current!.setColorAt(i, new THREE.Color(currentOpacity, currentOpacity, currentOpacity));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor!.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MIST_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={mistTexture}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={1} // L'opacité est gérée via les vertex colors ci-dessus
      />
    </instancedMesh>
  );
}
