"use client";

import React, { useEffect, useState } from 'react';
import { diveState } from './canvas/useScrollProgress';
import { SECTION_ANCHORS, TOTAL_SECTIONS } from './canvas/diveConfig';

function scrollToAnchor(index: number) {
  const clamped = Math.max(0, Math.min(index, TOTAL_SECTIONS - 1));
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: SECTION_ANCHORS[clamped] * max, behavior: 'smooth' });
}

export default function Navigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pas d’indicateur sur mobile / reduced-motion (le fallback DOM gère).
    if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    setIsVisible(true);

    // Section active = ancre la plus proche du progress courant (rAF léger).
    let raf = 0;
    const tick = () => {
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < SECTION_ANCHORS.length; i++) {
        const dist = Math.abs(SECTION_ANCHORS[i] - diveState.progress);
        if (dist < best) { best = dist; nearest = i; }
      }
      setActiveIndex((prev) => (prev === nearest ? prev : nearest));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Side Dots */}
      <div style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 100,
      }}>
        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              scrollToAnchor(i);
              setActiveIndex(i); // Update immediately on click
            }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeIndex === i ? '#8FBFA3' : 'rgba(244,240,232,0.2)',
              transition: 'background-color 0.3s ease',
              padding: 0,
            }}
            aria-label={`Go to section ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom Arrow */}
      {activeIndex < TOTAL_SECTIONS - 1 && (
        <button
          onClick={() => scrollToAnchor(activeIndex + 1)}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            opacity: 0.4,
            animation: 'bounce 2s infinite ease-in-out',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Section suivante"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#F4F0E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 10px); }
        }
      `}} />
    </>
  );
}
