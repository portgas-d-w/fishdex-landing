'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const Background3D = dynamic(() => import('../components/Background3D'), { ssr: false })
import Navigation from '../components/Navigation'

export default function Home() {
  useEffect(() => {
    // Nav scroll & Rocks Parallax
    const navbar = document.getElementById('navbar')
    const rocks = document.getElementById('foreground-rocks')
    const handleScroll = () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 60)
      if (rocks) {
        // Calcule un pourcentage d'avancement sur les 500 premiers pixels
        const p = Math.min(window.scrollY / 500, 1)
        // Les rochers grossissent (se rapprochent), s'écartent vers le bas et disparaissent
        rocks.style.transform = `scale(${1 + p * 1.5}) translateY(${p * 100}px)`
        rocks.style.opacity = String(1 - Math.pow(p, 1.5))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

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

    return () => {
      window.removeEventListener('scroll', handleScroll)
      timelineObserver.disconnect()
    }
  }, [])

  return (
    <>
      {/* 3D Canvas — sits behind everything, revealed when portal scrolls away */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
        <Background3D />
      </div>

      <Navigation />

      {/* Hero HTML détruit — l'entrée est désormais la transition physique de surface d'eau (3D) */}
      
      {/* Foreground Framing (Rocks) pour la perspective de surplomb (scroll up au plongeon) */}
      <div id="foreground-rocks" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', pointerEvents: 'none', zIndex: 10, transformOrigin: 'bottom center' }}>
        
        {/* Sol rocheux continu (connecte la gauche et la droite, révèle l'espace quand on agrandit) */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: '15vh' }}>
          <svg preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} viewBox="0 0 1000 100">
             <path d="M0 100 L0 40 Q250 20 500 50 T1000 30 L1000 100 Z" fill="#040a10"/>
             <path d="M0 100 L0 70 Q250 60 500 80 T1000 60 L1000 100 Z" fill="#020406"/>
           </svg>
        </div>

        {/* Rocher haut bas gauche (Ne s'étire pas, garde son ratio) */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, height: '40vh', width: 'auto', aspectRatio: '1.2/1' }}>
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMinYMax meet" style={{ width: '100%', height: '100%' }}>
            <path d="M0 300 L0 50 Q100 80 200 150 Q250 200 350 280 L400 300 Z" fill="#040a10"/>
            <path d="M0 300 L0 100 Q80 130 150 200 Q200 240 300 300 Z" fill="#020406"/>
          </svg>
        </div>

        {/* Rocher haut bas droite (Ne s'étire pas, garde son ratio) */}
        <div style={{ position: 'absolute', bottom: -2, right: 0, height: '40vh', width: 'auto', aspectRatio: '1.2/1' }}>
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax meet" style={{ width: '100%', height: '100%' }}>
            <path d="M400 300 L400 50 Q300 80 200 150 Q150 200 50 280 L0 300 Z" fill="#040a10"/>
            <path d="M400 300 L400 100 Q320 130 250 200 Q200 240 100 300 Z" fill="#020406"/>
          </svg>
        </div>
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
