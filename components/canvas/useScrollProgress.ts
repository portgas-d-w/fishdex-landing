import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION_ANCHORS, START_Z, cameraPosAt } from './diveConfig';

// État partagé, lu chaque frame par les composants R3F.
export const diveState = {
  progress: 0,
  cameraZ: START_Z,
  velocity: 0,
};

// Refs de compatibilité pour les composants d’environnement existants
// (GodRays, Caustics, Fauna, Particles, …) qui lisent `.current`.
const scrollProgress = { current: 0 };
const scrollVelocity = { current: 0 };

export function useScrollProgress() {
  return scrollProgress;
}
export function useScrollVelocity() {
  return scrollVelocity;
}

let initialized = false;

export function initScrollTracking() {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; // le fallback DOM prend le relais

  let lastProgress = 0;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    scrub: 1, // lissage du scrub (~1s de catch-up) → mouvement cinématographique
    onUpdate: (self) => {
      const p = self.progress;
      diveState.progress = p;
      diveState.cameraZ = cameraPosAt(p).z;
      // Vélocité = variation de progress par update, lissée et amplifiée.
      const dv = (p - lastProgress) * 60;
      diveState.velocity = dv;
      lastProgress = p;

      scrollProgress.current = p;
      scrollVelocity.current = dv;
    },
  });

  ScrollTrigger.refresh();
}
