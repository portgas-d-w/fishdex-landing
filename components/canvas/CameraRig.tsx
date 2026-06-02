import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diveState } from './useScrollProgress';
import { cameraPosAt, cameraLookAt } from './diveConfig';

export default function CameraRig() {
  const smoothVel = useRef(0);
  const tmpLook = useRef(new THREE.Vector3());
  const lookCurrent = useRef(new THREE.Vector3(0, 0, -1));

  useFrame((state, delta) => {
    const { progress, velocity } = diveState;
    smoothVel.current = THREE.MathUtils.damp(smoothVel.current, velocity, 3, delta);

    const camera = state.camera;

    // 1) Position cible sur la courbe (le scrub lisse déjà le progress).
    const target = cameraPosAt(progress);
    // Léger damping résiduel pour absorber les micro-saccades de scroll.
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, 8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, 8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, 9, delta);

    // 2) Orientation : viser le point d’anticipation (pas de parallaxe souris —
    //    effet retiré : indésirable sur desktop et inexistant au tactile/mobile).
    const look = cameraLookAt(progress);
    tmpLook.current.set(look.x, look.y, look.z);

    // Inertie de tangage selon la vélocité de scroll (très légère).
    const inertia = THREE.MathUtils.clamp(smoothVel.current * 0.4, -0.6, 0.6);
    tmpLook.current.y -= inertia;

    // lookAt amorti : on interpole la cible de visée courante.
    lookCurrent.current.lerp(tmpLook.current, 1 - Math.exp(-6 * delta));
    camera.lookAt(lookCurrent.current);
  });

  return null;
}
