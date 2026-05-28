"use client";

import React, { useEffect, useState } from 'react';
import { cinematicEvents, TOTAL_SECTIONS } from './canvas/useScrollProgress';

export default function Navigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check mobile
    if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    // We only show navigation once the user leaves the HERO section
    // Or we can show it immediately. Let's show it immediately.
    setIsVisible(true);

    const handleLeave = (e: Event) => {
      // cinematicState.activeSection is already updated to the new target
      import('./canvas/useScrollProgress').then(({ cinematicState }) => {
        setActiveIndex(cinematicState.activeSection);
      });
    };

    const handleEnter = (e: Event) => {
      // Just a fallback
      const customEvent = e as CustomEvent;
      setActiveIndex(customEvent.detail.index);
    };

    cinematicEvents.addEventListener('section_leave', handleLeave);
    cinematicEvents.addEventListener('section_enter', handleEnter);

    return () => {
      cinematicEvents.removeEventListener('section_leave', handleLeave);
      cinematicEvents.removeEventListener('section_enter', handleEnter);
    };
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
              if ((window as any).navigateToSection) {
                (window as any).navigateToSection(i);
                setActiveIndex(i); // Update immediately on click
              }
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
        <div style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          opacity: 0.4,
          animation: 'bounce 2s infinite ease-in-out',
          pointerEvents: 'none',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#F4F0E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
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
