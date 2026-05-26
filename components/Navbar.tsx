'use client'

import { useState, useEffect } from 'react'
import { APP_URL, NAV_LINKS } from '@/lib/constants'

const FishLogo = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <g transform="translate(50,50)">
      <g transform="rotate(0) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".9"/><circle cx="-9" cy="0" r="2.5" fill="#0a1628"/></g>
      <g transform="rotate(120) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".9"/><circle cx="-9" cy="0" r="2.5" fill="#0a1628"/></g>
      <g transform="rotate(240) translate(0,-30)"><ellipse rx="26" ry="13" fill="#22d3ee" opacity=".9"/><circle cx="-9" cy="0" r="2.5" fill="#0a1628"/></g>
    </g>
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '18px 60px' : '28px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 1.2s',
        background: scrolled ? 'rgba(6,13,24,0.6)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        pointerEvents: scrolled ? 'all' : 'none',
      }}
    >
      <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', pointerEvents: 'all' }}>
        <FishLogo />
        <span style={{ fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
          FishDex
        </span>
      </a>

      <nav className="hidden md:flex" style={{ gap: 44 }}>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            style={{
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.8s', pointerEvents: 'all',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href={APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:block"
        style={{
          fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.8s', pointerEvents: 'all',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
      >
        Accéder →
      </a>

      <button
        className="md:hidden"
        onClick={() => setMenuOpen(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', pointerEvents: 'all', color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1 }}
        aria-label="Menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(6,13,24,0.97)', backdropFilter: 'blur(24px)',
            padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#22d3ee', textDecoration: 'none' }}
          >
            Accéder →
          </a>
        </div>
      )}
    </header>
  )
}
