'use client'

import { motion } from 'framer-motion'
import { APP_URL } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,238,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Brume animée */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none animate-mist"
        style={{
          background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(14,30,55,0.3) 50%, transparent 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs text-cyan-400/80 border border-cyan-400/20"
          style={{ background: 'rgba(34,211,238,0.06)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          92 espèces d'eau douce · France
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6 tracking-tight">
          Le monde vivant<br />
          <span className="text-cyan-400">de la pêche</span>
        </h1>

        <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed mb-12 max-w-xl mx-auto">
          L'encyclopédie vivante des poissons d'eau douce français.
          Journal de sessions, collection de captures, météo intelligente.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full text-slate-950 font-medium text-base transition-all"
            style={{
              background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #0891b2 100%)',
              boxShadow: '0 0 30px rgba(34,211,238,0.3), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            Commencer gratuitement
          </motion.a>
          <a
            href="#features"
            className="px-8 py-4 rounded-full text-white/60 text-base border border-white/10 hover:border-white/20 hover:text-white/80 transition-all"
          >
            Voir les features →
          </a>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 flex items-center justify-center gap-12 text-center"
        >
          {[
            { value: '92', label: 'espèces' },
            { value: '∞', label: 'captures' },
            { value: '0€', label: 'pour commencer' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl font-light text-cyan-400">{stat.value}</div>
              <div className="text-xs text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
