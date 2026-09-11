import { HelpCircle, Star, Quote as QuoteIcon } from 'lucide-react'

export default function FaqReviews() {
  return (
    <section id="faq" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-black text-[#000000] mb-8 flex items-center gap-3">
              <HelpCircle className="text-[#FF4F00]" /> Časté dotazy
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Je PUR pěna hořlavá?', a: 'Používáme certifikované pěny se samozhášivou přísadou, které splňují přísné protipožární normy (třída reakce na oheň E).' },
                { q: 'Pustí se do pěny myši nebo kuny?', a: 'Ne. PUR pěna pro hlodavce nepředstavuje potravu ani vhodné prostředí pro hnízdění.' }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200">
                  <h4 className="font-bold text-[#000000] mb-2">{faq.q}</h4>
                  <p className="text-zinc-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#000000] mb-8 flex items-center gap-3">
              <Star className="text-[#FF4F00]" /> Řekli o nás
            </h2>
            <div className="space-y-6">
              {[
                { text: 'Blesková realizace. Ráno přijeli, odpoledne bylo hotovo. Už první zimu jsme poznali rozdíl na účtech.', author: 'Martin D., Jihlava' },
                { text: 'Všude se dostali, perfektně zakryli okna a po sobě uklidili. Určitě doporučuji.', author: 'Jana K., Havlíčkův Brod' }
              ].map((review, i) => (
                <div key={i} className="bg-[#000000] text-white p-6 rounded-2xl relative">
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