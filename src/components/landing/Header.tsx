// src/components/landing/Header.tsx
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-[#F9FAFB]/90 backdrop-blur-md z-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Světlé pozadí -> text-black (přebarví slovo IZOLACE na černo) */}
        <Link href="/" className="flex items-center text-black hover:opacity-90 transition-opacity">
          <Logo className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-bold text-[#000000]">
          <a href="#vyhody" className="hover:text-[#FF4F00] transition-colors">Proč pěna?</a>
          <a href="#proces" className="hover:text-[#FF4F00] transition-colors">Jak to funguje</a>
          <a href="#faq" className="hover:text-[#FF4F00] transition-colors">Časté dotazy</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <a href="#poptavka" className="hidden md:block px-6 py-2.5 bg-[#FF4F00] hover:bg-[#E64700] text-white font-bold rounded-xl transition-all shadow-md">
            Nezávazná kalkulace
          </a>
        </div>
      </div>
    </header>
  )
}