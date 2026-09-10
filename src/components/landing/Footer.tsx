// src/components/landing/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-zinc-400 py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          {/* --- NOVÉ LOGO (Přizpůsobené pro tmavé pozadí) --- */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-extrabold text-white">IZOLACE</span>
            <span className="bg-[#FF4F00] px-2 py-1 rounded-lg text-sm font-black text-white tracking-wider">RS</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">Profesionální aplikace stříkané PUR izolace s důrazem na kvalitu, rychlost a čistotu práce.</p>
          <p className="text-sm font-bold text-white">IČO: 23874694</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Rychlé odkazy</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#vyhody" className="hover:text-[#FF4F00] transition-colors">Výhody pěny</a></li>
            <li><a href="#proces" className="hover:text-[#FF4F00] transition-colors">Průběh spolupráce</a></li>
            <li><a href="#faq" className="hover:text-[#FF4F00] transition-colors">Časté dotazy</a></li>
            
            {/* --- ZDE JE SKRYTÝ PŘÍSTUP DO ADMINISTRACE --- */}
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
            <li><Link href="#" className="hover:text-white transition-colors">Obchodní podmínky</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Ochrana osobních údajů (GDPR)</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Nastavení Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}