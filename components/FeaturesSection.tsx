'use client'

import { motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}
const transition = (delay = 0) => ({ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay })
const viewport = { once: true }

export default function FeaturesSection() {
  return (
    <>
      {/* CHAPITRE 01 — DÉCOUVRIR */}
      <section id="features" style={{ position: 'relative', height: '85vh', minHeight: 600, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=80" alt="Truite" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#060d18 0%,rgba(6,13,24,.45) 55%,rgba(6,13,24,.35) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(6,13,24,.7) 0%,rgba(6,13,24,.2) 60%,transparent 100%)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 60px 80px', maxWidth: 1400, margin: '0 auto' }}>
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0)}
            style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}
          >
            01
            <span style={{ display: 'block', width: 48, height: 1, background: 'rgba(255,255,255,0.12)' }} />
          </motion.div>
          <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.1)}
            className="playfair"
            style={{ fontSize: 'clamp(60px,8vw,108px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', marginBottom: 14 }}
          >
            Découvrir.
          </motion.h2>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.2)}
            style={{ fontSize: 18, color: 'rgba(180,225,255,0.45)', fontStyle: 'italic', fontWeight: 300, marginBottom: 8 }}
          >
            92 espèces. Un monde vivant.
          </motion.p>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.35)}
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
          >
            Chaque poisson d&apos;eau douce de France, documenté. Biologie, techniques, conditions idéales.
          </motion.p>
        </div>
      </section>

      {/* SPLIT — CAPTURER */}
      <div style={{ padding: '120px 60px', background: '#060d18' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 120, alignItems: 'center' }}>
          <div>
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0)}
              style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(34,211,238,0.4)', marginBottom: 24 }}
            >
              02 · Capturer
            </motion.div>
            <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.1)}
              className="playfair"
              style={{ fontSize: 'clamp(44px,5vw,72px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}
            >
              L&apos;instant<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>devient souvenir.</em>
            </motion.h2>
            <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.2)}
              style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 420 }}
            >
              Photographier, identifier, garder. Chaque prise prend sa place dans ton encyclopédie personnelle.
            </motion.p>
          </div>

          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.1)} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -40, borderRadius: 80, background: 'radial-gradient(circle,rgba(34,211,238,.12) 0%,transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
            <div style={{ width: 280, margin: '0 auto', borderRadius: 48, padding: 12, background: 'linear-gradient(145deg,rgba(80,90,110,.4),rgba(20,30,50,.6))', boxShadow: '0 40px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#000', borderRadius: 10, zIndex: 10 }} />
              <div style={{ borderRadius: 38, overflow: 'hidden', aspectRatio: '9/19.5', background: 'linear-gradient(160deg,#0a1628,#0d2240)', position: 'relative' }}>
                <div style={{ padding: '40px 20px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 16, backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(34,211,238,.6)', marginBottom: 8 }}>Capture enregistrée</div>
                    <div className="playfair" style={{ fontSize: 18, fontWeight: 300, color: '#fff', marginBottom: 4 }}>Truite fario</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 12, fontStyle: 'italic' }}>Salmo trutta fario</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div><div style={{ fontSize: 14, color: '#fff', fontWeight: 300 }}>52 cm</div><div style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Taille</div></div>
                      <div><div style={{ fontSize: 14, color: '#fff', fontWeight: 300 }}>1.4 kg</div><div style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Poids</div></div>
                      <div><div style={{ fontSize: 14, color: '#60a5fa', fontWeight: 300 }}>Rare</div><div style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Rareté</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CHAPITRE 03 — COLLECTIONNER */}
      <section style={{ position: 'relative', height: '85vh', minHeight: 600, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1920&q=80" alt="Lac nuit" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#060d18 0%,rgba(6,13,24,.45) 55%,rgba(6,13,24,.35) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(6,13,24,.7) 0%,rgba(6,13,24,.2) 60%,transparent 100%)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 60px 80px', maxWidth: 1400, margin: '0 auto' }}>
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0)}
            style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}
          >
            03
            <span style={{ display: 'block', width: 48, height: 1, background: 'rgba(255,255,255,0.12)' }} />
          </motion.div>
          <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.1)}
            className="playfair"
            style={{ fontSize: 'clamp(60px,8vw,108px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', marginBottom: 14 }}
          >
            Collectionner.
          </motion.h2>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.2)}
            style={{ fontSize: 18, color: 'rgba(180,225,255,0.45)', fontStyle: 'italic', fontWeight: 300, marginBottom: 8 }}
          >
            Votre aquarium grandit avec vous.
          </motion.p>
          <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={viewport} transition={transition(0.35)}
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
          >
            De la carpe commune au brochet légendaire. Chaque capture enrichit votre collection.
          </motion.p>
        </div>
      </section>
    </>
  )
}
