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
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#060d18 0%,#0a1a2e 35%,#0d2240 60%,#091525 100%)' }} />

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {stars.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{
              width: s.size, height: s.size,
              left: `${s.left}%`, top: `${s.top}%`,
              ['--d' as string]: `${s.d}s`,
              ['--delay' as string]: `${s.delay}s`,
              ['--min' as string]: s.min,
              ['--max' as string]: s.max,
            }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="animate-orbpulse" style={{ position: 'absolute', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(34,211,238,.07) 0%,transparent 70%)', top: '15%', left: '10%', borderRadius: '50%', filter: 'blur(80px)', ['--od' as string]: '10s' }} />
      <div className="animate-orbpulse" style={{ position: 'absolute', width: 400, height: 300, background: 'radial-gradient(ellipse,rgba(96,165,250,.06) 0%,transparent 70%)', top: '40%', right: '5%', borderRadius: '50%', filter: 'blur(80px)', ['--od' as string]: '14s' }} />

      {/* Lake SVG */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, width: '100%', height: '60%' }}>
          <defs>
            <linearGradient id="lakefill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d2240" stopOpacity=".9"/>
              <stop offset="100%" stopColor="#060d18" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="moonreflect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity=".15"/>
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Trees */}
          <path d="M0 280 Q80 240 120 250 L130 500 L0 500Z" fill="#050c16"/>
          <path d="M100 250 Q140 200 180 220 Q170 230 160 240 L160 500 L90 500Z" fill="#060d18"/>
          <path d="M150 230 Q190 180 230 200 Q220 220 210 240 L200 500 L140 500Z" fill="#050c16"/>
          <path d="M1260 260 Q1300 210 1340 230 L1340 500 L1250 500Z" fill="#050c16"/>
          <path d="M1310 240 Q1360 190 1400 210 L1440 260 L1440 500 L1300 500Z" fill="#060d18"/>
          <path d="M1360 220 Q1400 180 1440 200 L1440 500 L1350 500Z" fill="#050c16"/>
          {/* Lake */}
          <path d="M0 340 Q360 300 720 320 Q1080 340 1440 310 L1440 500 L0 500Z" fill="url(#lakefill)"/>
          {/* Moon reflection */}
          <ellipse cx="720" cy="350" rx="8" ry="60" fill="url(#moonreflect)" opacity=".6"/>
          {/* Water lines */}
          <line x1="400" y1="365" x2="550" y2="358" stroke="rgba(180,220,255,.04)" strokeWidth="1"/>
          <line x1="880" y1="360" x2="1020" y2="368" stroke="rgba(180,220,255,.04)" strokeWidth="1"/>
          <line x1="600" y1="380" x2="840" y2="372" stroke="rgba(180,220,255,.05)" strokeWidth="1.5"/>
          <line x1="500" y1="395" x2="700" y2="388" stroke="rgba(180,220,255,.03)" strokeWidth="1"/>
          <line x1="740" y1="392" x2="920" y2="400" stroke="rgba(180,220,255,.03)" strokeWidth="1"/>
          {/* Moon */}
          <circle cx="720" cy="80" r="28" fill="#fff" opacity=".9"/>
          <circle cx="720" cy="80" r="36" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
          <circle cx="720" cy="80" r="48" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Mist */}
      <div className="animate-mistdrift" style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: 120, background: 'linear-gradient(to right,transparent,rgba(140,180,220,.04) 30%,rgba(140,180,220,.07) 50%,rgba(140,180,220,.04) 70%,transparent)' }} />

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 70%,transparent 0%,rgba(6,13,24,.7) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top,#060d18 0%,rgba(6,13,24,.8) 40%,transparent 100%)' }} />

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
