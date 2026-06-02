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
      <div id="foreground-rocks" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
        
        {/* Sol continu (Bank) — Hauteur bloquée à 22vh. 
            Ne grossira plus JAMAIS sur 4K. S'il manque de la largeur, il se répète (repeat-x) pour "voir la suite". */}
        <div style={{
          position: 'absolute',
          bottom: '-6vh', /* Cache le vide transparent avec précision */
          left: 0,
          width: '100vw',
          height: '22vh', 
          backgroundImage: 'url(/assets/ultimate/foreground-bank.png)',
          backgroundSize: 'auto 100%', /* S'ajuste exactement à la hauteur du conteneur */
          backgroundPosition: 'bottom left',
          backgroundRepeat: 'repeat-x', /* La clé pour les grands écrans ! */
        }} />

        {/* Coin gauche — Hauteur augmentée à 48vh pour des roseaux beaucoup plus majestueux. */}
        <div style={{
          position: 'absolute',
          bottom: '-11vh', /* L'offset vertical grandit proportionnellement à la nouvelle hauteur */
          left: '-20vh',   /* L'offset latéral grandit aussi pour rester collé au bord */
          width: '70vw',   /* Plus de largeur pour ne pas couper l'image qui a grossi */
          height: '48vh',
          backgroundImage: 'url(/assets/ultimate/foreground-left.png)',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'bottom left',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Coin droite — Symétrie parfaite ! 
            On utilise l'image GAUCHE, mais on retourne tout le conteneur. 
            L'image va donc pousser de la droite vers la gauche, collée au bord droit ! */}
        <div style={{
          position: 'absolute',
          bottom: '-11vh',
          right: '-20vh', 
          width: '70vw',
          height: '48vh',
          backgroundImage: 'url(/assets/ultimate/foreground-left.png)', /* On réutilise l'image de gauche ! */
          backgroundSize: 'auto 100%',
          backgroundPosition: 'bottom left', 
          backgroundRepeat: 'no-repeat',
          transform: 'scaleX(-1)' /* Crée le miroir parfait */
        }} />
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
