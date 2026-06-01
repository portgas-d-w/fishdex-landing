'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const Background3D = dynamic(() => import('../components/Background3D'), { ssr: false })
import Navigation from '../components/Navigation'

export default function Home() {
  useEffect(() => {
    // Nav scroll
    const navbar = document.getElementById('navbar')
    const handleNavScroll = () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true })

    // Timeline reveal
    const timelineEntries = document.querySelectorAll('.timeline-entry')
    const timelineObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 150)
      })
    }, { threshold: 0.2 })
    timelineEntries.forEach(el => timelineObserver.observe(el))

    // Species count animation
    const animateCount = (el: HTMLElement, target: number, duration = 2000) => {
      let start = 0
      const step = (ts: number) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 4)
        el.textContent = String(Math.floor(ease * target))
        if (progress < 1) requestAnimationFrame(step)
        else el.textContent = String(target)
      }
      requestAnimationFrame(step)
    }
    const countEl = document.querySelector('.especes-count-display') as HTMLElement
    if (countEl) {
      const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { animateCount(countEl, 92); countObserver.unobserve(entry.target) }
        })
      }, { threshold: 0.3 })
      countObserver.observe(countEl)
    }

    // Smooth anchor scroll
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    const handleAnchorClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement
      const href = link.getAttribute('href')
      const target = href ? document.querySelector(href) : null
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    }
    anchorLinks.forEach(a => a.addEventListener('click', handleAnchorClick))

    // Pillar hover
    const pillars = document.querySelectorAll('.pillar') as NodeListOf<HTMLElement>
    pillars.forEach(pillar => {
      pillar.addEventListener('mouseenter', () => { pillar.style.paddingLeft = '12px'; pillar.style.borderLeft = '2px solid rgba(143,191,163,0.4)' })
      pillar.addEventListener('mouseleave', () => { pillar.style.paddingLeft = '0'; pillar.style.borderLeft = 'none' })
    })

    // Fade the lakeside hero out as the dive begins (gone by ~10% of scroll).
    const hero = document.getElementById('dive-hero')
    let heroRaf = 0
    const fadeHero = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (hero) {
        const o = Math.max(0, 1 - p / 0.10)
        hero.style.opacity = String(o)
        hero.style.pointerEvents = o < 0.05 ? 'none' : 'auto'
      }
      heroRaf = requestAnimationFrame(fadeHero)
    }
    heroRaf = requestAnimationFrame(fadeHero)

    return () => {
      window.removeEventListener('scroll', handleNavScroll)
      timelineObserver.disconnect()
      cancelAnimationFrame(heroRaf)
    }
  }, [])

  return (
    <>
      {/* 3D Canvas — sits behind everything, revealed when portal scrolls away */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
        <Background3D />
      </div>

      <Navigation />

      {/* HERO — bord du lac, overlay fixe par-dessus le canvas (se fond à la plongée) */}
      <div id="dive-hero" className="dive-hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Bêta ouverte · 2026
        </div>
        <h1 className="hero-title">
          Complétez votre FishDex.
        </h1>
        <p className="hero-subtitle">
          Identifiez. Collectionnez. Revivez. L&apos;application qui transforme chaque sortie en expédition.
        </p>
        <div className="hero-ctas">
          <a href="https://app.fishdex.fr" className="btn-primary" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Rejoindre la bêta
          </a>
          <a href="#explore" className="btn-secondary">
            Découvrir FishDex <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
        <div className="hero-scroll-hint"><span>Plonger</span><div className="hero-scroll-line" /></div>
      </div>

      {/* SPACER — fabrique la distance de scroll (≈ 8 segments) ; le visuel est le canvas fixe */}
      <div id="dive-scroll" className="dive-scroll-spacer" aria-hidden="true" />

      {/* NAV */}
      <nav id="navbar">
        <a href="#" className="nav-logo">
          <img src="/logo.svg" alt="FishDex" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
          FishDex
          <span className="nav-logo-dot" />
        </a>
        <ul className="nav-links">
          <li><a href="#concept">L&apos;univers</a></li>
          <li><a href="#especes">Espèces</a></li>
          <li><a href="#sessions">Sessions</a></li>
          <li><a href="#premium">Premium</a></li>
          <li><a href="https://app.fishdex.fr" className="nav-cta" target="_blank" rel="noopener noreferrer">Rejoindre la bêta</a></li>
        </ul>
        <div className="nav-burger" id="navBurger">
          <span /><span /><span />
        </div>
      </nav>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/logo.svg" alt="FishDex" style={{ height: '36px', width: '36px', objectFit: 'contain', verticalAlign: 'middle', marginRight: '8px' }} />
            FishDex
          </div>
          <ul className="footer-links">
            <li><a href="#">Confidentialité</a></li>
            <li><a href="#">Conditions</a></li>
            <li><a href="https://instagram.com/FishDex.fr" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="mailto:hello@fishdex.fr">Contact</a></li>
          </ul>
          <div className="footer-copy">© 2026 FishDex · Tous droits réservés</div>
        </div>
      </footer>
    </>
  )
}
