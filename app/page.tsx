'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Background3D from '../components/Background3D'
import Navigation from '../components/Navigation'
import MobileExperience from '../components/MobileExperience'

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

    // Floating particles
    const container = document.getElementById('heroParticles')
    if (container) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        const size = Math.random() * 3 + 1
        const x = Math.random() * 100
        const dur = Math.random() * 8 + 6
        const delay = Math.random() * 10
        const op = Math.random() * 0.3 + 0.1
        p.style.cssText = `left:${x}%;bottom:${Math.random() * 30 + 5}%;width:${size}px;height:${size}px;`
        p.style.setProperty('--dur', dur + 's')
        p.style.setProperty('--delay', '-' + delay + 's')
        p.style.setProperty('--op', String(op))
        container.appendChild(p)
      }
    }

    // Hero parallax & cinematic fade
    let ticking = false
    const heroContent = document.querySelector('.hero-content') as HTMLElement
    
    // Listen for the bite start to fade out hero
    import('../components/canvas/useScrollProgress').then(({ cinematicEvents }) => {
      cinematicEvents.addEventListener('bite_start', () => {
        if (heroContent) {
          heroContent.style.transition = 'opacity 0.2s ease-out';
          heroContent.style.opacity = '0';
          heroContent.style.pointerEvents = 'none';
        }
      });
      cinematicEvents.addEventListener('surface_return', () => {
        if (heroContent) {
          heroContent.style.transition = 'opacity 0.8s ease-in';
          heroContent.style.opacity = '1';
          heroContent.style.pointerEvents = 'auto';
        }
      });
      cinematicEvents.addEventListener('water_impact', () => {
        const flash = document.getElementById('water-flash');
        if (flash) {
          flash.style.transition = 'none';
          flash.style.opacity = '0.4';
          setTimeout(() => {
            flash.style.transition = 'opacity 0.4s ease-out';
            flash.style.opacity = '0';
          }, 20);
        }
      });
    });

    const handleParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY
          if (heroContent && heroContent.style.opacity !== '0') {
            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleParallax, { passive: true })

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
      window.removeEventListener('scroll', handleNavScroll)
      window.removeEventListener('scroll', handleParallax)
      timelineObserver.disconnect()
    }
  }, [])

  return (
    <>
      <Background3D />
      <Navigation />

      {/* FLASH DE PLONGEON */}
      <div id="water-flash" className="pointer-events-none fixed inset-0 z-[9999] bg-white opacity-0 transition-opacity duration-300" />

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

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg" style={{ background: 'transparent' }}>
          {/* Static image replaced by 3D background */}
        </div>
        <div className="hero-particles" id="heroParticles" />
        <div className="hero-content" style={{ opacity: 1, transition: 'opacity 0.2s ease-out' }}>
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
            <a href="#concept" className="btn-secondary">
              Découvrir FishDex <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Explorer</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Desktop (+ motion): sections render inside the Canvas via HtmlSections.tsx.
          Mobile / reduced-motion: the Canvas is absent, so this flat DOM version
          takes over (toggled in CSS via .mobile-experience). */}
      

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
