'use client'

import { motion } from 'framer-motion'
import { APP_URL } from '@/lib/constants'

const TIERS = [
  {
    name: 'Gratuit',
    price: '0 €',
    priceSize: 36,
    tagline: 'Pour commencer.',
    features: [
      'FishDex complet — 92 espèces',
      'Captures illimitées',
      'Sessions de pêche',
      '5 spots favoris',
      'FishFeed communauté',
    ],
    cta: "Accéder à l'app",
    featured: false,
  },
  {
    name: 'Pro',
    subtitle: '· Recommandé',
    price: '3,99€',
    period: '/ mois',
    tagline: 'Pour vivre la pêche.',
    features: [
      'IA reconnaissance espèces',
      'Estimation taille par photo',
      'Statistiques avancées',
      'Export sessions PDF',
      'Spots illimités',
      'Météo intelligente',
    ],
    cta: 'Essai gratuit 7 jours',
    featured: true,
  },
  {
    name: 'Légende',
    price: '6,99€',
    period: '/ mois',
    tagline: 'Pour les passionnés.',
    features: [
      'Tout le Pro',
      'Carte interactive des spots',
      'Analyse prédictive conditions',
      'Journal vocal transcrit',
      "Accès anticipé aux features",
    ],
    cta: 'Choisir Légende',
    featured: false,
  },
]

const reveal = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const vp = { once: true }
const tr = (d = 0) => ({ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay: d })

export default function PricingSection() {
  return (
    <section id="pricing" style={{ padding: '120px 60px', background: '#060d18' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0)}
          style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 36 }}
        >
          Chapitre 05 · Tarifs
        </motion.p>
        <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.1)}
          className="playfair"
          style={{ fontSize: 'clamp(48px,6vw,84px)', fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.02em', marginBottom: 60 }}
        >
          Trois<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.38)' }}>profondeurs.</em>
        </motion.h2>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={vp} transition={tr(0.2)}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}
        >
          {TIERS.map(tier => (
            <div
              key={tier.name}
              style={{
                padding: '40px 36px', borderRadius: 20, position: 'relative',
                background: tier.featured ? 'linear-gradient(160deg,rgba(34,211,238,.05) 0%,rgba(34,211,238,.015) 100%)' : 'rgba(255,255,255,.02)',
                border: tier.featured ? '1px solid rgba(34,211,238,.15)' : '1px solid rgba(255,255,255,.04)',
                transition: 'border-color 0.8s',
              }}
              onMouseEnter={e => { if (!tier.featured) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { if (!tier.featured) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)' }}
            >
              {tier.featured && (
                <div style={{ position: 'absolute', top: -1, left: 32, right: 32, height: 1, background: 'linear-gradient(90deg,transparent,rgba(34,211,238,.5),transparent)' }} />
              )}
              <p style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,.32)', marginBottom: 6 }}>
                {tier.name}
                {tier.subtitle && <span style={{ color: 'rgba(34,211,238,.5)', marginLeft: 10 }}>{tier.subtitle}</span>}
              </p>
              <div>
                <span className="playfair" style={{ fontSize: tier.priceSize ?? 48, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{tier.price}</span>
                {tier.period && <span style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', marginLeft: 4 }}>{tier.period}</span>}
              </div>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,.32)', fontWeight: 300, margin: '12px 0 20px' }}>{tier.tagline}</p>
              <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,.07)', marginBottom: 20 }} />
              <ul className="pricing-features" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {tier.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', padding: 13, borderRadius: 50,
                  fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.7s', textDecoration: 'none', textAlign: 'center',
                  ...(tier.featured
                    ? { background: '#fff', color: '#060d18' }
                    : { background: 'rgba(255,255,255,.03)', color: 'rgba(255,255,255,.45)', border: '1px solid rgba(255,255,255,.06)' }
                  ),
                }}
                onMouseEnter={e => { e.currentTarget.style.background = tier.featured ? '#67e8f9' : 'rgba(255,255,255,.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = tier.featured ? '#fff' : 'rgba(255,255,255,.03)' }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
