// src/components/landing/FaqReviews.tsx
'use client'

import { useState } from 'react'
import { HelpCircle, Star, Quote as QuoteIcon, ChevronDown } from 'lucide-react'

// DATA PRO FAQ (Zaměřeno na technické vlastnosti, přístup a GEO Vysočina)
const faqs = [
  {
    q: 'Kde všude izolace provádíte? Jezdíte jen na Vysočině?',
    a: 'Naše centrála sídlí v Jihlavě, což nám umožňuje bleskově obsloužit celý Kraj Vysočina. Naše aplikační vozy jsou ale plně soběstačné, takže běžně realizujeme zakázky po celé České republice.'
  },
  {
    q: 'Jaký je rozdíl mezi měkkou a tvrdou PUR pěnou?',
    a: 'Měkká pěna dýchá, funguje jako akustická izolace a je ideální pro podkroví a střechy. Tvrdá pěna je absolutně nenasákavá, slouží jako hydroizolace i parozábrana a hodí se pro základy, fasády a průmyslové haly.'
  },
  {
    q: 'Je PUR pěna hořlavá?',
    a: 'Používáme výhradně certifikované pěny se samozhášivou přísadou, které splňují přísné protipožární normy (třída reakce na oheň E).'
  },
  {
    q: 'Pustí se do pěny myši nebo kuny?',
    a: 'Ne. PUR pěna pro hlodavce a kuny nepředstavuje potravu ani vhodné prostředí pro hnízdění.'
  },
  {
    q: 'Jakou aplikační techniku používáte?',
    a: 'Kvalita stroje je zásadní. Používáme špičkové vysokotlaké reaktory, které striktně hlídají tlak i teplotu obou složek. Díky tomu je pěna 100% homogenní a nehrozí jí smršťování či degradace jako u hobby strojů.'
  },
  {
    q: 'Jak probíhá realizace a úklid?',
    a: 'Zakládáme si na slušnosti a čistotě. Všechna okna a trámy pečlivě zakryjeme fólií. Běžný dům zateplíme za 1 den a před odjezdem staveniště kompletně uklidíme.'
  },
  {
    q: 'Poskytujete na aplikaci záruku?',
    a: 'Ano, za svou prací si pevně stojíme. Na veškeré provedené izolační práce a vlastnosti materiálu poskytujeme plnou záruku 24 měsíců.'
  }
]

// DATA PRO RECENZE (GEO optimalizace: Jihlava, Havlíčkův Brod, Pelhřimov)
const reviews = [
  { text: 'Blesková realizace. Ráno přijeli, odpoledne bylo hotovo. Už první zimu jsme poznali rozdíl na účtech za vytápění.', author: 'Martin D., Jihlava' },
  { text: 'Všude se dostali, perfektně zakryli okna a po sobě uklidili. Profesionální přístup od A do Z, můžu jen doporučit.', author: 'Jana K., Havlíčkův Brod' },
  { text: 'Férové jednání a profi stroje. Zateplovali jsme střechu u staršího domu a vše proběhlo přesně podle domluvy. Pěna drží perfektně.', author: 'Petr S., Pelhřimov' }
]

// JSON-LD SCHÉMA PRO AIO / GOOGLE RICH SNIPPETS
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
}

export default function FaqReviews() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-[#F9FAFB]">
      
      {/* Vložení strukturovaných dat (AIO optimalizace) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* FAQ SLOUPEC */}
          <div>
            <h2 className="text-3xl font-black text-[#000000] mb-8 flex items-center gap-3">
              <HelpCircle className="text-[#FF4F00]" /> Časté dotazy
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div key={i} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#FF4F00] shadow-md shadow-[#FF4F00]/10' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <h4 className={`font-bold transition-colors ${isOpen ? 'text-[#FF4F00]' : 'text-[#000000]'}`}>
                        {faq.q}
                      </h4>
                      <ChevronDown className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF4F00]' : 'text-zinc-400'}`} size={20} />
                    </button>
                    <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-zinc-600 text-sm leading-relaxed pt-2 border-t border-zinc-100">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RECENZE SLOUPEC */}
          <div>
            <h2 className="text-3xl font-black text-[#000000] mb-8 flex items-center gap-3">
              <Star className="text-[#FF4F00]" /> Řekli o nás
            </h2>
            <div className="space-y-6">
              {reviews.map((review, i) => (
                <div key={i} className="bg-[#000000] text-white p-6 rounded-2xl relative hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF4F00]/10 transition-all duration-300">
                  <QuoteIcon className="absolute top-6 right-6 text-zinc-800" size={32} />
                  <p className="text-zinc-300 italic mb-4 relative z-10">{review.text}</p>
                  <div className="font-bold text-[#FF4F00]">{review.author}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}