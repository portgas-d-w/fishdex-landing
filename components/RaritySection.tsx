'use client'

import { motion } from 'framer-motion'
import { RARITIES } from '@/lib/constants'

export default function RaritySection() {
  return (
    <section id="rarity" className="py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs text-cyan-400/60 uppercase tracking-[0.2em] mb-4">Collection</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Six niveaux de rareté
          </h2>
          <p className="text-white/35 text-lg font-light max-w-xl mx-auto">
            Chaque espèce est classée selon sa rareté. Débloquer un Mirage, c'est une vie entière de pêche.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {RARITIES.map((rarity, i) => (
            <motion.div
              key={rarity.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-5 text-center group hover:scale-105 transition-all duration-300 cursor-default"
              style={{
                borderColor: rarity.isMirage ? 'rgba(103,232,249,0.2)' : `${rarity.color}22`,
              }}
            >
              {/* Numéro romain */}
              <div
                className="text-2xl font-light mb-3"
                style={{
                  color: rarity.isMirage ? 'transparent' : rarity.color,
                  backgroundImage: rarity.isMirage
                    ? 'linear-gradient(135deg, #67e8f9, #c084fc, #fb7185)'
                    : undefined,
                  WebkitBackgroundClip: rarity.isMirage ? 'text' : undefined,
                  backgroundClip: rarity.isMirage ? 'text' : undefined,
                }}
              >
                {rarity.no}
              </div>

              {/* Orbe coloré */}
              <div
                className="w-10 h-10 rounded-full mx-auto mb-3 animate-pulse-glow"
                style={{
                  background: rarity.isMirage
                    ? 'linear-gradient(135deg, #67e8f9, #c084fc, #fb7185)'
                    : rarity.color,
                  boxShadow: rarity.isMirage
                    ? '0 0 20px rgba(103,232,249,0.3)'
                    : `0 0 16px ${rarity.color}40`,
                  opacity: 0.8,
                }}
              />

              <div
                className="text-xs font-medium mb-1"
                style={{
                  color: rarity.isMirage ? 'transparent' : rarity.color,
                  backgroundImage: rarity.isMirage
                    ? 'linear-gradient(135deg, #67e8f9, #c084fc, #fb7185)'
                    : undefined,
                  WebkitBackgroundClip: rarity.isMirage ? 'text' : undefined,
                  backgroundClip: rarity.isMirage ? 'text' : undefined,
                }}
              >
                {rarity.name}
              </div>
              <div className="text-white/30 text-[10px] leading-snug">{rarity.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
