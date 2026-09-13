// src/app/obchodni-podminky/page.tsx
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Obchodní podmínky | IZOLACE RS',
  description: 'Všeobecné obchodní podmínky pro poskytování služeb aplikace stříkané PUR pěny.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#FEFEFA] p-8 md:p-12 rounded-3xl shadow-lg border border-zinc-200">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8">
            <FileText size={32} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-8">
            Všeobecné obchodní podmínky
          </h1>
          
          <div className="space-y-6 text-zinc-600 leading-relaxed">
            
            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              1. Úvodní ustanovení
            </h2>
            <p>
              Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi zhotovitelem (<strong>Taras Ishchuk, IČO: 23874694, se sídlem Rantířovská 123/36, Jihlava</strong>, vystupující pod značkou IZOLACE RS) a zákazníkem (dále jen &quot;Objednatel&quot;) při aplikaci stříkaných polyuretanových (PUR) izolačních pěn.
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              2. Poptávka a Cenová nabídka
            </h2>
            <p>
              Veškeré poptávky odeslané skrze webový formulář na stránkách IZOLACE RS jsou nezávazné. Na základě údajů poskytnutých Objednatelem je vypracována informativní Cenová nabídka. Tato nabídka nepředstavuje uzavření Smlouvy o dílo a odhadovaná cena se může lišit od finální ceny na základě přesného zaměření a skutečné spotřeby materiálu na místě.
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              3. Stavební připravenost
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-2 font-medium">
              <li>Objednatel je povinen zajistit volný přístup na staveniště.</li>
              <li>Doporučuje se zajištění elektrické sítě 380 V (jistič min. 25 A, zásuvka 5 kolík). Pokud tato přípojka nebude k dispozici, Zhotovitel využije vlastní naftový generátor, přičemž náklady za spotřebovanou naftu budou doúčtovány k celkové ceně díla.</li>
              <li>Plochy, které nesmí být zasaženy izolační pěnou (okna, trámy, pohledové prvky), musí být Objednatelem předem řádně zakryty. Pokud toto zakrytí nebude připraveno, zhotovitel provede zakrytí vlastními kapacitami, přičemž spotřebovaná balicí fólie a čas strávený zakrýváním budou k dílu doúčtovány.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              4. Vyúčtování a Předání
            </h2>
            <p>
              Dílo je považováno za dokončené jeho předáním Objednateli. Zhotovitel má právo požadovat složení zálohy (zpravidla 50 %) před započetím prací na základě Zálohové faktury. Finální doplatek je vypočítán na základě reálně vystříkaného materiálu a dodatečných víceprací (viz bod 3).
            </p>

            <h2 className="text-xl font-bold text-[#000000] mt-10 mb-4 border-b border-zinc-100 pb-2">
              5. Záruka
            </h2>
            <p>
              Na aplikaci izolační pěny je poskytována standardní záruka v délce 60 měsíců, pakliže Smlouva o dílo nestanoví jinak. Tvarová stálost a životnost samotné PUR pěny je garantována výrobcem po celou dobu životnosti stavby.
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