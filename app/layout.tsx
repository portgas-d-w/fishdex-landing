import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'FishDex — Le monde vivant de la pêche',
  description: "L'encyclopédie vivante des poissons d'eau douce français. Journal de sessions, collection de captures, météo intelligente.",
  metadataBase: new URL('https://fishdex.fr'),
  openGraph: {
    title: 'FishDex',
    description: "L'encyclopédie vivante des poissons d'eau douce français.",
    url: 'https://fishdex.fr',
    siteName: 'FishDex',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FishDex',
    description: "L'encyclopédie vivante des poissons d'eau douce français.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{children}</body>
    </html>
  )
}
