"use client";

import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import Image from 'next/image';
import { cinematicEvents, SECTION_Z_POSITIONS } from '../useScrollProgress';
import { Search, Camera, Clock, CheckCircle2, ChevronRight, Check } from 'lucide-react';

function HtmlSection({ index, children, distanceFactor = 30, z = SECTION_Z_POSITIONS[index] }: { index: number, children: React.ReactNode, distanceFactor?: number, z?: number }) {
  const isInitialActive = index === 0;
  const [visible, setVisible] = useState(isInitialActive);
  const [active, setActive] = useState(isInitialActive);

  useEffect(() => {
    const handleLeave = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.index === index) {
        setActive(false);
        setTimeout(() => setVisible(false), 300);
      }
    };

    const handleEnter = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.index === index) {
        setVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setActive(true);
          });
        });
      }
    };

    cinematicEvents.addEventListener('section_leave', handleLeave);
    cinematicEvents.addEventListener('section_enter', handleEnter);

    return () => {
      cinematicEvents.removeEventListener('section_leave', handleLeave);
      cinematicEvents.removeEventListener('section_enter', handleEnter);
    };
  }, [index]);

  if (!visible) return null;

  const wrapperStyle = {
    pointerEvents: 'auto' as const,
    opacity: active ? 1 : 0,
    transform: active ? 'translateY(0) translateZ(0)' : 'translateY(20px) translateZ(-15px)',
    transition: active 
      ? 'opacity 0.7s ease, transform 1s cubic-bezier(0.2, 1, 0.3, 1)' 
      : 'opacity 0.3s ease, transform 0.3s ease',
  };

  return (
    <group position={[0, 0, z]}>
      <Html transform sprite center distanceFactor={distanceFactor} style={{ width: '100vw', pointerEvents: 'none' }}>
        <div style={wrapperStyle}>
          {children}
        </div>
      </Html>
    </group>
  );
}

export default function HtmlSections() {
  return (
    <group>
      {/* 1: CONCEPT / L'EXPÉRIENCE */}
      <HtmlSection index={1}>
        <section className="concept" id="concept">
          <div className="section-inner">
            <div className="section-label" style={{ transform: 'translateZ(-25px)' }}>L'Expérience</div>
            <div className="concept-grid">
              <div className="concept-visual">
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
              <div className="concept-pillars" style={{ transform: 'translateZ(15px)' }}>
                <div className="pillar">
                  <div className="pillar-num">01</div>
                  <div className="pillar-content">
                    <div className="pillar-title">Découvrir</div>
                    <p className="pillar-body">La truite fario qui remonte le courant. Le sandre tapi dans les herbes. 92 espèces vous attendent — chacune avec une histoire que vous allez écrire.</p>
                  </div>
                  <div className="pillar-icon"><Search size={20} color="var(--accent-sage)" /></div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">02</div>
                  <div className="pillar-content">
                    <div className="pillar-title">Capturer</div>
                    <p className="pillar-body">Chaque prise mérite mieux qu'une photo oubliée. FishDex l'enregistre, la géolocalise, la contextualise. Votre collection grandit à chaque sortie.</p>
                  </div>
                  <div className="pillar-icon"><Camera size={20} color="var(--accent-sage)" /></div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">03</div>
                  <div className="pillar-content">
                    <div className="pillar-title">Revivre</div>
                    <p className="pillar-body">Une session FishDex ne s'efface pas. Elle se rouvre — avec sa météo, sa lumière, ses captures. Comme si vous y étiez encore.</p>
                  </div>
                  <div className="pillar-icon"><Clock size={20} color="var(--accent-sage)" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HtmlSection>

      {/* 2: UNIVERS VIVANT */}
      <HtmlSection index={2}>
        <section className="univers" id="univers">
          <div className="section-inner">
            <div className="univers-header">
              <div style={{ transform: 'translateZ(15px)' }}>
                <div className="section-label" style={{ transform: 'translateZ(-25px)' }}>L'Univers</div>
                <h2 className="section-title">Un monde qui<br /><em>respire avec vous.</em></h2>
              </div>
              <div>
                <p className="section-body" style={{ marginTop: '40px' }}>Une aube brumeuse de printemps n'a rien à voir avec une nuit d'hiver sur le lac. FishDex le sait. Et s'adapte.</p>
              </div>
            </div>
            <div className="univers-cards">
              <div className="univers-card">
                <Image src="/images/bg/background-nature-lac-lever-soleil.png" alt="Printemps" fill style={{ objectFit: 'cover' }} />
                <div className="univers-card-overlay" />
                <div className="univers-card-info">
                  <div className="univers-card-season">Printemps · Aube</div>
                  <div className="univers-card-name">La brume du matin</div>
                </div>
              </div>
              <div className="univers-card">
                <Image src="/images/bg/background-nature-lac-orage-pluie.png" alt="Automne" fill style={{ objectFit: 'cover' }} />
                <div className="univers-card-overlay" />
                <div className="univers-card-info">
                  <div className="univers-card-season">Automne · Orage</div>
                  <div className="univers-card-name">L'électricité de l'air</div>
                </div>
              </div>
              <div className="univers-card">
                <Image src="/images/bg/background-nature-coucher-soleil-brume.png" alt="Eté" fill style={{ objectFit: 'cover' }} />
                <div className="univers-card-overlay" />
                <div className="univers-card-info">
                  <div className="univers-card-season">Été · Coucher de soleil</div>
                  <div className="univers-card-name">L'heure dorée</div>
                </div>
              </div>
              <div className="univers-card">
                <Image src="/images/bg/background-nature-lac-nuit-lune.png" alt="Hiver" fill style={{ objectFit: 'cover' }} />
                <div className="univers-card-overlay" />
                <div className="univers-card-info">
                  <div className="univers-card-season">Hiver · Nuit</div>
                  <div className="univers-card-name">Le silence de l'eau</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HtmlSection>

      {/* 3: SESSIONS */}
      <HtmlSection index={3}>
        <section className="sessions" id="sessions">
          <div className="section-inner">
            <div className="section-label" style={{ transform: 'translateZ(-25px)' }}>Sessions</div>
            <h2 className="section-title" style={{ transform: 'translateZ(15px)' }}>Une sortie devient<br /><em>un souvenir.</em></h2>
            <div className="sessions-layout">
              <div className="sessions-timeline">
                <div className="timeline-line" />
                
                <div className="timeline-entry visible">
                  <div className="timeline-dot" />
                  <div className="timeline-time">05:42 — Lever du soleil</div>
                  <div className="timeline-title">Arrivée sur site</div>
                  <div className="timeline-desc">L'application détecte l'aube. L'interface bascule en mode aurore — lumière chaude, brume visuelle. La journée commence.</div>
                </div>

                <div className="timeline-entry visible" style={{ transitionDelay: '0.1s' }}>
                  <div className="timeline-dot" />
                  <div className="timeline-time">07:18 — Brise légère</div>
                  <div className="timeline-title">Première capture</div>
                  <div className="timeline-desc">Un gardon de 28 cm. FishDex l'identifie, l'enregistre, le géolocalise. Votre FishDex s'enrichit. Un badge se débloque.</div>
                </div>

                <div className="timeline-entry visible" style={{ transitionDelay: '0.2s' }}>
                  <div className="timeline-dot" />
                  <div className="timeline-time">09:55 — Soleil haut</div>
                  <div className="timeline-title">Découverte rare</div>
                  <div className="timeline-desc">Une brème commune — votre 14ème espèce. L'application vibre doucement. Une animation rare se déploie. Moment de grâce.</div>
                </div>

                <div className="timeline-entry visible" style={{ transitionDelay: '0.3s' }}>
                  <div className="timeline-dot" />
                  <div className="timeline-time">12:40 — Fin de session</div>
                  <div className="timeline-title">Le souvenir se crée</div>
                  <div className="timeline-desc">FishDex compile automatiquement votre session : carte du lieu, météo, captures, moments. Un journal vivant, prêt à être revécu.</div>
                </div>

              </div>
              <div className="sessions-visual">
                <div style={{ position: 'relative', aspectRatio: '9/16', maxWidth: '340px', margin: '0 auto', transform: 'rotate(5deg)' }}>
                  <Image src="/images/mockups/session-phone-mockup.png" alt="Session Mockup" fill style={{ objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </HtmlSection>

      {/* 4: ESPÈCES */}
      <HtmlSection index={4}>
        <section className="especes" id="especes">
          <div className="section-inner">
            <div className="especes-header" style={{ transform: 'translateZ(15px)' }}>
              <div className="especes-count-display">92</div>
              <div className="section-label" style={{ justifyContent: 'center', transform: 'translateZ(-25px)' }}>Espèces</div>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Un musée vivant<br />dans votre poche.</h2>
              <p className="section-body" style={{ textAlign: 'center', margin: '0 auto 60px' }}>De la truite fario au silure géant — 92 espèces vous attendent, chacune avec sa biologie, ses eaux, ses saisons. Pas une encyclopédie à lire. Une à vivre, capture après capture.</p>
            </div>
            
            <div className="especes-grid" style={{ pointerEvents: 'none' }}>
              {/* Row 1 */}
              <div className="espece-cell"><Image src="/images/fishes/truite-fario.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/perche-commune.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/carpe-commune.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/brochet.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/sandre.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/breme-commune.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              
              {/* Row 2 */}
              <div className="espece-cell"><Image src="/images/fishes/rotengle.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/silure-glane.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/tanche.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/black-bass.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/ablette.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
              <div className="espece-cell"><Image src="/images/fishes/saumon-atlantique.png" alt="" fill style={{ objectFit: 'contain', padding: '15px' }} /></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px', pointerEvents: 'auto' }}>
              <a href="#" className="btn-secondary" style={{ fontSize: '0.9rem' }}>
                Explorer toutes les espèces <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </HtmlSection>

      {/* 5: GALERIE */}
      <HtmlSection index={5}>
        <section className="galerie" id="galerie">
          <div className="section-inner">
            <div className="galerie-header">
              <div style={{ transform: 'translateZ(15px)' }}>
                <div className="section-label" style={{ transform: 'translateZ(-25px)' }}>Galerie</div>
                <h2 className="section-title">Des moments<br /><em>qui durent.</em></h2>
              </div>
              <div style={{ alignSelf: 'flex-end', paddingBottom: '30px' }}>
                <p className="section-body">Chaque sortie, chaque capture, chaque lever de soleil sur l'eau — votre vie de pêcheur en images.</p>
              </div>
            </div>
            
            <div className="galerie-grid">
              <div className="galerie-item g-tall"><Image src="/images/bg/galerie-prise-01-brochet-bateau-aube.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item"><Image src="/images/bg/galerie-prise-02-breme-mains.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item"><Image src="/images/bg/galerie-prise-03-pecheuse-coucher-soleil.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item"><Image src="/images/bg/galerie-prise-04-carpe-sous-marin.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item"><Image src="/images/bg/galerie-prise-05-pecheur-orage.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item g-wide"><Image src="/images/bg/galerie-prise-06-lancer-silhouette.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item"><Image src="/images/bg/galerie-prise-07-truite-mains-portrait.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
              <div className="galerie-item g-wide"><Image src="/images/bg/galerie-prise-08-relacher-carpe-panorama.png" alt="" fill style={{ objectFit: 'cover' }} /></div>
            </div>
          </div>
        </section>
      </HtmlSection>

      {/* 6: PREMIUM */}
      <HtmlSection index={6}>
        <section className="premium" id="premium">
          <div className="section-inner">
            <div className="section-label" style={{ transform: 'translateZ(-25px)' }}>Premium</div>
            <h2 className="section-title" style={{ transform: 'translateZ(15px)' }}>Gratuit et<br /><em>généreux.</em></h2>
            <p className="section-body" style={{ marginBottom: '40px' }}>FishDex est gratuit, vraiment. Le premium va plus loin — il ne vous retient pas derrière un mur.</p>
            
            <div style={{ marginBottom: '60px', pointerEvents: 'auto' }}>
              <a href="#" className="btn-primary">Commencer gratuitement</a>
            </div>

            <div className="premium-cards">
              <div className="premium-card">
                <div className="plan-badge">GRATUIT · POUR TOUJOURS</div>
                <div className="plan-title">Gratuit</div>
                <p className="plan-desc">Tout ce qu'il faut pour commencer à explorer. Aucune limite sur l'essentiel.</p>
                <ul className="plan-features">
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Toutes les espèces à découvrir</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Captures et sessions limitées</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> FishDex personnel</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Badges et niveaux</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Wrapped annuel</li>
                </ul>
              </div>
              
              <div className="premium-card pro">
                <div className="plan-badge">✦ PRO</div>
                <div className="plan-title">Pro</div>
                <p className="plan-desc">Pour celui qui pêche souvent, observe beaucoup et veut garder une trace de tout.</p>
                <ul className="plan-features">
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Tout Gratuit inclus</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Compteur taille / poids automatique</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Estimation de taille par photo</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Statistiques avancées et graphiques</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Export PDF et image des sessions</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Spots avancés</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Notifications météo intelligentes</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Wrapped accessible toute l'année</li>
                </ul>
              </div>

              <div className="premium-card legend">
                <div className="plan-badge">★ LÉGENDE</div>
                <div className="plan-title">Légende</div>
                <p className="plan-desc">Pour les passionnés qui vivent la pêche comme une vraie discipline. Chaque détail compte.</p>
                <ul className="plan-features">
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Tout Pro inclus</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Carte interactive de tous les spots</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Analyse prédictive des conditions</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Journal mood / humeur FishLog</li>
                  <li><CheckCircle2 size={16} color="var(--accent-sage)" /> Support prioritaire</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </HtmlSection>

      {/* 7 & 8 COMBINED: COMMUNAUTÉ + CTA / FOOTER */}
      <HtmlSection index={7} distanceFactor={42}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '85vh', width: '100vw', padding: '8vh 0 0 0', boxSizing: 'border-box' }}>
          
          <div className="communaute-content" style={{ textAlign: 'center', transform: 'translateZ(-10px)' }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '8px' }}>Communauté</div>
            <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '8px' }}>Rejoignez la <em>communauté.</em></h2>
            <p className="section-body" style={{ margin: '0 auto 24px', fontSize: '1rem', maxWidth: '600px' }}>Ceux qui comprennent pourquoi on se lève à 5h du matin pour aller au bord de l'eau se retrouvent ici.</p>
            <div style={{ pointerEvents: 'auto' }}>
              <a href="https://instagram.com/FishDex.fr" className="btn-instagram" target="_blank" rel="noopener noreferrer">
                <div className="ig-icon" /> @FishDex.fr · Instagram <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <div className="cta-final-content" style={{ textAlign: 'center', transform: 'translateZ(15px)', marginTop: 'auto', marginBottom: 'auto' }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px', transform: 'translateZ(-25px)' }}>Commencer l'aventure</div>
            <h2 className="cta-final-title" style={{ fontSize: '3.5rem', marginBottom: '16px', lineHeight: 1.1 }}>
              Combien d'espèces<br />vous manque-t-il ?
            </h2>
            <p className="cta-final-sub" style={{ marginBottom: '32px' }}>
              La bêta est ouverte. Gratuit, pour toujours. Il ne manque que vous.<br/><br/>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pour accéder à la bêta, suivez @FishDex.fr sur Instagram et envoyez-nous un message privé.</span>
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', pointerEvents: 'auto' }}>
              <a href="https://app.fishdex.fr" className="btn-primary" style={{ padding: '16px 32px' }}>
                Rejoindre la bêta <ChevronRight size={16} />
              </a>
              <a href="https://instagram.com/FishDex.fr" className="btn-secondary" style={{ padding: '16px 32px' }}>
                Suivre sur Instagram
              </a>
            </div>
          </div>

          <div className="footer-3d" style={{ width: '100%' }}>
            <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1280px', margin: '0 auto' }}>
              <div className="footer-logo">
                <img src="/logo.svg" alt="FishDex" style={{ height: '24px', width: '24px', objectFit: 'contain', verticalAlign: 'middle', marginRight: '8px' }} />
                <span style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.2rem' }}>FishDex</span>
              </div>
              <ul className="footer-links" style={{ display: 'flex', gap: '24px', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.8rem' }}>Confidentialité</a></li>
                <li><a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.8rem' }}>Conditions</a></li>
                <li><a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.8rem' }}>Instagram</a></li>
                <li><a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.8rem' }}>Contact</a></li>
              </ul>
              <div className="footer-copy" style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>© 2026 FishDex · Tous droits réservés</div>
            </div>
          </div>
        </div>
      </HtmlSection>
    </group>
  );
}
