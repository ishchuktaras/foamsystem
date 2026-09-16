// src/components/landing/Benefits.tsx
import { ShieldCheck, ThermometerSun, Zap, Clock } from 'lucide-react'

export default function Benefits() {
  return (
    <section id="vyhody" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#000000] mb-4">
            Proč zvolit stříkanou PUR pěnu?
          </h2>
          <p className="text-zinc-500 font-medium max-w-2xl mx-auto">
            Moderní zateplení, kterému klasická vata nebo polystyren nedokážou konkurovat. Ušetřete až 70 % nákladů na vytápění.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: ThermometerSun, 
              title: 'Bez tepelných mostů', 
              desc: 'PUR pěna expanduje do všech spár a vytvoří 100% souvislou izolační vrstvu. Zima ani horko nemají šanci.' 
            },
            { 
              icon: Clock, 
              title: 'Hotovo za 1 den', 
              desc: 'Aplikace je extrémně rychlá. Běžný rodinný dům na Vysočině či kdekoliv po ČR kompletně zateplíme během jediného dne.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Tvarová stálost', 
              desc: 'Na rozdíl od minerální vaty stříkaná izolace nesesedá, neřídne a zachovává si své špičkové vlastnosti po desítky let.' 
            },
            { 
              icon: Zap, 
              title: 'Stop škůdcům a plísním', 
              desc: 'Struktura polyuretanové pěny neláká hlodavce (myši, kuny) ani hmyz, nedrží vlhkost a navíc výborně akusticky izoluje.' 
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#FF4F00]/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out group cursor-pointer">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF4F00] mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-3">{item.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}