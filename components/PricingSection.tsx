'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRICING_TIERS, APP_URL } from '@/lib/constants'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs text-cyan-400/60 uppercase tracking-[0.2em] mb-4">Tarifs</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">Simple et honnête</h2>
          <p className="text-white/35 font-light">
            Commence gratuitement. Passe Pro si tu veux aller plus loin.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-2xl p-6 flex flex-col"
              style={{
                background: tier.featured
                  ? 'linear-gradient(145deg, rgba(34,211,238,0.10) 0%, rgba(14,22,40,0.9) 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: tier.featured
                  ? '1px solid rgba(34,211,238,0.25)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: tier.featured ? '0 0 40px rgba(34,211,238,0.08)' : undefined,
              }}
            >
              {tier.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1 rounded-full font-medium text-slate-950"
                  style={{ background: 'linear-gradient(135deg, #67e8f9, #22d3ee)' }}
                >
                  Recommandé
                </div>
              )}

              <div className="mb-6">
                <p className="text-white/50 text-sm mb-1">{tier.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-light text-white">{tier.price}</span>
                  {tier.period && <span className="text-white/30 text-sm">/{tier.period}</span>}
                </div>
                <p className="text-white/25 text-xs">{tier.tagline}</p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: tier.featured ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}
                      strokeWidth={2.5}
                    />
                    <span className="text-white/50 text-sm font-light">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                style={
                  tier.featured
                    ? {
                        background: 'linear-gradient(135deg, #67e8f9, #22d3ee)',
                        color: '#0a1628',
                      }
                    : {
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }
                }
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
