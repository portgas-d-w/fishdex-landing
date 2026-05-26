'use client'

import { motion } from 'framer-motion'
import { APP_URL } from '@/lib/constants'

const FishLogo = () => (
  <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
    <g transform="translate(50,50)">
      <g transform="rotate(0) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".85"/><circle cx="-9" cy="0" r="2.5" fill="#0a1628"/></g>
      <g transform="rotate(120) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".85"/><circle cx="-9" cy="0" r="2.5" fill="#0a1628"/></g>
      <g transform="rotate(240) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".85"/><circle cx="-9" cy="0" r="2.5" fill="#0a1628"/></g>
    </g>
  </svg>
)

const FootLogo = () => (
  <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
    <g transform="translate(50,50)">
      <g transform="rotate(0) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".7"/></g>
      <g transform="rotate(120) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".7"/></g>
      <g transform="rotate(240) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".7"/></g>
    </g>
  </svg>
)

const reveal = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const vp = { once: true }
const tr = (d = 0) => ({ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay: d })

export default function CTASection() {
  return (
    <>
      {/* CTA Final */}
      <section id="beta" style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#060d18' }}>
        <div className="animate-orbpulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,238,.16) 0%,rgba(34,211,238,.04) 40%,transparent 70%)', filter: 'blur(60px)', ['--od' as string]: '10s' }} />
        <div className="animate-orbpulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,.1) 0%,transparent 70%)', filter: 'blur(40px)', ['--od' as string]: '14s' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 60 }}>
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0)} style={{ marginBottom: 36, display: 'flex', justifyContent: 'center' }}>
            <FishLogo />
          </motion.div>
          <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.1)}
            className="playfair"
            style={{ fontSize: 'clamp(52px,8vw,108px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.02, margin: '0 0 20px' }}
          >
            Commencer<br />
            <em style={{ fontStyle: 'italic', color: 'rgba(180,225,255,.42)' }}>à se souvenir.</em>
          </motion.h2>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.2)}
            style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,.3)', fontWeight: 300, marginBottom: 56, lineHeight: 1.7 }}
          >
            Bêta fermée.<br />Sur invitation uniquement.
          </motion.p>
          <motion.a
            variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.35)}
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '16px 48px', borderRadius: 50, background: '#fff', color: '#060d18', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500, transition: 'background 0.7s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#67e8f9')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            Accéder à l&apos;app
          </motion.a>
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.5)}
            style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(34,211,238,.35)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.22)', letterSpacing: '0.35em', textTransform: 'uppercase' }}>Web app · Gratuit pour commencer</span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '36px 60px', borderTop: '1px solid rgba(255,255,255,.025)', background: '#060d18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FootLogo />
          <span style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>FishDex</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['#features', 'Découvrir'], ['#pricing', 'Tarifs'], ['#manifest', 'Manifeste'], [APP_URL, 'App']].map(([href, label]) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.22)', textDecoration: 'none', transition: 'color 0.6s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.22)')}
            >
              {label}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,.15)' }}>© 2026 FishDex · France</p>
      </footer>
    </>
  )
}
