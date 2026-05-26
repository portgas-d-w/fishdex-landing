'use client'

import { motion } from 'framer-motion'

const reveal = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const vp = { once: true }
const tr = (d = 0) => ({ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay: d })

export default function MemorySection() {
  return (
    <section id="memory" style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#060d18 0%,#0a1628 100%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt="Lac aube"
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#060d18 0%,rgba(6,13,24,.5) 50%,rgba(6,13,24,.3) 100%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 60px 80px', maxWidth: 1400, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 48, alignItems: 'end' }}>
        <div>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0)}
            style={{ fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(34,211,238,0.4)', marginBottom: 28 }}
          >
            Un souvenir
          </motion.p>
          <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.1)}
            className="playfair"
            style={{ fontSize: 'clamp(42px,5.5vw,80px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}
          >
            Ce ne sont pas les prises<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.42)' }}>qui restent.</em>
          </motion.h2>
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.2)}
            style={{ display: 'flex', gap: 8, marginBottom: 28 }}
          >
            <span style={{ padding: '5px 14px', borderRadius: 50, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid rgba(34,211,238,.18)', color: 'rgba(34,211,238,.7)' }}>Brochet</span>
            <span style={{ padding: '5px 14px', borderRadius: 50, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid rgba(96,165,250,.18)', color: 'rgba(96,165,250,.7)' }}>Rare</span>
          </motion.div>
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.35)}
            style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 300, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.01em' }}
          >
            87 cm <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 10px' }}>—</span> 3.2 kg
          </motion.div>
        </div>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.2)}
          style={{ padding: '28px 32px', borderRadius: 20, background: 'rgba(255,255,255,.03)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,.045)' }}
        >
          <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,.65)', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
            &ldquo;Ce matin-là, la brume n&apos;avait pas encore quitté le lac. Le silence était total.&rdquo;
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Date', '19 mai 2026'],
              ['Lieu', 'Lac d\'Annecy'],
              ['Eau', '14 °C'],
              ['Session', '4h 23min'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 9 }}>
                <span style={{ letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.22)', width: 52 }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,.5)' }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.04)', fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,.18)' }}>
            — noté à la main
          </div>
        </motion.div>
      </div>
    </section>
  )
}
