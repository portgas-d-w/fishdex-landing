'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { APP_URL, NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,22,40,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold text-lg tracking-tight">FishDex</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/50 hover:text-white text-sm transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Se connecter
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 rounded-full text-slate-950 font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #67e8f9, #22d3ee)' }}
          >
            Essayer gratuitement
          </a>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-6 pb-6 flex flex-col gap-4"
            style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(20px)' }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white text-base py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center py-3 rounded-full text-slate-950 font-medium text-sm"
              style={{ background: 'linear-gradient(135deg, #67e8f9, #22d3ee)' }}
            >
              Essayer gratuitement
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
