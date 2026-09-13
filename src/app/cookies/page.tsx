// src/app/cookies/page.tsx
import Link from 'next/link'
import { Cookie, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Nastavení Cookies | IZOLACE RS',
  description: 'Informace o využívání souborů cookies na webu IZOLACE RS.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#FEFEFA] p-8 md:p-12 rounded-3xl shadow-lg border border-zinc-200">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
            <Cookie size={32} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-8">
            Zásady používání Cookies
          </h1>
          
          <div className="space-y-6 text-zinc-600 leading-relaxed">
            <p className="text-lg">
              Vážíme si vašeho soukromí. Náš web je navržen tak, aby vás nesledoval. Využíváme pouze to nejnutnější pro technický chod systému.
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              1. Používáme pouze Nezbytné (Technické) Cookies
            </h2>
            <p>
              Tato webová stránka a její interní administrace využívá výhradně nezbytné soubory cookies. Tyto soubory jsou absolutně klíčové pro správné fungování webu. Patří sem:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 font-medium">
              <li>Uchování relace (session) při bezpečném přihlášení personálu do firemní administrace.</li>
              <li>Ochrana formulářů proti podvržení (CSRF tokeny) při odesílání poptávek.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              2. Sledovací a marketingové cookies
            </h2>
            <p>
              <strong>Neodposloucháváme vás.</strong> Na tomto webu aktuálně nevyužíváme žádné marketingové, analytické ani sledovací cookies třetích stran (jako jsou Google Analytics, Meta Pixel apod.). Z toho důvodu vás při příchodu na web neobtěžujeme vyskakovací lištou (tzv. cookie bannerem) s žádostí o souhlas – nepotřebujeme ho.
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              3. Jak cookies spravovat
            </h2>
            <p>
              I přesto máte plnou kontrolu nad ukládáním cookies přímo v nastavení vašeho webového prohlížeče. Můžete je kdykoliv smazat nebo jejich ukládání zcela zablokovat. Upozorňujeme však, že zablokování technických cookies může omezit funkčnost odesílání formulářů či přístup do klientské/administrátorské zóny.
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