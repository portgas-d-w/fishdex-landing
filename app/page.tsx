'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  useEffect(() => {
    // Nav scroll
    const navbar = document.getElementById('navbar')
    const handleNavScroll = () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true })

    // Custom cursor
    const cursor = document.getElementById('cursor')
    const ring = document.getElementById('cursorRing')
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0
    let animId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px' }
    }
    document.addEventListener('mousemove', handleMouseMove)

    const interactives = document.querySelectorAll('a, button, .pillar, .univers-card, .espece-cell, .gallery-item, .premium-plan')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => ring?.classList.add('hovering'))
      el.addEventListener('mouseleave', () => ring?.classList.remove('hovering'))
    })

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px' }
      animId = requestAnimationFrame(animateRing)
    }
    animateRing()

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    revealEls.forEach(el => observer.observe(el))

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

    // Hero parallax
    let ticking = false
    const handleParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY
          const heroContent = document.querySelector('.hero-content') as HTMLElement
          if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.15}px)`
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

    // Burger menu mobile
    const burger = document.getElementById('navBurger')
    const navLinks = document.querySelector('.nav-links') as HTMLElement | null
    const handleBurger = () => {
      navLinks?.classList.toggle('open')
      burger?.classList.toggle('open')
    }
    burger?.addEventListener('click', handleBurger)
    // Ferme le menu au clic sur un lien
    navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open')
      burger?.classList.remove('open')
    }))

    return () => {
      window.removeEventListener('scroll', handleNavScroll)
      window.removeEventListener('scroll', handleParallax)
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
      observer.disconnect()
      timelineObserver.disconnect()
    }
  }, [])

  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />

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
        <div className="hero-bg">
          <Image
            src="/images/bg/hero-background.png"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.45 }}
          />
        </div>
        <div className="hero-particles" id="heroParticles" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Bêta ouverte · 2026
          </div>
          <h1 className="hero-title">
            Chaque poisson<br /><em>raconte une histoire.</em>
          </h1>
          <p className="hero-subtitle">
            Transformez vos sorties pêche en souvenirs vivants. Découvrez, capturez, revivez — dans un univers influencé par la météo, les saisons et la lumière naturelle.
          </p>
          <div className="hero-ctas">
            <a href="https://app.fishdex.fr" className="btn-primary" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M6 8l2 2 2.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Rejoindre la bêta
            </a>
            <a href="#concept" className="btn-secondary">
              Découvrir FishDex
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Explorer</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="intro-strip">
        <div className="section-inner">
          <div className="intro-stat reveal">
            <div className="intro-stat-num">92</div>
            <div className="intro-stat-label">Espèces à découvrir</div>
          </div>
          <div className="intro-stat reveal reveal-delay-1">
            <div className="intro-stat-num">4</div>
            <div className="intro-stat-label">Saisons vivantes</div>
          </div>
          <div className="intro-stat reveal reveal-delay-2">
            <div className="intro-stat-num">∞</div>
            <div className="intro-stat-label">Souvenirs à créer</div>
          </div>
        </div>
      </div>

      {/* CONCEPT */}
      <section className="concept" id="concept">
        <div className="section-inner">
          <div className="section-label reveal">L&apos;Expérience</div>
          <div className="concept-grid">
            <div className="concept-visual reveal">
              <div className="concept-visual-bg" />
              <Image
                src="/images/bg/ambiance-pecheur-lever-soleil-brume-doree.png"
                alt="Pêcheur au lever du soleil dans la brume"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="concept-overlay" />
              <div className="concept-caption">
                <div className="concept-caption-tag">Immersion totale</div>
                <div className="concept-caption-text">Un monde vivant,<br />à chaque sortie.</div>
              </div>
            </div>
            <div className="concept-pillars">
              <div className="pillar reveal">
                <div className="pillar-num">01</div>
                <div className="pillar-content">
                  <div className="pillar-title">Découvrir</div>
                  <p className="pillar-body">92 espèces de poissons à identifier et à collecter. Chaque capture révèle une fiche vivante : comportement, habitat, saison. Un musée naturel dans votre poche.</p>
                </div>
                <div className="pillar-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="#8FBFA3" strokeWidth="1.2" /><path d="M13 13l3.5 3.5" stroke="#8FBFA3" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </div>
              </div>
              <div className="pillar reveal reveal-delay-1">
                <div className="pillar-num">02</div>
                <div className="pillar-content">
                  <div className="pillar-title">Capturer</div>
                  <p className="pillar-body">Photographiez, enregistrez, géolocalisez. Chaque prise devient une entrée dans votre FishDex personnel — horodatée, contextualisée, inoubliable.</p>
                </div>
                <div className="pillar-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="11" rx="2" stroke="#8FBFA3" strokeWidth="1.2" /><circle cx="10" cy="10.5" r="2.5" stroke="#8FBFA3" strokeWidth="1.2" /><path d="M7 5l1-2h4l1 2" stroke="#8FBFA3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div className="pillar reveal reveal-delay-2">
                <div className="pillar-num">03</div>
                <div className="pillar-content">
                  <div className="pillar-title">Revivre</div>
                  <p className="pillar-body">Vos sessions deviennent des récits. Une galerie immersive reconstruit chaque sortie — météo, lumière, captures, émotions. Des souvenirs qui durent.</p>
                </div>
                <div className="pillar-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10a6 6 0 1012 0A6 6 0 004 10z" stroke="#8FBFA3" strokeWidth="1.2" /><path d="M10 7v3l2 2" stroke="#8FBFA3" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERS VIVANT */}
      <section className="univers" id="univers">
        <div className="section-inner">
          <div className="univers-header">
            <div>
              <div className="section-label reveal">L&apos;Univers</div>
              <h2 className="section-title reveal reveal-delay-1">Un monde qui<br /><em>respire avec vous.</em></h2>
            </div>
            <div>
              <p className="section-body reveal reveal-delay-2">FishDex évolue avec la météo, les saisons et la lumière du jour. L&apos;interface s&apos;adapte à votre environnement réel — du brumeux matin d&apos;automne au coucher de soleil d&apos;été.</p>
            </div>
          </div>
          <div className="univers-cards">
            <div className="univers-card reveal">
              <div className="univers-card-bg dawn" />
              <div className="univers-card-art" style={{ overflow: 'hidden' }}>
                <Image
                  src="/images/bg/background-nature-lac-lever-soleil.png"
                  alt="Lac au lever du soleil"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="univers-card-overlay" />
              <div className="univers-card-info">
                <div className="univers-card-season">Printemps · Aube</div>
                <div className="univers-card-name">La brume du matin</div>
              </div>
            </div>
            <div className="univers-card reveal reveal-delay-1">
              <div className="univers-card-bg storm" />
              <div className="univers-card-art" style={{ overflow: 'hidden' }}>
                <Image
                  src="/images/bg/background-nature-lac-orage-pluie.png"
                  alt="Lac sous l'orage"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="univers-card-overlay" />
              <div className="univers-card-info">
                <div className="univers-card-season">Automne · Orage</div>
                <div className="univers-card-name">L&apos;électricité de l&apos;air</div>
              </div>
            </div>
            <div className="univers-card reveal reveal-delay-2">
              <div className="univers-card-bg golden" />
              <div className="univers-card-art" style={{ overflow: 'hidden' }}>
                <Image
                  src="/images/bg/background-nature-coucher-soleil-brume.png"
                  alt="Coucher de soleil brumeux"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="univers-card-overlay" />
              <div className="univers-card-info">
                <div className="univers-card-season">Été · Coucher de soleil</div>
                <div className="univers-card-name">L&apos;heure dorée</div>
              </div>
            </div>
            <div className="univers-card reveal reveal-delay-3">
              <div className="univers-card-bg night" />
              <div className="univers-card-art" style={{ overflow: 'hidden' }}>
                <Image
                  src="/images/bg/background-nature-lac-nuit-lune.png"
                  alt="Lac la nuit sous la lune"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="univers-card-overlay" />
              <div className="univers-card-info">
                <div className="univers-card-season">Hiver · Nuit</div>
                <div className="univers-card-name">Le silence de l&apos;eau</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSIONS */}
      <section className="sessions" id="sessions">
        <div className="section-inner">
          <div className="section-label reveal">Sessions</div>
          <h2 className="section-title reveal reveal-delay-1">Une sortie devient<br /><em>un souvenir.</em></h2>
          <div className="sessions-layout">
            <div className="sessions-timeline">
              <div className="timeline-line" />
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-time">05:42 — Lever du soleil</div>
                <div className="timeline-title">Arrivée sur site</div>
                <p className="timeline-desc">L&apos;application détecte l&apos;aube. L&apos;interface bascule en mode aurore — lumière chaude, brume visuelle. La journée commence.</p>
              </div>
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-time">07:18 — Brise légère</div>
                <div className="timeline-title">Première capture</div>
                <p className="timeline-desc">Un gardon de 28 cm. FishDex l&apos;identifie, l&apos;enregistre, le géolocalise. Votre FishDex s&apos;enrichit. Un badge se débloque.</p>
              </div>
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-time">09:55 — Soleil haut</div>
                <div className="timeline-title">Découverte rare</div>
                <p className="timeline-desc">Une brème commune — votre 14ème espèce. L&apos;application vibre doucement. Une animation rare se déploie. Moment de grâce.</p>
              </div>
              <div className="timeline-entry">
                <div className="timeline-dot" />
                <div className="timeline-time">12:40 — Fin de session</div>
                <div className="timeline-title">Le souvenir se crée</div>
                <p className="timeline-desc">FishDex compile automatiquement votre session : carte du lieu, météo, captures, moments. Un journal vivant, prêt à être revécu.</p>
              </div>
            </div>
            <div className="sessions-visual reveal">
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '9/16', maxWidth: '280px', margin: '0 auto', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(143,191,163,0.12)' }}>
                <Image
                  src="/images/mockups/session-phone-mockup.png"
                  alt="Session FishDex sur téléphone"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPÈCES */}
      <section className="especes" id="especes">
        <div className="section-inner">
          <div className="especes-header">
            <div className="especes-count-display reveal">92</div>
            <div className="section-label reveal" style={{ justifyContent: 'center' }}>Espèces</div>
            <h2 className="section-title reveal reveal-delay-1" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 16px' }}>Un musée vivant<br />dans votre poche.</h2>
            <p className="section-body reveal reveal-delay-2" style={{ textAlign: 'center', margin: '0 auto 60px', maxWidth: '480px' }}>De la truite fario au silure géant — chaque espèce vous attend. Biologie, comportement, records, habitats. Une encyclopédie que vous construisez capture après capture.</p>
          </div>
          <div className="especes-grid">
            {[
              { name: 'Truite fario',     img: '/images/fishes/truite-fario.png',    bg: '/images/bg/background-eaux-vives.png' },
              { name: 'Perche commune',   img: '/images/fishes/perche.png',           bg: '/images/bg/background-predateurs.png' },
              { name: 'Carpe commune',    img: '/images/fishes/carpe-commune.png',    bg: '/images/bg/background-paisibles.png' },
              { name: 'Brochet',          img: '/images/fishes/brochet.png',          bg: '/images/bg/background-predateurs.png' },
              { name: 'Sandre',           img: '/images/fishes/sandre.png',           bg: '/images/bg/background-predateurs.png' },
              { name: 'Brème commune',    img: '/images/fishes/breme-commune.png',    bg: '/images/bg/background-paisibles.png' },
              { name: 'Gardon',           img: '/images/fishes/gardon.png',           bg: '/images/bg/background-paisibles.png' },
              { name: 'Silure glane',     img: '/images/fishes/silure-glane.png',     bg: '/images/bg/background-predateurs.png' },
              { name: 'Tanche',           img: '/images/fishes/tanche.png',           bg: '/images/bg/background-paisibles.png' },
              { name: 'Black-bass',       img: '/images/fishes/black-bass.png',       bg: '/images/bg/background-predateurs.png' },
              { name: 'Ablette',          img: '/images/fishes/ablette.png',          bg: '/images/bg/background-paisibles.png' },
              { name: 'Saumon atlantique',img: '/images/fishes/saumon-atlantique.png',bg: '/images/bg/background-eaux-vives.png' },
            ].map((fish, i) => (
              <div key={i} className={`espece-cell reveal${i % 4 === 1 ? ' reveal-delay-1' : i % 4 === 2 ? ' reveal-delay-2' : i % 4 === 3 ? ' reveal-delay-3' : ''}`} style={{ transitionDelay: `${(i % 4) * 0.15}s` }}>
                <div className="espece-cell-bg">
                  <Image src={fish.bg} alt="" fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 1 }} />
                  <Image
                    src={fish.img}
                    alt={fish.name}
                    fill
                    style={{ objectFit: 'contain', padding: '10px', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.9))', zIndex: 2 }}
                  />
                </div>
                <div className="espece-cell-overlay" />
                <div className="espece-cell-name">{fish.name}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <a href="#beta" className="btn-secondary reveal">Explorer toutes les espèces →</a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery" id="gallery">
        <div className="section-inner">
          <div className="gallery-header">
            <div>
              <div className="section-label reveal">Galerie</div>
              <h2 className="section-title reveal reveal-delay-1">Des moments<br /><em>qui durent.</em></h2>
            </div>
            <p className="section-body reveal reveal-delay-2" style={{ maxWidth: '360px' }}>Chaque sortie, chaque capture, chaque lever de soleil sur l&apos;eau — votre vie de pêcheur en images.</p>
          </div>
          <div className="gallery-mosaic">
            {[
              { src: '/images/bg/galerie-prise-01-brochet-bateau-aube.png', alt: 'Pêcheur en bateau tenant un brochet à l\'aube', cls: 'gi-1' },
              { src: '/images/bg/galerie-prise-02-breme-mains.png', alt: 'Mains tenant une brème', cls: 'gi-2' },
              { src: '/images/bg/galerie-prise-03-pecheuse-coucher-soleil.png', alt: 'Pêcheuse de dos au coucher de soleil', cls: 'gi-3' },
              { src: '/images/bg/galerie-prise-04-carpe-sous-marin.png', alt: 'Carpe vue depuis sous l\'eau', cls: 'gi-4' },
              { src: '/images/bg/galerie-prise-05-pecheur-orage.png', alt: 'Pêcheur sous l\'orage', cls: 'gi-5' },
              { src: '/images/bg/galerie-prise-06-lancer-silhouette.png', alt: 'Silhouette d\'un lancer au coucher de soleil', cls: 'gi-6' },
              { src: '/images/new/ambiance-main-brochet-coucher-soleil.png', alt: 'Mains tenant une truite', cls: 'gi-7' },
              { src: '/images/bg/galerie-prise-08-relacher-carpe-panorama.png', alt: 'Relâcher une carpe dans l\'eau', cls: 'gi-8' },
            ].map((item, i) => (
              <div key={i} className="gallery-item">
                <div className={`gallery-item-bg ${item.cls}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div className="gallery-item-overlay" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM */}
      <section className="premium" id="premium">
        <div className="section-inner">
          <div className="premium-layout">
            <div>
              <div className="section-label reveal">Premium</div>
              <h2 className="section-title reveal reveal-delay-1">Gratuit et<br /><em>généreux.</em></h2>
              <p className="section-body reveal reveal-delay-2" style={{ marginBottom: '40px' }}>FishDex est conçu pour être profondément utile dans sa version gratuite. Le premium enrichit l&apos;expérience — il ne la conditionne pas.</p>
              <a href="https://app.fishdex.fr" className="btn-primary reveal reveal-delay-3" target="_blank" rel="noopener noreferrer">Commencer gratuitement</a>
            </div>
            <div className="premium-plans">
              <div className="premium-plan reveal">
                <div className="plan-badge">Gratuit · Pour toujours</div>
                <div className="plan-name">Gratuit</div>
                <p className="plan-desc">L&apos;essentiel pour découvrir et capturer vos premières espèces.</p>
                <ul className="plan-features">
                  <li>Toutes les espèces à découvrir</li>
                  <li>Captures et sessions limitées</li>
                  <li>FishDex personnel</li>
                  <li>Badges et niveaux</li>
                  <li>Wrapped annuel</li>
                </ul>
              </div>
              <div className="premium-plan featured reveal reveal-delay-1">
                <div className="plan-badge">✦ Pro</div>
                <div className="plan-name">Pro</div>
                <p className="plan-desc">Pour le pêcheur qui veut aller plus loin dans le suivi et l&apos;analyse.</p>
                <ul className="plan-features">
                  <li>Tout Gratuit inclus</li>
                  <li>Compteur taille / poids automatique</li>
                  <li>Estimation de taille par photo</li>
                  <li>Statistiques avancées et graphiques</li>
                  <li>Export PDF et image des sessions</li>
                  <li>Spots avancés</li>
                  <li>Notifications météo intelligentes</li>
                  <li>Wrapped accessible toute l&apos;année</li>
                </ul>
              </div>
              <div className="premium-plan reveal reveal-delay-2">
                <div className="plan-badge">★ Légende</div>
                <div className="plan-name">Légende</div>
                <p className="plan-desc">L&apos;expérience ultime pour les passionnés les plus exigeants.</p>
                <ul className="plan-features">
                  <li>Tout Pro inclus</li>
                  <li>Carte interactive de tous les spots</li>
                  <li>Analyse prédictive des conditions</li>
                  <li>Journal mood / humeur FishLog</li>
                  <li>Support prioritaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="community" id="community" style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src="/images/bg/community-bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.18, zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--bg-deep) 0%, transparent 30%, transparent 70%, var(--bg-deep) 100%)', zIndex: 1 }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 2 }}>
          <div className="community-inner">
            <div className="section-label reveal" style={{ justifyContent: 'center' }}>Communauté</div>
            <h2 className="section-title reveal reveal-delay-1" style={{ textAlign: 'center' }}>Rejoignez la<br /><em>communauté.</em></h2>
            <p className="section-body reveal reveal-delay-2" style={{ textAlign: 'center', margin: '0 auto' }}>Des passionnés de pêche et de nature, unis par l&apos;amour de l&apos;eau et de la découverte. Partagez vos captures, inspirez et soyez inspiré.</p>
            <div style={{ textAlign: 'center' }}>
              <a href="https://instagram.com/FishDex.fr" className="community-instagram reveal reveal-delay-3" target="_blank" rel="noopener noreferrer">
                <div className="ig-icon">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="3" stroke="white" strokeWidth="1.2" /><circle cx="6" cy="6" r="2.5" stroke="white" strokeWidth="1.2" /><circle cx="9" cy="3" r="0.8" fill="white" /></svg>
                </div>
                @FishDex.fr · Instagram
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final" id="beta">
        <div className="cta-final-bg">
          <Image
            src="/images/bg/cta-water-bg.png"
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.25 }}
          />
        </div>
        <div className="cta-final-content">
          <div className="section-label reveal" style={{ justifyContent: 'center', marginBottom: '32px' }}>Commencer l&apos;aventure</div>
          <div className="cta-final-quote reveal reveal-delay-1">
            Votre premier poisson<br />mérite d&apos;être <em>inoubliable.</em>
          </div>
          <p className="cta-final-sub reveal reveal-delay-2">
            Rejoignez la bêta FishDex et soyez parmi les premiers à vivre cette nouvelle façon d&apos;explorer la pêche. Gratuit, pour toujours.
          </p>
          <p className="cta-final-sub reveal reveal-delay-2" style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '-8px' }}>
            Pour accéder à la bêta, suivez <a href="https://instagram.com/FishDex.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>@FishDex.fr</a> sur Instagram et envoyez-nous un message privé.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} className="reveal reveal-delay-3">
            <a href="https://app.fishdex.fr" className="btn-primary" style={{ fontSize: '1rem', padding: '18px 42px' }} target="_blank" rel="noopener noreferrer">
              Rejoindre la bêta
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a href="https://instagram.com/FishDex.fr" className="btn-secondary" target="_blank" rel="noopener noreferrer">
              Suivre sur Instagram
            </a>
          </div>
        </div>
      </section>

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
