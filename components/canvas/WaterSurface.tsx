import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Un shader simple pour simuler la surface de l'eau vue de dessous
const waterVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Vagues douces
    pos.z += sin(pos.x * 2.0 + uTime) * 0.2;
    pos.z += cos(pos.y * 1.5 + uTime * 0.8) * 0.2;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waterFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  
  void main() {
    // Effet caustique / reflet basique
    float strength = sin(vPosition.x * 5.0 + uTime) * sin(vPosition.y * 5.0 + uTime);
    strength = smoothstep(0.0, 1.0, strength);
    
    vec3 waterColor = vec3(0.28, 0.65, 0.65); // Turquoise / #48a6a6
    vec3 highlightColor = vec3(0.8, 0.9, 0.9);
    
    vec3 finalColor = mix(waterColor, highlightColor, strength * 0.3);
    
    // Opacité pour laisser passer la lumière
    gl_FragColor = vec4(finalColor, 0.6);
  }
`;

export default function WaterSurface(props: any) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    // On place le plan à y=0 (la surface)
    // Rotation pour qu'il soit horizontal (XZ)
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
