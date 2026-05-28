import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Global shared state
export const cinematicState = {
  phase: 'SURFACE', // 'SURFACE' | 'BITING' | 'DIVING'
  biteProgress: 0,
  activeSection: 0,
  cameraZ: 100,
};

export const SECTION_Z_POSITIONS = [0, -150, -300, -450, -600, -750, -900, -1050];
export const CAMERA_Z_TARGETS = [100, -50, -200, -350, -500, -650, -800, -950];
export const TOTAL_SECTIONS = 8;

const scrollProgress = { current: 0 };
const scrollVelocity = { current: 0 };

export function useScrollProgress() {
  return scrollProgress;
}

export function useScrollVelocity() {
  return scrollVelocity;
}

// Event target for cross-component communication
export const cinematicEvents = new EventTarget();

let initialized = false;
let isCooldown = false;

export function initScrollTracking() {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Enable snap scrolling on mobile, but keep reduced motion check
  if (reducedMotion) return;

  document.body.style.overflow = 'hidden';

  let touchStartY = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };

  const navigateToSection = (newIndex: number) => {
    if (isCooldown || newIndex < 0 || newIndex >= TOTAL_SECTIONS || newIndex === cinematicState.activeSection) return;
    
    isCooldown = true;
    const oldIndex = cinematicState.activeSection;
    cinematicState.activeSection = newIndex;
    
    // Notify about section departure/arrival for UI fades
    cinematicEvents.dispatchEvent(new CustomEvent('section_leave', { detail: { index: oldIndex } }));
    
    // The "bite" cinematic still triggers when leaving section 0 for the first time
    if (oldIndex === 0 && newIndex === 1 && cinematicState.phase === 'SURFACE') {
      cinematicState.phase = 'BITING';
      cinematicEvents.dispatchEvent(new Event('bite_start'));
      
      let hasPlunged = false;
      
      gsap.to(cinematicState, {
        biteProgress: 1,
        duration: 1.8,
        ease: "none",
        onUpdate: () => {
          // 800ms / 1800ms = 0.444 (Crossing the surface)
          if (!hasPlunged && cinematicState.biteProgress >= 0.444) {
            hasPlunged = true;
            cinematicEvents.dispatchEvent(new Event('water_impact'));
          }
        },
        onComplete: () => { cinematicState.phase = 'DIVING'; }
      });
    }

    if (newIndex === 0) {
      cinematicState.phase = 'SURFACE';
      cinematicEvents.dispatchEvent(new Event('surface_return'));
    }

    // Move Camera Z
    // Easing power4.inOut is very close to cubic-bezier(0.76, 0, 0.24, 1)
    gsap.to(cinematicState, {
      cameraZ: CAMERA_Z_TARGETS[newIndex],
      duration: 1.4,
      ease: "power4.inOut",
      onUpdate: () => {
        const totalDist = Math.abs(CAMERA_Z_TARGETS[0] - CAMERA_Z_TARGETS[TOTAL_SECTIONS - 1]);
        const currentDist = Math.abs(CAMERA_Z_TARGETS[0] - cinematicState.cameraZ);
        const p = currentDist / totalDist;
        
        // Simple proxy for velocity (difference per frame)
        scrollVelocity.current = (p - scrollProgress.current) * 60; // scale up for effect
        scrollProgress.current = p;
      }
    });

    // Notify new section to appear after 400ms delay
    setTimeout(() => {
      cinematicEvents.dispatchEvent(new CustomEvent('section_enter', { detail: { index: newIndex } }));
    }, 400);

    // Cooldown of 1.6s
    setTimeout(() => {
      isCooldown = false;
    }, 1600);
  };

  const handleInput = (e: Event) => {
    let delta = 0;
    if (e.type === 'wheel') {
      delta = (e as WheelEvent).deltaY;
    } else if (e.type === 'touchmove') {
      const touchY = (e as TouchEvent).touches[0].clientY;
      delta = touchStartY - touchY;
      touchStartY = touchY; // Reset for continuous swiping logic, though we snap
    }

    if (Math.abs(delta) < 20) return; // ignore tiny movements

    if (delta > 0) {
      navigateToSection(cinematicState.activeSection + 1);
    } else {
      navigateToSection(cinematicState.activeSection - 1);
    }
  };

  window.addEventListener('wheel', handleInput, { passive: true });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleInput, { passive: true });

  // Expose global nav function
  (window as any).navigateToSection = navigateToSection;
}
