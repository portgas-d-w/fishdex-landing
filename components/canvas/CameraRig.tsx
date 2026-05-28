import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { useScrollProgress, useScrollVelocity, cinematicState } from './useScrollProgress';

export default function CameraRig() {
  const scrollProgress = useScrollProgress();
  const scrollVelocity = useScrollVelocity();
  const lastVelocity = useRef(0);
  
  // Cinematic camera values (target values we interpolate towards)
  const rigState = useRef({
    y: 5,
    z: 5,
    rotX: -0.3 // ~ -17 degrees (looking down)
  });

  useFrame((state, delta) => {
    // Smooth velocity for inertial effects
    lastVelocity.current = THREE.MathUtils.damp(lastVelocity.current, scrollVelocity.current, 2, delta);

    const camera = state.camera;
    const { phase, biteProgress } = cinematicState;

    // Determine target positions based on state
    if (phase === 'SURFACE') {
      // Act 1: Hovering above water at the edge of the lake
      rigState.current.y = 3.5;
      rigState.current.z = 100;
      rigState.current.rotX = -0.35; // Looking down at the float
      
    } else if (phase === 'BITING') {
      // Bite cinematic (total 1800ms mapped to 0->1)
      // 0-0.055 (0-100ms): tension
      // 0.055-0.138 (100-250ms): plunge of the float (camera doesn't move yet)
      // 0.138-1.0 (250-1800ms): camera is dragged into the water
      
      if (biteProgress <= 0.138) {
        // Camera holds position during tension and float plunge
        rigState.current.y = 3.5;
        rigState.current.z = 100;
        rigState.current.rotX = -0.35;
      } else {
        // Camera plunges in
        const camP = (biteProgress - 0.138) / (1.0 - 0.138); // 0 to 1
        const ease = camP * camP; // Accelerating curve
        
        rigState.current.y = 3.5 - ease * 4.5; // Drops to -1
        rigState.current.z = 100 - ease * 15; // Pulled slightly forward on Z
        rigState.current.rotX = -0.35 - ease * 0.3; // Tilts down into the water
      }
      
    } else if (phase === 'DIVING') {
      // Act 3: gsap animates cinematicState.cameraZ to each section target
      rigState.current.y = -1;
      rigState.current.z = cinematicState.cameraZ;
      rigState.current.rotX = 0; // Looks forward again
    }

    // Apply target positions with damping for smoothness (factor 0.06 is roughly lerp(0.06) at 60fps)
    // We use THREE.MathUtils.damp with delta to be framerate independent. 
    // lerp(0.06) at 60fps is ~ damp(lamda=3.7). We use 4.
    const dampFactor = phase === 'BITING' ? 8 : 4;
    
    camera.position.z = THREE.MathUtils.damp(camera.position.z, rigState.current.z, dampFactor, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, rigState.current.y, dampFactor, delta);
    
    // No more float effect on X/Y to guarantee absolute stability of texts

    // Inertial rotation based on scroll velocity (only during DIVING)
    let extraRotX = 0;
    if (phase === 'DIVING') {
      extraRotX = THREE.MathUtils.clamp(lastVelocity.current * 0.5, -0.05, 0.05);
    }

    // Mouse parallax
    const mouseX = (state.pointer.x * Math.PI) / 60;
    const mouseY = (state.pointer.y * Math.PI) / 60;

    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, rigState.current.rotX + extraRotX + mouseY, 3, delta);
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -mouseX, 3, delta);
  });

  return null;
}
