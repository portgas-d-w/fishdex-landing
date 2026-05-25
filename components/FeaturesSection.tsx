'use client'

import { motion } from 'framer-motion'
import { Camera, MapPin, BookOpen, BarChart2, Cloud, Fish } from 'lucide-react'

const FEATURES = [
  {
    icon: Fish,
    title: 'FishDex complet',
    desc: '92 espèces d\'eau douce françaises avec fiches détaillées, habitats, records, et système de rareté.',
    color: '#22d3ee',
  },
  {
    icon: Camera,
    title: 'Capture & IA',
    desc: 'Photographie ta prise, l\'IA identifie l\'espèce et estime la taille. Chaque capture devient un souvenir.',
    color: '#c084fc',
    pro: true,
  },
  {
    icon: MapPin,
    title: 'Spots & sessions',
    desc: 'Géolocalise tes spots secrets, démarre une session, note tes conditions. Retrouve tout plus tard.',
    color: '#34d399',
  },
  {
    icon: BarChart2,
    title: 'Statistiques',
    desc: 'Suivi de progression, espèces les plus pêchées, meilleurs spots, évolution dans le temps.',
    color: '#f59e0b',
    pro: true,
  },
  {
    icon: Cloud,
    title: 'Météo intelligente',
    desc: 'Conditions actuelles pour tes spots, conseils de pêche adaptés à la météo du moment.',
    color: '#60a5fa',
    pro: true,
  },
  {
    icon: BookOpen,
    title: 'Journal vivant',
    desc: 'Tes sessions prennent vie — photos, ressentis, conditions. Un carnet qui grandit avec toi.',
    color: '#fb7185',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs text-cyan-400/60 uppercase tracking-[0.2em] mb-4">Fonctionnalités</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Tout pour vivre la pêche
          </h2>
          <p className="text-white/35 text-lg font-light">Sans fioritures. Sans notifications inutiles.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass rounded-2xl p-6 relative group hover:border-white/14 transition-all duration-300"
            >
              {feat.pro && (
                <span
                  className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.2)' }}
                >
                  Pro
                </span>
              )}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${feat.color}14`, border: `1px solid ${feat.color}22` }}
              >
                <feat.icon size={18} style={{ color: feat.color }} strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-medium mb-2">{feat.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed font-light">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
