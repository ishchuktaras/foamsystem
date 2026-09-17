// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import CookieBanner from '@/components/CookieBanner' // <--- Nový import Cookie lišty

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://izolacers.cz'), // Nezbytné pro absolutní cesty OG obrázků
  title: 'IZOLACE RS | Stříkané izolace Jihlava a Vysočina',
  description: 'Profesionální zateplení střech, podkroví a fasád stříkanou PUR pěnou. Nejuniverzálnější zateplení na trhu s garancí 24 měsíců. Působíme v Jihlavě, na Vysočině i po celé ČR.',
  keywords: ['IZOLACE RS', 'stříkaná izolace', 'PUR pěna', 'zateplení', 'Jihlava', 'Vysočina', 'izolace střech'],
  authors: [{ name: 'IZOLACE RS', url: 'https://izolacers.cz' }, { name: 'Taras Ishchuk', url: 'https://webnamiru.site' }],
  other: {
    'geo.region': 'CZ-VC',
    'geo.placename': 'Jihlava',
    'geo.position': '49.3961;15.5912',
    'ICBM': '49.3961, 15.5912',
  },
  // NÁSLEDUJÍCÍ BLOKY PŘIDÁNY PRO SOCIÁLNÍ SÍTĚ:
  openGraph: {
    title: 'IZOLACE RS | Stříkané PUR izolace Vysočina',
    description: 'Nejuniverzálnější zateplení na trhu. Profesionální zateplení s garancí 24 měsíců.',
    url: 'https://izolacers.cz',
    siteName: 'IZOLACE RS',
    images: [
      {
        url: '/images/hero-bg.jpeg', // Použije tvůj široký obrázek
        width: 1200,
        height: 630,
        alt: 'Aplikátor IZOLACE RS při stříkání PUR pěny',
      },
    ],
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IZOLACE RS | Stříkané PUR izolace',
    description: 'Nejuniverzálnější zateplení na trhu. Profesionální zateplení s garancí 24 měsíců.',
    images: ['/images/hero-bg.jpeg'], 
  },
}

// JSON-LD Znalostní graf pro AI vyhledávače (ChatGPT, Gemini, Google AI Overviews)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "IZOLACE RS",
  "image": "https://izolacers.cz/logo-orange.svg",
  "description": "Profesionální aplikace stříkané PUR izolace. Zateplení střech, fasád a podkroví.",
  "email": ["info@izolacers.cz", "poptavky@izolacers.cz"],
  "telephone": "+420734617462",
  "taxID": "CZ308068889",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Jihlava",
    "addressRegion": "Kraj Vysočina",
    "addressCountry": "CZ"
  },
  "areaServed": [
    { "@type": "State", "name": "Kraj Vysočina" },
    { "@type": "City", "name": "Jihlava" },
    { "@type": "Country", "name": "Česká republika" }
  ],
  "knowsAbout": ["Stříkaná izolace", "PUR pěna", "Zateplení střech", "Tepelné izolace", "Zateplení fasád"]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          {/* Zde je vykreslena naše nová Cookie lišta napříč všemi stránkami */}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}