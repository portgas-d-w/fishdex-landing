import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'FishDex — Chaque poisson raconte une histoire',
  description: 'FishDex transforme chaque sortie pêche en souvenir vivant. Découvrez 92 espèces, capturez vos moments, construisez votre journal d\'explorateur.',
  metadataBase: new URL('https://fishdex.fr'),
  openGraph: {
    title: 'FishDex',
    description: 'FishDex transforme chaque sortie pêche en souvenir vivant.',
    url: 'https://fishdex.fr',
    siteName: 'FishDex',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FishDex',
    description: 'FishDex transforme chaque sortie pêche en souvenir vivant.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
