import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cinematicState } from '../useScrollProgress';

// Float Geometry (Cylinder with a ball on top and a stick below)
function createFloatGeometry() {
  const geom = new THREE.BufferGeometry();
  // We'll use multiple simple meshes in a group instead of a complex merged geometry for ease
  return geom;
}

export default function FishingFloat() {
  const groupRef = useRef<THREE.Group>(null);
  const splashRef = useRef<THREE.Mesh>(null);
  const splashMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const splashShader = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color('#ffffff') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      uniform vec3 uColor;
      varying vec2 vUv;
      
      void main() {
        vec2 center = vec2(0.5);
        float dist = distance(vUv, center) * 2.0; // 0 at center, 1 at edge
        
        // No splash initially
        if (uProgress <= 0.0) discard;
        
        // 3 concentric rings expanding
        float ring1 = smoothstep(uProgress - 0.1, uProgress, dist) * smoothstep(uProgress + 0.1, uProgress, dist);
        float ring2 = smoothstep(uProgress - 0.25, uProgress - 0.15, dist) * smoothstep(uProgress - 0.05, uProgress - 0.15, dist);
        
        float rings = ring1 + ring2 * 0.5;
        
        // Fade out over time
        float alpha = rings * (1.0 - uProgress);
        
        if (alpha <= 0.01) discard;
        
        gl_FragColor = vec4(uColor, alpha * 0.6);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const { phase, biteProgress } = cinematicState;
    
    let yPos = 0;
    
    if (phase === 'SURFACE') {
      // Idle bobbing
      yPos = Math.sin(time * 3) * 0.05;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      groupRef.current.rotation.z = Math.sin(time * 2) * 0.05;
    } 
    else if (phase === 'BITING' || phase === 'DIVING') {
      // Bite animation (1800ms total = 0.0 to 1.0)
      // 0 to 0.055 (0-100ms): Tension drop (-0.15)
      // 0.055 to 0.138 (100-250ms): Violent plunge
      
      if (biteProgress < 0.055) {
        // Tension
        const t = biteProgress / 0.055;
        yPos = -0.15 * Math.sin(t * Math.PI / 2);
      } else if (biteProgress < 0.138) {
        // Violent plunge
        const t = (biteProgress - 0.055) / (0.138 - 0.055); // 0 to 1
        // Pure acceleration
        const ease = t * t * t;
        yPos = -0.15 - ease * 10.0;
      } else {
        yPos = -10.15;
      }
      
      // Splash rings
      if (splashMaterialRef.current) {
        // Splash triggers after 250ms (biteProgress > 0.138)
        if (biteProgress > 0.138) {
          const splashP = (biteProgress - 0.138) / (1.0 - 0.138);
          splashMaterialRef.current.uniforms.uProgress.value = splashP;
        } else {
          splashMaterialRef.current.uniforms.uProgress.value = 0;
        }
      }
    }
    
    groupRef.current.position.y = yPos;
  });

  return (
    <group position={[0, 0, -5]}>
      {/* The Float */}
      <group ref={groupRef}>
        {/* Top Antenna */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        
        {/* Main Body Top (Red) */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.3]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        
        {/* Main Body Bottom (White) */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.05, 0.3]} />
          <meshStandardMaterial color="#fdfdfd" />
        </mesh>
        
        {/* Bottom Antenna */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* Splash Plane on the water surface */}
      <mesh ref={splashRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <primitive object={splashShader} attach="material" ref={splashMaterialRef} />
      </mesh>
    </group>
  );
}
