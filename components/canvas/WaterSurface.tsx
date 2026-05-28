import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBO, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  uniform sampler2D uBackground;
  uniform sampler2D uNormalMap;
  uniform float uTime;
  uniform vec3 uSurfaceColor;
  uniform vec3 uDepthColor;
  uniform vec3 uFoamColor;
  uniform vec2 uResolution;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    // Scale normal map UVs to make waves much smaller and visible
    vec2 uv = vUv * 150.0; 
    
    // Animate two normal maps in opposite directions
    vec4 n1 = texture2D(uNormalMap, uv + vec2(0.015, 0.02) * uTime);
    vec4 n2 = texture2D(uNormalMap, uv - vec2(0.02, 0.015) * uTime);
    
    // Blend normals (textures are 0 to 1, we want -1 to 1 for calculation)
    vec3 normal = normalize(vec3(n1.rg + n2.rg - 1.0, 1.0));
    
    // View direction
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    
    // Screen UV for refraction (distortion of what's under the surface)
    vec2 screenUv = gl_FragCoord.xy / uResolution;
    
    // Distort screen UV based on the combined normals
    float distortionStrength = 0.06;
    vec2 refractedUv = screenUv + normal.xy * distortionStrength;
    
    // Sample the background (what's behind the water)
    vec4 bgColor = texture2D(uBackground, refractedUv);
    
    // Fresnel effect
    float fresnel = pow(1.0 - max(dot(vec3(0.0, 1.0, 0.0), viewDir), 0.0), 2.5);
    
    // Mix surface color and depth color based on fresnel
    vec3 waterColor = mix(uDepthColor, uSurfaceColor, fresnel * 0.8);
    
    // Sun specular reflection (very soft, no harsh flash)
    vec3 lightDir = normalize(vec3(0.5, 0.8, 0.2));
    vec3 reflectDir = reflect(-lightDir, vec3(normal.x, 1.0, normal.y));
    float spec = pow(max(dot(reflectDir, viewDir), 0.0), 32.0); // wider, softer spec
    
    // Foam on microwaves (peaks of the normals)
    float foamIntensity = smoothstep(0.7, 1.0, (n1.r + n2.g) * 0.5);
    
    // Combine refraction and water colors
    float opacity = mix(0.3, 0.8, fresnel);
    vec3 finalColor = mix(bgColor.rgb, waterColor, opacity);
    
    // Add Specular highlights - extremely subtle to avoid bloom flash
    finalColor += vec3(0.8, 0.9, 0.8) * spec * 0.1; 
    
    // Add Foam
    finalColor = mix(finalColor, uFoamColor, foamIntensity * 0.08);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, gl, camera, scene } = useThree();

  // Framebuffer for refraction.
  // Rendered at half resolution — the result is read through an animated normal
  // distortion, so the softness is invisible while the pixel/bandwidth cost is
  // quartered. Passing explicit dimensions also makes drei recreate the FBO on
  // resize (the previous no-arg form left it frozen at the initial size).
  const fbo = useFBO(
    Math.max(1, Math.floor(size.width * 0.5)),
    Math.max(1, Math.floor(size.height * 0.5)),
    { stencilBuffer: false, format: THREE.RGBAFormat }
  );

  const normalMap = useTexture('/textures/waternormals.jpg');
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBackground: { value: null },
    uNormalMap: { value: normalMap },
    uSurfaceColor: { value: new THREE.Color('#0d2820') },
    uDepthColor: { value: new THREE.Color('#071118') },
    uFoamColor: { value: new THREE.Color('#F4F0E8') },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  }), [normalMap, size.width, size.height]);

  // Update resolution uniform when screen resizes
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uResolution.value.set(
        size.width * gl.getPixelRatio(),
        size.height * gl.getPixelRatio()
      );
    }
  }, [size.width, size.height, gl]);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;

    // The surface plane sits at z=5. The camera only ever looks toward -z, so
    // once it dives past the surface the water is entirely behind it. Below that
    // point we hide the mesh AND skip the FBO pass — this is what spares the
    // duplicate full-scene render (fauna, particles, caustics) for every deep
    // section, where the surface contributes nothing anyway.
    if (camera.position.z < -10) {
      meshRef.current.visible = false;
      return;
    }

    // 1. Hide the water mesh so it doesn't render into the FBO
    meshRef.current.visible = false;

    // 2. Render the scene (everything behind the water) into the FBO
    gl.setRenderTarget(fbo);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // 3. Make water visible again
    meshRef.current.visible = true;

    // 4. Update uniforms
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uBackground.value = fbo.texture;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 8, 5]}>
      <planeGeometry args={[400, 400, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true} // Allow blending just in case
      />
    </mesh>
  );
}
