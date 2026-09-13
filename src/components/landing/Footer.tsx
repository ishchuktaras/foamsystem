// src/components/landing/Footer.tsx
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-zinc-400 py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {/* Tmavé pozadí -> text-white */}
            <div className="mb-6 text-white inline-block">
              <Logo className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed mb-4">Profesionální aplikace stříkané PUR izolace s důrazem na kvalitu, rychlost a čistotu práce.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#vyhody" className="hover:text-[#FF4F00] transition-colors">Výhody pěny</a></li>
              <li><a href="#proces" className="hover:text-[#FF4F00] transition-colors">Průběh spolupráce</a></li>
              <li><a href="#faq" className="hover:text-[#FF4F00] transition-colors">Časté dotazy</a></li>
              
              <li className="pt-2 mt-2 border-t border-zinc-800">
                <Link href="/admin" className="text-zinc-500 hover:text-[#FF4F00] transition-colors">
                  Klientská zóna
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Právní dokumenty</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/obchodni-podminky" className="hover:text-white transition-colors">Obchodní podmínky</Link></li>
              <li><Link href="/ochrana-osobnich-udaju" className="hover:text-[#FF4F00] transition-colors">Ochrana osobních údajů (GDPR)</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Nastavení Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* AUTORSKÝ PODPIS A COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-zinc-500 font-medium">
            © {new Date().getFullYear()} IZOLACE RS. Všechna práva vyhrazena.
          </p>
          
          <div className="text-xs text-zinc-600 flex flex-col items-center gap-1">
            <p>
              Vývoj webu <a href="https://www.webnamiru.site" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors font-bold">Taras Ishchuk - OSVČ</a>, IČO: 23874694.
            </p>
            <p>
              Zapsaný v živnostenském rejstříku vedeném u Magistrátu města Jihlavy.
            </p>
            <div className="flex items-center gap-3 mt-1.5 font-medium">
              <a href="https://wa.me/420777596216" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors">
                WhatsApp: +420 777 596 216
              </a>
              <span className="text-zinc-700">•</span>
              <a href="https://www.webnamiru.site" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors">
                webnamiru.site
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}