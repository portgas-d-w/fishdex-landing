import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { SURFACE_CROSSING_PROGRESS } from './diveConfig';
import { diveState } from './useScrollProgress';

export default function WaterSurface() {
  const waterRef = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  
  // Textures locales générées/téléchargées
  const normalMap = useTexture('/assets/lake-realism/water-normal.jpg');
  const lakeBedTex = useTexture('/assets/lake-realism/lake-bed.png');

  const ripple = useRef({ uTime: { value: 0 }, uRipple: { value: 0 } });

  useMemo(() => {
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(30, 30);
    
    lakeBedTex.wrapS = lakeBedTex.wrapT = THREE.RepeatWrapping;
    lakeBedTex.repeat.set(10, 5);
  }, [normalMap, lakeBedTex]);

  const onBeforeCompile = useCallback((shader: any) => {
    shader.uniforms.uTime = ripple.current.uTime;
    shader.uniforms.uRipple = ripple.current.uRipple;
    
    // VERTEX SHADER : Houle et rings
    shader.vertexShader = 'uniform float uTime;\nuniform float uRipple;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [
        '#include <begin_vertex>',
        'float swell = sin(position.x * 0.18 + uTime * 1.1) * 0.16 + sin(position.y * 0.27 + uTime * 0.8) * 0.12;',
        'float rings = sin(length(position.xy) * 0.5 - uTime * 5.0) * uRipple * 0.7;',
        'transformed.z += swell * (0.35 + uRipple * 1.5) + rings;',
      ].join('\n')
    );

    // FRAGMENT SHADER : Dual Normal Maps chaotiques à partir d'une seule texture
    shader.fragmentShader = 'uniform float uTime;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      [
        '#ifdef USE_NORMALMAP',
        '  // Couche A',
        '  vec2 uvA = vNormalMapUv + vec2(uTime * 0.015, uTime * 0.01);',
        '  vec4 normalA = texture2D(normalMap, uvA);',
        '  // Couche B (Échelle différente, mouvement opposé)',
        '  vec2 uvB = vNormalMapUv * 1.5 + vec2(-uTime * 0.01, uTime * 0.012);',
        '  vec4 normalB = texture2D(normalMap, uvB);',
        '  // Mélange physique pour casser la répétition',
        '  vec3 mapN = mix(normalA.xyz, normalB.xyz, 0.5) * 2.0 - 1.0;',
        '  mapN.xy *= normalScale;',
        '  normal = normalize(tbn * mapN);',
        '#endif'
      ].join('\n')
    );
  }, []);

  useFrame((state, delta) => {
    if (!waterRef.current) return;
    ripple.current.uTime.value += delta;

    const p = diveState.progress;
    const win = 0.05;
    const pulse = THREE.MathUtils.clamp(1 - Math.abs(p - SURFACE_CROSSING_PROGRESS) / win, 0, 1);
    ripple.current.uRipple.value = pulse * pulse;

    waterRef.current.visible = camera.position.y > -1;
  });

  return (
    <group>
      {/* 1. La Surface Optique Photoréaliste */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 5]}>
        <planeGeometry args={[1000, 1000, 48, 48]} />
        <meshPhysicalMaterial
          color="#1e3a45"           // Teinte de base (lac alpin)
          metalness={0.1}           // Légèrement métallique pour mieux capter l'IBL
          roughness={0.08}          // Très lisse (calme) mais pas miroir parfait
          envMapIntensity={2.5}     // Capte intensément le ciel procédural
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          transmission={0.9}        // Presque totalement transparent au bord
          ior={1.33}                // Indice optique de l'eau
          thickness={15}            // Profondeur volumétrique simulée
          attenuationColor={new THREE.Color("#051e24")} // L'eau devient bleu très sombre au large
          attenuationDistance={12}  // La distance avant que la lumière ne soit absorbée
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>

      {/* 2. Le Fond Marin (Shoreline) pour la réfraction de rive */}
      {/* Posé légèrement sous l'eau. Sera vu par transparence près de la caméra, 
          puis englouti par l'attenuationColor au large ! */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 20]}>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial 
          map={lakeBedTex} 
          roughness={0.8} 
          color="#8ca5b5" // Teinte légèrement dé-saturée pour simuler l'atmosphère sous l'eau
        />
      </mesh>
    </group>
  );
}
