import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from './useScrollProgress';

const GodRaysMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uColor: { value: new THREE.Color('#C9A96E') },
    uColorDeep: { value: new THREE.Color('#ffffff') }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform vec3 uColor;
    uniform vec3 uColorDeep;
    
    varying vec2 vUv;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Base coordinates
      vec2 uv = vUv;
      
      // Undulation (slow, irregular)
      float t = uTime * 0.1;
      float noiseValue = snoise(vec2(uv.x * 3.0, t));
      
      // Generate vertical bands (rays)
      // Perturb the x coordinate slightly with noise
      float xPerturbed = uv.x + noiseValue * 0.05;
      
      // Create distinct bands
      float rays = 0.0;
      rays += sin(xPerturbed * 30.0) * 0.5 + 0.5;
      rays += sin(xPerturbed * 15.0 - t * 2.0) * 0.5 + 0.5;
      rays += sin(xPerturbed * 45.0 + t) * 0.5 + 0.5;
      rays /= 3.0; // Normalize
      
      // Contrast and shape the rays
      rays = smoothstep(0.4, 0.9, rays);
      
      // Fade edges (top, bottom, left, right)
      float edgeFade = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.6, uv.y) * 
                       smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
                       
      // Depth fade based on scroll progress
      // As uScrollProgress goes 0 -> 1, rays fade out (we're going deeper)
      float scrollFade = smoothstep(0.6, 0.2, uScrollProgress);
      
      // Blend colors based on scroll
      vec3 finalColor = mix(uColor, uColorDeep, uScrollProgress);
      
      // Opacity multiplier: max 0.12 at surface, drops as we go deep
      float baseOpacity = mix(0.12, 0.06, uScrollProgress);
      
      float finalAlpha = rays * edgeFade * scrollFade * baseOpacity;
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide
});

export default function GodRays() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(GodRaysMaterial.clone());
  const scrollProgress = useScrollProgress();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress.current;
    }
    
    if (meshRef.current) {
      // Slight upward movement as we scroll down to simulate moving away from surface
      meshRef.current.position.y = 10 + scrollProgress.current * 20;
    }
  });

  return (
    // Tilt the plane slightly to simulate 10-15 degree angle rays from above
    <mesh 
      ref={meshRef} 
      position={[0, 10, -50]} 
      rotation={[-Math.PI / 2 + 0.2, 0, 0]}
    >
      <planeGeometry args={[80, 80, 16, 16]} />
      <primitive object={materialRef.current} attach="material" />
    </mesh>
  );
}
