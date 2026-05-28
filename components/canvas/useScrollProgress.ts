import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Shared scroll state — singleton refs accessible from any R3F component
const scrollProgress = { current: 0 };
const scrollVelocity = { current: 0 };
let lastProgress = 0;
let lastTime = 0;
let initialized = false;

export function initScrollTracking() {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1) / 1000;
      lastTime = now;

      scrollVelocity.current = (self.progress - lastProgress) / dt;
      lastProgress = self.progress;
      scrollProgress.current = self.progress;
    }
  });
}

/** Returns a ref-like object whose .current = scroll progress 0..1 */
export function useScrollProgress() {
  return scrollProgress;
}

/** Returns a ref-like object whose .current = scroll velocity (signed, per second) */
export function useScrollVelocity() {
  return scrollVelocity;
}
