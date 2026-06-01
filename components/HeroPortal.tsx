'use client'

import React, { useRef, useEffect, useCallback } from 'react'

/**
 * HeroPortal — Layered parallax system for the lake surface.
 * 
 * 5 layers stacked with CSS:
 *   Layer 0 (back):  Sky / sunset background (section-1-v2.png)
 *   Layer 1:         Portal frame — water surface with central opening (portal.png)
 *   Layer 2:         Left curtain — reeds & vegetation (curtain-left.png)
 *   Layer 3:         Right curtain — reeds & vegetation (curtain-right.png)
 *   Layer 4 (front): Text content (children)
 * 
 * Below everything: the existing 3D Canvas (z-index lower).
 */

interface HeroPortalProps {
  children: React.ReactNode
  onPlungeComplete?: () => void
}

export default function HeroPortal({ children, onPlungeComplete }: HeroPortalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<{
    sky: HTMLDivElement | null
    portal: HTMLDivElement | null
    curtainLeft: HTMLDivElement | null
    curtainRight: HTMLDivElement | null
    content: HTMLDivElement | null
  }>({
    sky: null,
    portal: null,
    curtainLeft: null,
    curtainRight: null,
    content: null,
  })
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const plungeCompleteRef = useRef(false)

  // Easing function (ease-out cubic)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const updateLayers = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    // Calculate scroll progress (0 to 1 over the portal height)
    const rect = container.getBoundingClientRect()
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
    const easedProgress = easeOutCubic(scrollProgress)

    // Mouse parallax (normalized -1 to 1)
    const rx = (mouseRef.current.x / window.innerWidth - 0.5) * 2
    const ry = (mouseRef.current.y / window.innerHeight - 0.5) * 2

    const { sky, portal, curtainLeft, curtainRight, content } = layersRef.current

    // Layer 0: SKY — subtle scale up + parallax
    if (sky) {
      const scale = 1 + easedProgress * 0.18
      sky.style.transform = `scale(${scale}) translate3d(${rx * 6}px, ${ry * 6}px, 0)`
      sky.style.opacity = String(Math.max(0, 1 - Math.max(0, (scrollProgress - 0.75) / 0.25)))
    }

    // Layer 1: PORTAL — dramatic zoom through
    if (portal) {
      const scale = 1 + easedProgress * 6.5 // 1 → 7.5
      const opacity = scrollProgress > 0.65
        ? Math.max(0, 1 - (scrollProgress - 0.65) / 0.2)
        : 1
      portal.style.transform = `scale(${scale}) translate3d(${rx * 7}px, ${ry * 7}px, 0)`
      portal.style.opacity = String(opacity)
      portal.style.transformOrigin = '52% 38%'
    }

    // Layer 2 & 3: CURTAINS — slide apart
    const initialShift = 5 // Start slightly off to show edges
    const scrollShift = easedProgress * 150 // Move out to 150%
    const totalShift = initialShift + scrollShift
    const curtainScale = 1 + easedProgress * 0.3 // 1 → 1.3

    if (curtainLeft) {
      curtainLeft.style.transform = `translateX(calc(-${totalShift}% + ${rx * 14}px)) translateY(${ry * 14 * 0.3}px) scale(${curtainScale}) translateZ(0)`
    }
    if (curtainRight) {
      curtainRight.style.transform = `translateX(calc(${totalShift}% + ${rx * 14}px)) translateY(${ry * 14 * 0.3}px) scale(${curtainScale}) translateZ(0)`
    }

    // Layer 4: CONTENT — fade out early
    if (content) {
      const contentOpacity = Math.max(0, 1 - scrollProgress / 0.35)
      content.style.opacity = String(contentOpacity)
      content.style.transform = `translate3d(${rx * 4}px, ${ry * 4 + scrollProgress * 40}px, 0)`
      content.style.pointerEvents = contentOpacity < 0.1 ? 'none' : 'auto'
    }

    // Trigger plunge complete callback
    if (scrollProgress > 0.85 && !plungeCompleteRef.current) {
      plungeCompleteRef.current = true
      onPlungeComplete?.()
    } else if (scrollProgress < 0.5) {
      plungeCompleteRef.current = false
    }

    // Hide entire portal container when fully scrolled
    if (container) {
      container.style.opacity = scrollProgress >= 0.95 ? '0' : '1'
      container.style.pointerEvents = scrollProgress >= 0.95 ? 'none' : 'auto'
    }

    rafRef.current = requestAnimationFrame(updateLayers)
  }, [onPlungeComplete])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouse, { passive: true })
    rafRef.current = requestAnimationFrame(updateLayers)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updateLayers])

  return (
    <div
      ref={containerRef}
      className="hero-portal-container"
    >
      {/* Scroll spacer — gives us scroll distance to animate over */}
      <div className="hero-portal-spacer" />

      {/* Fixed viewport with all layers */}
      <div className="hero-portal-viewport">
        {/* Layer 0: Sky background */}
        <div
          ref={el => { layersRef.current.sky = el }}
          className="hero-portal-layer hero-portal-sky"
          style={{ backgroundImage: "url('/images/new/section-1-v2.png')" }}
        />

        {/* Layer 1: Portal frame — water surface */}
        <div
          ref={el => { layersRef.current.portal = el }}
          className="hero-portal-layer hero-portal-frame"
          style={{ backgroundImage: "url('/images/new/portal.png')" }}
        />

        {/* Layer 2: Left curtain */}
        <div
          ref={el => { layersRef.current.curtainLeft = el }}
          className="hero-portal-layer hero-portal-curtain-left"
          style={{ backgroundImage: "url('/images/new/curtain-left.png')" }}
        />

        {/* Layer 3: Right curtain */}
        <div
          ref={el => { layersRef.current.curtainRight = el }}
          className="hero-portal-layer hero-portal-curtain-right"
          style={{ backgroundImage: "url('/images/new/curtain-right.png')" }}
        />

        {/* Layer 4: Text content */}
        <div
          ref={el => { layersRef.current.content = el }}
          className="hero-portal-layer hero-portal-content"
        >
          {children}
        </div>

        {/* Scroll indicator */}
        <div className="hero-portal-scroll-hint">
          <span>Explorer</span>
          <div className="hero-portal-scroll-line" />
        </div>
      </div>
    </div>
  )
}
