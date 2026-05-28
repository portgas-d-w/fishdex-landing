import React, { useRef, useLayoutEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

export default function CameraRig() {
  const progress = useRef(0);
  const scrollVelocity = useRef(0);
  const lastProgress = useRef(0);
  
  useLayoutEffect(() => {
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
    // Calcul de la vélocité (pour l'inertie de rotation)
    const currentVelocity = (progress.current - lastProgress.current) / delta;
    // Lissage de la vélocité pour éviter les à-coups
    scrollVelocity.current = THREE.MathUtils.damp(scrollVelocity.current, currentVelocity, 2, delta);
    lastProgress.current = progress.current;

    const camera = state.camera;

    // Déplacement principal : Axe Z de 0 (surface) à -800 (abysses)
    const targetZ = -progress.current * 800;
    
    // Léger flottement naturel sur Y et X pour donner un effet sous-marin
    const floatY = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    const floatX = Math.cos(state.clock.elapsedTime * 0.3) * 1.5;

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, floatY, 1, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, floatX, 1, delta);

    // Rotation inertielle liée à la vitesse de scroll (effet physique)
    // velocity est généralement petite, on la multiplie
    const targetRotX = scrollVelocity.current * 0.5; // ±2 degrés environ selon le scroll
    // On contraint la rotation max
    const clampedRotX = THREE.MathUtils.clamp(targetRotX, -0.05, 0.05);
    
    // Parallaxe souris très subtile
    const mouseX = (state.pointer.x * Math.PI) / 60;
    const mouseY = (state.pointer.y * Math.PI) / 60;

    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, clampedRotX + mouseY, 3, delta);
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -mouseX, 3, delta);
  });

  return null;
}
