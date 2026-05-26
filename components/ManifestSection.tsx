'use client'

import { motion } from 'framer-motion'

const reveal = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const vp = { once: true }
const tr = (d = 0) => ({ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay: d })

export default function ManifestSection() {
  return (
    <section id="manifest" style={{ padding: '140px 60px', background: '#060d18' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0)}
          style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 52 }}
        >
          <span style={{ display: 'block', width: 44, height: 1, background: 'rgba(255,255,255,.12)' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,.22)' }}>Manifeste</span>
        </motion.div>

        <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.1)}
          className="playfair"
          style={{ fontSize: 'clamp(38px,5vw,68px)', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 40 }}
        >
          <span style={{ color: 'rgba(255,255,255,.3)' }}>Construit lentement.</span><br />
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(180,225,255,.5)' }}>Par un homme,</em><br />
          <span style={{ color: 'rgba(255,255,255,.75)' }}>au bord d&apos;un lac.</span>
        </motion.h2>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.2)}
          style={{ fontSize: 15, color: 'rgba(255,255,255,.38)', fontWeight: 300, lineHeight: 1.9, maxWidth: 440, marginLeft: 'auto' }}
        >
          <p style={{ marginBottom: 16 }}>Pas de bureau. Pas d&apos;équipe. Juste du temps.</p>
          <p>FishDex existe parce que la pêche mérite un objet à sa hauteur.</p>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.35)}
          style={{ marginTop: 72, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,.04)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
        >
          {[
            { num: '92', label: 'Espèces' },
            { num: '1', label: 'Créateur' },
            { num: '∞', label: 'Patience', italic: true },
          ].map(s => (
            <div key={s.label}>
              <div className="playfair" style={{ fontSize: 32, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', fontStyle: s.italic ? 'italic' : 'normal' }}>{s.num}</div>
              <div style={{ fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,.22)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
          <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)' }}>France 🇫🇷</div>
        </motion.div>
      </div>
    </section>
  )
}
