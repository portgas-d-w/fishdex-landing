'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { APP_URL } from '@/lib/constants'

type Star = { size: number; left: number; top: number; d: number; delay: number; min: number; max: number }

export default function Hero() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(Array.from({ length: 80 }, () => ({
      size: Math.random() * 1.5 + 0.5,
      left: Math.random() * 100,
      top: Math.random() * 65,
      d: 2 + Math.random() * 5,
      delay: -(Math.random() * 5),
      min: 0.05 + Math.random() * 0.1,
      max: 0.3 + Math.random() * 0.6,
    })))
  }, [])

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
      {/* Foreground Framing (Rocks/Dock) to enhance height perception */}
      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: '35vh', pointerEvents: 'none', zIndex: 5 }}>
        <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" style={{ width: '100%', height: '100%' }}>
          {/* Rocher bas gauche */}
          <path d="M0 300 L0 80 Q150 100 250 200 Q300 250 380 300 Z" fill="#020406"/>
          <path d="M0 300 L0 130 Q100 160 180 250 Q220 280 280 300 Z" fill="#040a10"/>
          {/* Rocher bas droite */}
          <path d="M1440 300 L1440 50 Q1200 90 1100 180 Q1050 250 950 300 Z" fill="#020406"/>
          <path d="M1440 300 L1440 120 Q1280 150 1200 230 Q1160 270 1100 300 Z" fill="#040a10"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 60px 100px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 1.0 }}
          style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(34,211,238,0.5)', marginBottom: 28 }}
        >
          fishdex.fr · Bêta fermée
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease, delay: 1.2 }}
          className="playfair"
          style={{ fontSize: 'clamp(64px,9vw,120px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-0.02em', marginBottom: 36 }}
        >
          Le monde vivant<br />
          <em style={{ fontStyle: 'italic', color: 'rgba(180,225,255,0.45)' }}>de la pêche.</em>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 1.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 36 }}
        >
          <a
            href="#features"
            style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.8s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            Explorer
          </a>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)' }} />
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.8s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            Accéder à l&apos;app →
          </a>
        </motion.div>
      </div>

      {/* Badge météo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease, delay: 2.0 }}
        style={{ position: 'absolute', bottom: 80, right: 60, zIndex: 10 }}
        className="hidden md:block"
      >
        <div style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.85)' }}>12°</div>
            <div style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Annecy · France</div>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 2 }}>
            <div>Brume matinale</div>
            <div>1018 hPa</div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease, delay: 2.4 }}
        style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Défiler</span>
        <div className="animate-scrolldrop" style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,rgba(255,255,255,0.2),transparent)' }} />
      </motion.div>
    </section>
  )
}
