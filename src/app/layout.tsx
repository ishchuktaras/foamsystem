// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers' // <--- Nový import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FoamSystem – digitální administrace',
  description: 'Interní systém pro správu izolačních materiálů, kalkulátor spotřeby a poptávky. Vyvinul Taras Ishchuk - webnamiru.site.',
  keywords: ['FoamSystem', 'izolace', 'kalkulátor spotřeby', 'stříkaná izolace', 'Jihlava', 'Vysočina', 'Taras Ishchuk'],
  authors: [{ name: 'Taras Ishchuk', url: 'https://webnamiru.site' }],
  other: {
    'geo.region': 'CZ-VC',
    'geo.placename': 'Jihlava',
    'geo.position': '49.3961;15.5912',
    'ICBM': '49.3961, 15.5912',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        {/* Zde jsme aplikaci obalili do SessionProvideru */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}