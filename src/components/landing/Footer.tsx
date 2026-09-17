// src/components/landing/Footer.tsx
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Phone, Mail, MapPin, Building2, ChevronRight, Lock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-950 text-zinc-300 py-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-zinc-800 pb-12">
          
          {/* Značka a Logo */}
          <div className="space-y-6">
            <div className="bg-white/5 inline-block p-4 rounded-2xl">
              <Logo className="h-12 w-auto" />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed pr-4">
              Profesionální aplikace stříkané PUR izolace na Vysočině i po celé ČR. Nejuniverzálnější zateplení na trhu s garancí 24 měsíců.
            </p>
          </div>

          {/* Rychlé odkazy */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Rychlé odkazy</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#sluzby" className="text-zinc-400 hover:text-[#FF8730] transition-colors flex items-center gap-2 text-sm">
                  <ChevronRight size={14} /> Naše služby
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-zinc-400 hover:text-[#FF8730] transition-colors flex items-center gap-2 text-sm">
                  <ChevronRight size={14} /> Časté dotazy
                </Link>
              </li>
              <li>
                <Link href="#recenze" className="text-zinc-400 hover:text-[#FF8730] transition-colors flex items-center gap-2 text-sm">
                  <ChevronRight size={14} /> Recenze
                </Link>
              </li>
              <li>
                <Link href="#poptavka" className="text-zinc-400 hover:text-[#FF8730] transition-colors flex items-center gap-2 text-sm">
                  <ChevronRight size={14} /> Nezávazná kalkulace
                </Link>
              </li>
              <li className="pt-2 mt-2 border-t border-zinc-800/50">
                <Link href="/login" className="text-zinc-500 hover:text-[#FF8730] transition-colors flex items-center gap-2 text-sm font-medium">
                  <Lock size={14} /> Přihlášení do systému
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakty */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="text-[#FF8730] shrink-0 mt-0.5" size={18} />
                <a href="tel:+420734617462" className="text-zinc-400 hover:text-[#FF8730] transition-colors text-sm">+420 734 617 462</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-[#FF8730] shrink-0 mt-0.5" size={18} />
                <div className="flex flex-col space-y-1">
                  <a href="mailto:info@izolacers.cz" className="text-zinc-400 hover:text-[#FF8730] transition-colors text-sm">info@izolacers.cz</a>
                  <a href="mailto:poptavky@izolacers.cz" className="text-zinc-400 hover:text-[#FF8730] transition-colors text-sm">poptavky@izolacers.cz</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-[#FF8730] shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-400 text-sm">Jihlava, Kraj Vysočina<br/>(Působíme po celé ČR)</span>
              </li>
            </ul>
          </div>

          {/* Firemní údaje */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Firemní údaje</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Building2 className="text-[#FF8730] shrink-0" size={18} />
                <div>
                  <span className="block text-zinc-400 text-sm">IČO: 88707351</span>
                  <span className="block text-zinc-400 text-sm">DIČ: CZ308068889</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Spodní lišta - Copyright, Legální odkazy a Vývojář */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {currentYear} IZOLACE RS. Všechna práva vyhrazena.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/obchodni-podminky" className="hover:text-zinc-300 transition-colors">Obchodní podmínky</Link>
            <Link href="/ochrana-osobnich-udaju" className="hover:text-zinc-300 transition-colors">Ochrana osobních údajů</Link>
            <Link href="/cookies" className="hover:text-zinc-300 transition-colors">Nastavení Cookies</Link>
          </div>

          <p>
            Vytvořil <a href="https://www.webnamiru.site" target="_blank" rel="noopener noreferrer" className="text-[#FF8730] font-bold hover:underline">Taras Ishchuk - webnamiru.site</a>
          </p>
        </div>
      </div>
    </footer>
  )
}