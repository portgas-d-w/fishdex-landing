import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Un shader très simple pour plier le poisson (animation de nage)
const fishVertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSpeed;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Animation de nage (ondulation sur l'axe Z basé sur X)
    float wave = sin(pos.x * 5.0 - uTime * uSpeed) * 0.1;
    // La tête (x > 0) bouge moins que la queue (x < 0)
    float falloff = smoothstep(0.5, -0.5, pos.x);
    pos.z += wave * falloff;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fishFragmentShader = `
  varying vec2 vUv;
  
  void main() {
    // Dégradé simple pour le corps
    vec3 color = mix(vec3(0.1, 0.3, 0.4), vec3(0.6, 0.8, 0.8), vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Fauna({ count = 50 }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Geometry stylisée pour un poisson (un cone étiré)
  const fishGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.2, 1, 16);
    geo.rotateZ(-Math.PI / 2); // Orienter vers l'avant (X)
    return geo;
  }, []);

  const fishMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: fishVertexShader,
      fragmentShader: fishFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 5.0 }
      }
    });
  }, []);

  const fishes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 80, // X: largeur
        Math.random() * -250, // Y: profondeur (vers le bas)
        (Math.random() - 0.5) * 80 // Z: hauteur relative par rapport à la caméra pointant vers le bas
      ],
      rotation: [0, Math.random() * Math.PI * 2, 0],
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.02 + Math.random() * 0.03,
      timeOffset: Math.random() * 100
    }));
  }, [count]);

  useFrame((state) => {
    fishMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((fish, i) => {
        const data = fishes[i];
        // Avancer dans la direction où il regarde
        fish.translateX(data.speed);
        
        // Mouvement circulaire très lent
        fish.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1);
        
        // Si le poisson s'éloigne trop, le ramener de l'autre côté
        if (fish.position.x > 40) fish.position.x = -40;
        if (fish.position.x < -40) fish.position.x = 40;
        if (fish.position.z > 40) fish.position.z = -40;
        if (fish.position.z < -40) fish.position.z = 40;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {fishes.map((fish, i) => (
        <mesh 
          key={i}
          geometry={fishGeometry}
          material={fishMaterial}
          position={new THREE.Vector3(...fish.position)}
          rotation={new THREE.Euler(...fish.rotation)}
          scale={fish.scale}
        />
      ))}
    </group>
  );
}
