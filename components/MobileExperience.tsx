import React from 'react'
import Image from 'next/image'

/**
 * Flat DOM version of the dive sections.
 *
 * On desktop (with motion enabled) the section content lives inside the WebGL
 * Canvas via HtmlSections.tsx. But Background3D mounts the Canvas ONLY when the
 * viewport is wide enough AND the user hasn't requested reduced motion — so in
 * the mobile / reduced-motion cases the Canvas (and all its content) is absent.
 *
 * This component renders the same content as ordinary, scrollable DOM. It is
 * always present in the markup (good for SEO / first paint) and toggled purely
 * in CSS via `.mobile-experience` so there is no hydration flash:
 *   - hidden by default (desktop + motion → Canvas owns the content)
 *   - shown at <=768px and under prefers-reduced-motion (Canvas is absent)
 *
 * Text is intentionally kept in sync with HtmlSections.tsx. The 3D `translateZ`
 * parallax offsets used there are omitted here — they are meaningless in a flat
 * 2D scroll layout.
 */
export default function MobileExperience() {
  return (
    <div className="mobile-experience">
      {/* CONCEPT */}
      <section className="concept" id="concept-m">
        <div className="section-inner">
          <div className="section-label">L&apos;Expérience</div>
          <div className="concept-grid">
            <div className="concept-visual">
              <div className="concept-visual-bg" />
              <Image
                src="/images/bg/ambiance-pecheur-lever-soleil-brume-doree.png"
                alt="Pêcheur au lever du soleil dans la brume"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="concept-overlay" />
              <div className="concept-caption">
                <div className="concept-caption-tag">Immersion totale</div>
                <div className="concept-caption-text">Un monde vivant,<br />à chaque sortie.</div>
              </div>
            </div>
            <div className="concept-pillars">
              <div className="pillar">
                <div className="pillar-num">01</div>
                <div className="pillar-content">
                  <div className="pillar-title">Découvrir</div>
                  <p className="pillar-body">La truite fario qui remonte le courant. Le sandre tapi dans les herbes. 92 espèces vous attendent — chacune avec une histoire que vous allez écrire.</p>
                </div>
              </div>
              <div className="pillar">
                <div className="pillar-num">02</div>
                <div className="pillar-content">
                  <div className="pillar-title">Capturer</div>
                  <p className="pillar-body">Chaque prise mérite mieux qu&apos;une photo oubliée. FishDex l&apos;enregistre, la géolocalise, la contextualise. Votre collection grandit à chaque sortie.</p>
                </div>
              </div>
              <div className="pillar">
                <div className="pillar-num">03</div>
                <div className="pillar-content">
                  <div className="pillar-title">Revivre</div>
                  <p className="pillar-body">Une session FishDex ne s&apos;efface pas. Elle se rouvre — avec sa météo, sa lumière, ses captures. Comme si vous y étiez encore.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERS VIVANT */}
      <section className="univers" id="univers-m">
        <div className="section-inner">
          <div className="univers-header">
            <div>
              <div className="section-label">L&apos;Univers</div>
              <h2 className="section-title">Un monde qui<br /><em>respire avec vous.</em></h2>
            </div>
            <div>
              <p className="section-body">Une aube brumeuse de printemps n&apos;a rien à voir avec une nuit d&apos;hiver sur le lac. FishDex le sait. Et s&apos;adapte.</p>
            </div>
          </div>
          <div className="univers-cards">
            <div className="univers-card">
              <div className="univers-card-bg dawn" />
              <div className="univers-card-art" style={{ overflow: 'hidden' }}>
                <Image src="/images/bg/background-nature-lac-lever-soleil.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="univers-card-overlay" />
              <div className="univers-card-info">
                <div className="univers-card-season">Printemps · Aube</div>
                <div className="univers-card-name">La brume du matin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSIONS */}
      <section className="sessions" id="sessions-m">
        <div className="section-inner">
          <div className="section-label">Sessions</div>
          <h2 className="section-title">Une sortie devient<br /><em>un souvenir.</em></h2>
          <div className="sessions-layout">
            <div className="sessions-timeline">
              <div className="timeline-line" />
              <div className="timeline-entry visible">
                <div className="timeline-dot" />
                <div className="timeline-time">05:42 — Lever du soleil</div>
                <div className="timeline-title">Arrivée sur site</div>
              </div>
            </div>
            <div className="sessions-visual">
              <div style={{ position: 'relative', aspectRatio: '3/4', maxWidth: '340px', margin: '0 auto' }}>
                <Image src="/images/mockups/session-phone-mockup.png" alt="" fill sizes="340px" style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPÈCES */}
      <section className="especes" id="especes-m">
        <div className="section-inner">
          <div className="especes-header">
            <div className="especes-count-display">92</div>
            <div className="section-label" style={{ justifyContent: 'center' }}>Espèces</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Un musée vivant<br />dans votre poche.</h2>
            <p className="section-body" style={{ textAlign: 'center', margin: '0 auto 60px' }}>De la truite fario au silure géant — 92 espèces vous attendent.</p>
          </div>
          <div className="especes-grid">
            <div className="espece-cell">
              <div className="espece-cell-bg">
                <Image src="/images/bg/background-eaux-vives.png" alt="" fill sizes="(max-width: 480px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                <Image src="/images/fishes/truite-fario.png" alt="Truite fario" fill sizes="(max-width: 480px) 50vw, 33vw" style={{ objectFit: 'contain', padding: '10px' }} />
              </div>
              <div className="espece-cell-name">Truite fario</div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM */}
      <section className="premium" id="premium-m">
        <div className="section-inner">
          <div className="premium-layout">
            <div>
              <div className="section-label">Premium</div>
              <h2 className="section-title">Gratuit et<br /><em>généreux.</em></h2>
              <p className="section-body" style={{ marginBottom: '40px' }}>FishDex est gratuit, vraiment. Le premium va plus loin — il ne vous retient pas derrière un mur.</p>
            </div>
            <div className="premium-plans">
              <div className="premium-plan featured">
                <div className="plan-badge">✦ Pro</div>
                <div className="plan-name">Pro</div>
                <p className="plan-desc">Pour celui qui pêche souvent, observe beaucoup et veut garder une trace de tout.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final" id="beta-m">
        <div className="cta-final-content">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '32px' }}>Commencer l&apos;aventure</div>
          <div className="cta-final-quote">
            Combien d&apos;espèces vous manque-t-il ?
          </div>
          <p className="cta-final-sub">
            La bêta est ouverte. Gratuit, pour toujours. Il ne manque que vous.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://app.fishdex.fr" className="btn-primary" style={{ fontSize: '1rem', padding: '18px 42px' }} target="_blank" rel="noopener noreferrer">
              Rejoindre la bêta
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
