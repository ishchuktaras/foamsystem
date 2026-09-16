import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-zinc-400 py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6 text-white inline-block hover:scale-105 transition-transform duration-300">
              <Logo className="h-18 w-auto" />
            </div>
            <p className="text-sm leading-relaxed mb-4">Profesionální aplikace stříkané PUR izolace s důrazem na kvalitu, rychlost a čistotu práce.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2 text-sm flex flex-col">
              <li><a href="#vyhody" className="inline-block hover:text-[#FF4F00] hover:translate-x-1 transition-all duration-200">Výhody pěny</a></li>
              <li><a href="#proces" className="inline-block hover:text-[#FF4F00] hover:translate-x-1 transition-all duration-200">Průběh spolupráce</a></li>
              <li><a href="#faq" className="inline-block hover:text-[#FF4F00] hover:translate-x-1 transition-all duration-200">Časté dotazy</a></li>
              
              <li className="pt-2 mt-2 border-t border-zinc-800 w-fit">
                <Link href="/admin" className="inline-block text-zinc-500 hover:text-[#FF4F00] hover:translate-x-1 transition-all duration-200">
                  Klientská zóna
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Právní dokumenty</h4>
            <ul className="space-y-2 text-sm flex flex-col">
              <li><Link href="/obchodni-podminky" className="inline-block hover:text-white hover:translate-x-1 transition-all duration-200">Obchodní podmínky</Link></li>
              <li><Link href="/ochrana-osobnich-udaju" className="inline-block hover:text-[#FF4F00] hover:translate-x-1 transition-all duration-200">Ochrana osobních údajů (GDPR)</Link></li>
              <li><Link href="/cookies" className="inline-block hover:text-white hover:translate-x-1 transition-all duration-200">Nastavení Cookies</Link></li>
            </ul>
          </div>
        </div>

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