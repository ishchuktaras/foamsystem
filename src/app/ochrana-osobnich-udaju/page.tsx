// src/app/ochrana-osobnich-udaju/page.tsx
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Ochrana osobních údajů (GDPR) | IZOLACE RS',
  description: 'Podmínky zpracování osobních údajů pro zákazníky IZOLACE RS.',
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#FEFEFA] p-8 md:p-12 rounded-3xl shadow-lg border border-zinc-200">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
            <ShieldCheck size={32} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-8">
            Ochrana osobních údajů a GDPR
          </h1>
          
          <div className="space-y-6 text-zinc-600 leading-relaxed">
            <p className="text-lg">
              Bezpečnost vašich dat je pro nás naprostou prioritou. Níže transparentně vysvětlujeme, jak a proč vaše údaje zpracováváme.
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              1. Účel zpracování dat
            </h2>
            <p>
              Vaše osobní údaje (jméno, příjmení, e-mail, telefon, adresa realizace) zpracováváme <strong>výhradně a pouze</strong> z těchto oprávněných důvodů:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 font-medium">
              <li>Vypracování nezávazné cenové kalkulace a odpověď na poptávku.</li>
              <li>Vyplnění identifikačních údajů do <strong>Smlouvy o dílo</strong>.</li>
              <li>Vystavování faktur a vedení zákonné <strong>účetní a obchodní dokumentace</strong>.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              2. Zabezpečení a legislativa
            </h2>
            <p>
              Při správě vašich dat striktně dodržujeme veškerou legislativu České republiky a nařízení Evropské unie o ochraně osobních údajů (GDPR) a informační bezpečnosti. Systém FoamSystem využívá moderní šifrování pro bezpečný přenos a ukládání dat.
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              3. Zákaz sdílení třetím stranám
            </h2>
            <p>
              Garantujeme, že vaše osobní údaje <strong>nikdy neprodáváme, nepronajímáme ani jinak nesdílíme</strong> s třetími stranami pro marketingové či reklamní účely. Přístup k nim má pouze personál podílející se na realizaci vaší zakázky a vedení účetnictví firmy.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-200">
            <Link href="/" className="text-[#FF4F00] font-bold hover:text-[#000000] transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={18} /> Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}