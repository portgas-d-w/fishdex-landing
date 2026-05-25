'use client'

import { motion } from 'framer-motion'
import { APP_URL, CONTACT_EMAIL } from '@/lib/constants'

export default function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            Prêt à commencer<br />
            <span className="text-cyan-400">ton journal de pêche ?</span>
          </h2>
          <p className="text-white/35 text-lg font-light mb-10">
            Gratuit pour commencer. Aucune carte bancaire requise.
          </p>

          <motion.a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-10 py-4 rounded-full text-slate-950 font-medium text-base"
            style={{
              background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #0891b2 100%)',
              boxShadow: '0 0 40px rgba(34,211,238,0.25), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Accéder à FishDex
          </motion.a>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white/20 text-sm">© 2025 FishDex. Fait avec passion.</span>
        <div className="flex items-center gap-6">
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-white/20 hover:text-white/50 text-sm transition-colors">
            Contact
          </a>
          <a href="#" className="text-white/20 hover:text-white/50 text-sm transition-colors">
            CGU
          </a>
          <a href="#" className="text-white/20 hover:text-white/50 text-sm transition-colors">
            Confidentialité
          </a>
        </div>
      </div>
    </section>
  )
}
