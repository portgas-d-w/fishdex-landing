import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { SURFACE_CROSSING_PROGRESS } from './diveConfig';
import { diveState } from './useScrollProgress';

/**
 * Surface du lac — MeshStandardMaterial qui réfléchit l'HDRI (via <Environment>
 * dans Scene.tsx, posé sur scene.environment). Normal map animée pour le flux,
 * + un shader de Ripple injecté par onBeforeCompile qui se déclenche au passage
 * de la surface (déplacement vertical des sommets en anneaux concentriques).
 *
 * Remplace l'ancien three-stdlib `Water` (qui faisait une passe de réflexion
 * planaire par frame) → meilleures perfs : ici la réflexion vient de l'IBL.
 */
export default function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const normalMap = useTexture('/assets/ultimate/water-normal.png');

  // Uniforms persistants partagés avec le shader injecté.
  const ripple = useRef({ uTime: { value: 0 }, uRipple: { value: 0 } });

  useMemo(() => {
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(40, 40); // TUNE — finesse des rides
  }, [normalMap]);

  // Injection du ripple dans le vertex shader du MeshStandardMaterial.
  const onBeforeCompile = useCallback((shader: any) => {
    shader.uniforms.uTime = ripple.current.uTime;
    shader.uniforms.uRipple = ripple.current.uRipple;
    shader.vertexShader = 'uniform float uTime;\nuniform float uRipple;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [
        '#include <begin_vertex>',
        // Houle de fond (toujours présente, très douce)
        'float swell = sin(position.x * 0.18 + uTime * 1.1) * 0.16',
        '           + sin(position.y * 0.27 + uTime * 0.8) * 0.12;',
        // Anneaux de ripple déclenchés au franchissement (uRipple : 0 → 1)
        'float rings = sin(length(position.xy) * 0.5 - uTime * 5.0) * uRipple * 0.7;',
        'transformed.z += swell * (0.35 + uRipple * 1.5) + rings;',
      ].join('\n')
    );
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    ripple.current.uTime.value += delta;

    // Flux de la normal map (eau qui coule)
    normalMap.offset.x += delta * 0.015;
    normalMap.offset.y += delta * 0.01;

    // Pic de ripple autour du franchissement de la surface
    const p = diveState.progress;
    const win = 0.05;
    const pulse = THREE.MathUtils.clamp(1 - Math.abs(p - SURFACE_CROSSING_PROGRESS) / win, 0, 1);
    ripple.current.uRipple.value = pulse * pulse;

    // Masquer la surface une fois la caméra immergée
    mesh.visible = camera.position.y > -1;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 5]}>
      <planeGeometry args={[1000, 1000, 48, 48]} />
      <meshStandardMaterial
        color="#0e2a30"
        metalness={0.2}
        roughness={0.12}
        envMapIntensity={1.6}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.9, 0.9)}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}
