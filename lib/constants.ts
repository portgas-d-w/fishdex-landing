export const APP_URL = 'https://fish-dex-six.vercel.app'
export const SITE_URL = 'https://fishdex.fr'
export const CONTACT_EMAIL = 'contact@fishdex.fr'

export const NAV_LINKS = [
  { label: 'Découvrir', href: '#features' },
  { label: 'Collection', href: '#rarity' },
  { label: 'Souvenir', href: '#memory' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Manifeste', href: '#manifest' },
]

export const RARITIES = [
  { no: 'I',   name: 'Commune',       color: '#94a3b8', sub: 'Gardon · Rotengle' },
  { no: 'II',  name: 'Peu commune',   color: '#34d399', sub: 'Truite arc-en-ciel' },
  { no: 'III', name: 'Rare',          color: '#60a5fa', sub: 'Truite fario' },
  { no: 'IV',  name: 'Épique',        color: '#c084fc', sub: 'Silure glane' },
  { no: 'V',   name: 'Légendaire',    color: '#f59e0b', sub: 'Brochet de lac' },
  { no: 'VI',  name: 'Mirage',        color: 'gradient', sub: 'Presque impossible', isMirage: true },
]

export const PRICING_TIERS = [
  {
    name: 'Gratuit',
    price: '0€',
    tagline: 'Pour commencer.',
    features: [
      'FishDex complet (92 espèces)',
      'Captures illimitées',
      'Sessions de pêche',
      '5 spots favoris',
      'FishFeed communauté',
    ],
    cta: "Accéder à l'app",
    featured: false,
  },
  {
    name: 'Pro',
    price: '3,99€',
    period: 'mois',
    tagline: 'Pour vivre la pêche.',
    features: [
      'IA reconnaissance espèces',
      'Estimation taille par photo',
      'Statistiques avancées',
      'Export sessions PDF/image',
      'Spots illimités',
      'Météo intelligente',
    ],
    cta: 'Essai gratuit 7 jours',
    featured: true,
  },
  {
    name: 'Légende',
    price: '6,99€',
    period: 'mois',
    tagline: 'Pour les passionnés.',
    features: [
      'Tout le Pro',
      'Carte interactive des spots',
      'Analyse prédictive',
      'Journal vocal transcrit',
      'Accès anticipé features',
    ],
    cta: 'Choisir Légende',
    featured: false,
  },
]
