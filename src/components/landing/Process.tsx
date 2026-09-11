import { CheckCircle2, ChevronRight } from 'lucide-react'

export default function Process() {
  return (
    <section id="proces" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-[#000000]">Jak probíhá spolupráce?</h2>
            <div className="space-y-8 mt-10">
              {[
                { num: '01', title: 'Nezávazná kalkulace', desc: 'Vyplníte krátký formulář. My vám obratem zašleme předběžnou cenu.' },
                { num: '02', title: 'Odborné zaměření', desc: 'Přijedeme k vám, vše přesně zaměříme a vyřešíme technické detaily.' },
                { num: '03', title: 'Realizace', desc: 'Náš tým přijede v dohodnutý termín. Samotná aplikace trvá většinou 1 den.' },
                { num: '04', title: 'Předání a úspora', desc: 'Předáme vám dílo, uklidíme po sobě a vy začínáte okamžitě šetřit.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#000000] text-[#FF4F00] flex items-center justify-center font-black text-sm">{step.num}</div>
                    {i !== 3 && <div className="w-0.5 h-full bg-zinc-200 mt-2"></div>}
                  </div>
                  <div className="pb-8">
                    <h4 className="text-xl font-bold text-[#000000] mb-2">{step.title}</h4>
                    <p className="text-zinc-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full bg-[#F9FAFB] border border-zinc-200 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F00] opacity-10 rounded-bl-full"></div>
            <h3 className="text-2xl font-black text-[#000000] mb-6">Máte specifický projekt?</h3>
            <ul className="space-y-4 mb-8">
              {['Zateplení ploché i šikmé střechy', 'Izolace základů a sklepů', 'Zateplení průmyslové haly', 'Odhlučnění příček'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-zinc-700">
                  <CheckCircle2 className="text-[#FF4F00]" size={20} /> {item}
                </li>
              ))}
            </ul>
            <a href="#poptavka" className="w-full py-4 bg-[#000000] hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              Konzultovat projekt <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}