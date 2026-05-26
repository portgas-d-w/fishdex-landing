'use client'

import { motion } from 'framer-motion'

const RARITIES = [
  { no: 'I',   name: 'Commune',       sub: 'Gardon · Rotengle · Brème', color: 'rgba(148,163,184,.5)', dotShadow: 'rgba(148,163,184,.2)', bar: 'rgba(148,163,184,.4)' },
  { no: 'II',  name: 'Peu commune',   sub: 'Chevesne · Vandoise',       color: 'rgba(52,211,153,.5)',  dotShadow: 'rgba(52,211,153,.2)',  bar: 'rgba(52,211,153,.4)' },
  { no: 'III', name: 'Rare',          sub: 'Truite fario · Ombre',      color: 'rgba(96,165,250,.5)',  dotShadow: 'rgba(96,165,250,.2)',  bar: 'rgba(96,165,250,.4)' },
  { no: 'IV',  name: 'Épique',        sub: 'Silure · Saumon',           color: 'rgba(192,132,252,.5)', dotShadow: 'rgba(192,132,252,.2)', bar: 'rgba(192,132,252,.4)' },
  { no: 'V',   name: 'Légendaire',    sub: 'Huchon · Cristivomer',      color: 'rgba(245,158,11,.5)',  dotShadow: 'rgba(245,158,11,.2)',  bar: 'rgba(245,158,11,.4)' },
  { no: 'VI',  name: 'Mirage',        sub: 'Presque impossible',        color: '', dotShadow: '', bar: '', isMirage: true },
]

const reveal = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const vp = { once: true }
const tr = (d = 0) => ({ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay: d })

export default function RaritySection() {
  return (
    <section id="rarity" style={{ padding: '120px 60px', background: '#060d18' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0)}
          style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 36 }}
        >
          La collection · Six raretés
        </motion.p>
        <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.1)}
          className="playfair"
          style={{ fontSize: 'clamp(48px,6vw,84px)', fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.02em', marginBottom: 60 }}
        >
          Chaque rencontre<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.38)' }}>est unique.</em>
        </motion.h2>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.2)}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,0.025)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.025)' }}
        >
          {RARITIES.map(r => (
            <div
              key={r.no}
              style={{
                padding: '36px 32px', background: '#060d18', aspectRatio: '4/3',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                cursor: 'default', transition: 'background 1s', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.018)')}
              onMouseLeave={e => (e.currentTarget.style.background = '#060d18')}
            >
              {r.isMirage && (
                <div className="animate-orbpulse" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%,rgba(34,211,238,.07) 0%,rgba(167,139,250,.05) 40%,transparent 70%)', ['--od' as string]: '7s' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{r.no}</span>
                {r.isMirage
                  ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#67e8f9,#c084fc,#fb7185)' }} />
                  : <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, boxShadow: `0 0 10px ${r.dotShadow}` }} />
                }
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                {r.isMirage
                  ? <div className="playfair mirage-text" style={{ fontSize: 20, fontWeight: 300, marginBottom: 4 }}>{r.name}</div>
                  : <div className="playfair" style={{ fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>{r.name}</div>
                }
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{r.sub}</div>
                {r.isMirage
                  ? <div style={{ width: 28, height: 1, marginTop: 14, background: 'linear-gradient(90deg,rgba(34,211,238,.5),rgba(192,132,252,.5),rgba(251,113,133,.5))' }} />
                  : <div style={{ width: 28, height: 1, marginTop: 14, background: r.bar }} />
                }
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
