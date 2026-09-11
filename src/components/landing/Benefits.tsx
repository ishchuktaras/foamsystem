import { ShieldCheck, ThermometerSun, Zap, Clock } from 'lucide-react'

export default function Benefits() {
  return (
    <section id="vyhody" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#000000] mb-4">Proč zvolit stříkanou pěnu?</h2>
          <p className="text-zinc-500 font-medium max-w-2xl mx-auto">Vlastnosti, kterým klasická vata nebo polystyren nemohou konkurovat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ThermometerSun, title: 'Bez tepelných mostů', desc: 'Pěna expanduje do všech spár a vytvoří 100% souvislou izolační vrstvu bez mezer.' },
            { icon: Clock, title: 'Hotovo za 1 den', desc: 'Aplikace je extrémně rychlá. Běžný dům kompletně zateplíme během jediného dne.' },
            { icon: ShieldCheck, title: 'Nemění tvar', desc: 'Na rozdíl od vaty pěna nesesedá, neřídne a zachovává si vlastnosti po desítky let.' },
            { icon: Zap, title: 'Ochrana proti škůdcům', desc: 'Struktura PUR pěny neláká hlodavce ani hmyz, navíc výborně akusticky izoluje.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#FF4F00] transition-colors group">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF4F00] mb-6 group-hover:scale-110 transition-transform">
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