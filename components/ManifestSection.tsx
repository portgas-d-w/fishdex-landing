'use client'

import { motion } from 'framer-motion'

const LINES = [
  'La pêche n'est pas un sport.',
  'C'est un rapport au temps.',
  'FishDex ne gamifie pas. Il ne pousse pas à "capturer plus".',
  'Il préserve ce que tu vis — pour toi, plus tard.',
  'Un poisson rendu à l'eau mérite autant d'être noté qu'un trophée.',
  'Chaque session est un moment. Pas un score.',
]

export default function ManifestSection() {
  return (
    <section id="manifest" className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-xs text-cyan-400/60 uppercase tracking-[0.2em] mb-4">Manifeste</p>
          <h2 className="text-4xl md:text-5xl font-light text-white">Ce que nous croyons</h2>
        </motion.div>

        <div className="flex flex-col gap-8">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-xl md:text-2xl font-light leading-relaxed"
              style={{
                color: i % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16"
        >
          <div
            className="w-px h-16 mx-auto mb-6 rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(34,211,238,0.4), transparent)' }}
          />
          <p className="text-white/20 text-sm font-light italic">
            "Préserve tes moments de pêche."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
