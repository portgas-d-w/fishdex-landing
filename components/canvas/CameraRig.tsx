import React, { useRef, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

export default function CameraRig() {
  const { camera, scene } = useThree();
  const progress = useRef(0);
  
  useLayoutEffect(() => {
    // Setup ScrollTrigger to track overall progress of the page
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress;
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  useFrame((state, delta) => {
    // On plonge strictement sur l'axe Y (vers le bas)
    // On fixe l'axe Z pour ne pas avancer
    const targetZ = 0;
    const targetY = 2 - progress.current * 200;
    const targetX = Math.sin(progress.current * Math.PI * 2) * 2; // léger sway

    // Smooth interpolation (lerp) for fluid movement
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2, delta);
    
    // Slight rotation depending on mouse position to give an organic feel
    const mouseX = (state.pointer.x * Math.PI) / 20;
    const mouseY = (state.pointer.y * Math.PI) / 20;

    // On oriente la caméra pour regarder directement vers le bas (-90 degrés)
    const targetRotX = -Math.PI / 2 + mouseY * 0.3;
    
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, targetRotX, 2, delta);
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -mouseX * 0.3, 2, delta);

    // Fog animation: darker and thicker as we go down
    if (scene.fog) {
      const depthFogColor = new THREE.Color('#010613'); // Abyss
      const surfaceFogColor = new THREE.Color('#031c36'); // Near surface
      
      const currentFogColor = surfaceFogColor.clone().lerp(depthFogColor, progress.current);
      scene.fog.color = currentFogColor;
      // Change background color to match fog
      scene.background = currentFogColor;
    }
  });

  return null;
}
