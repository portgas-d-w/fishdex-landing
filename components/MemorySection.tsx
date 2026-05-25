'use client'

import { motion } from 'framer-motion'

const MEMORIES = [
  {
    date: 'Il y a 1 an aujourd\'hui',
    title: 'Brochet · 84 cm',
    spot: 'Étang des Saules',
    note: 'No-kill. Sorti à l\'aube, brume sur l\'eau.',
    color: '#60a5fa',
  },
  {
    date: '23 avril',
    title: 'Session lac du barrage',
    spot: '4h12 · 3 captures',
    note: 'Conditions parfaites. Vent nul, température 14°C.',
    color: '#34d399',
  },
  {
    date: 'Record personnel',
    title: 'Silure · 1m42',
    spot: 'Rivière Dordogne',
    note: 'Le poisson de ma vie.',
    color: '#c084fc',
  },
]

export default function MemorySection() {
  return (
    <section id="memory" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs text-cyan-400/60 uppercase tracking-[0.2em] mb-4">Journal vivant</p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              La mémoire de<br />
              <span className="text-cyan-400">chaque sortie</span>
            </h2>
            <p className="text-white/40 text-lg font-light leading-relaxed mb-6">
              Un souvenir ne s'efface pas. FishDex te rappelle ce que tu as vécu,
              là où tu l'as vécu. Dans un an, tu liras "Brochet · 84cm · brume sur l'eau"
              et tu y seras de nouveau.
            </p>
            <p className="text-white/25 text-base font-light">
              Sessions, captures, spots, ressentis. Tout est là.
            </p>
          </motion.div>

          {/* Cards mémoires */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            {MEMORIES.map((mem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="glass rounded-2xl p-5 flex gap-4 items-start"
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ background: mem.color, boxShadow: `0 0 8px ${mem.color}60` }}
                />
                <div>
                  <p className="text-[11px] text-white/30 mb-1">{mem.date}</p>
                  <p className="text-white font-medium text-sm mb-0.5">{mem.title}</p>
                  <p className="text-white/40 text-xs mb-2">{mem.spot}</p>
                  <p className="text-white/25 text-xs italic font-light">{mem.note}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
