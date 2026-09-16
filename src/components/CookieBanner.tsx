// src/components/CookieBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Zkontrolujeme, jestli už uživatel dříve souhlasil
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Malé zpoždění pro plynulejší efekt při načtení stránky
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all')
    setIsVisible(false)
    // Zde bys v budoucnu spustil script pro Google Analytics
  }

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto bg-[#000000] text-white p-6 rounded-3xl shadow-2xl shadow-[#FF4F00]/20 max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 border border-zinc-800 animate-in slide-in-from-bottom-10 fade-in duration-700">
        
        <div className="flex-1 flex gap-4 items-start">
          <div className="bg-[#FF4F00]/20 text-[#FF4F00] p-3 rounded-full shrink-0">
            <Cookie size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Vážíme si vašeho soukromí</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tento web používá k poskytování služeb, personalizaci reklam a analýze návštěvnosti soubory cookies. 
              Kliknutím na „Přijmout vše“ s tím souhlasíte. Více informací najdete v našich <Link href="/cookies" className="text-[#FF4F00] hover:underline transition-all">zásadách cookies</Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleAcceptNecessary}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-white transition-all text-center"
          >
            Pouze nezbytné
          </button>
          <button 
            onClick={handleAcceptAll}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-[#FF4F00] hover:bg-[#E64700] text-white transition-all shadow-lg text-center"
          >
            Přijmout vše
          </button>
        </div>

      </div>
    </div>
  )
}