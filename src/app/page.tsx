// src/app/page.tsx
import Link from 'next/link'
import { ShieldCheck, ThermometerSun, Zap, Clock, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Star, Quote as QuoteIcon } from 'lucide-react'
import ContactForm from '@/components/landing/LandingContactForm'

const Header = () => (
  <header className="fixed top-0 w-full bg-[#F9FAFB]/90 backdrop-blur-md z-50 border-b border-zinc-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="bg-[#FF4F00] px-2 py-1 rounded-lg text-sm font-black text-white tracking-wider">RS</span>
        <span className="text-xl font-extrabold text-[#000000]">FOAM<span className="text-[#FF4F00]">SYSTEM</span></span>
      </div>
      <nav className="hidden md:flex gap-8 text-sm font-bold text-[#000000]">
        <a href="#vyhody" className="hover:text-[#FF4F00] transition-colors">Proč pěna?</a>
        <a href="#proces" className="hover:text-[#FF4F00] transition-colors">Jak to funguje</a>
        <a href="#faq" className="hover:text-[#FF4F00] transition-colors">Časté dotazy</a>
      </nav>
      <div className="flex items-center gap-4">
        <a href="#poptavka" className="hidden md:block px-6 py-2.5 bg-[#FF4F00] hover:bg-[#E64700] text-white font-bold rounded-xl transition-all shadow-md">
          Nezávazná kalkulace
        </a>
        <Link href="/admin" className="text-sm font-bold text-zinc-500 hover:text-[#000000]">
          Klientská zóna
        </Link>
      </div>
    </div>
  </header>
)

const Footer = () => (
  <footer className="bg-[#111111] text-zinc-400 py-12 border-t border-zinc-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#FF4F00] px-2 py-1 rounded-lg text-xs font-black text-white">RS</span>
          <span className="text-lg font-extrabold text-white">FOAM<span className="text-[#FF4F00]">SYSTEM</span></span>
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-[#FF4F00] selection:text-white">
      <Header />

      <main className="pt-20">
        
        {/* HERO */}
        <section className="relative bg-[#000000] text-white overflow-hidden py-24 lg:py-32">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF4F00] rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#FF4F00] rounded-full blur-[100px]"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FF4F00] text-sm font-bold mb-8">
              <Zap size={16} /> Nejuniverzálnější zateplení na trhu
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
              Chytrá izolace, která šetří <br className="hidden md:block" />
              <span className="text-[#FF4F00]">až 50 % nákladů</span> na vytápění
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-medium">
              Zateplení střech, podkroví a fasád stříkanou PUR pěnou. Dokonalé utěsnění bez tepelných mostů s garancí životnosti po celou dobu stavby.
            </p>
            <a href="#poptavka" className="px-8 py-4 bg-[#FF4F00] hover:bg-[#E64700] text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,79,0,0.4)] flex items-center justify-center gap-2">
              Spočítat nezávazně <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* BENEFITY */}
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

        {/* PROCES */}
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

        {/* FAQ A RECENZE */}
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

        {/* POPTÁVKA (Importovaná klientská komponenta) */}
        <section id="poptavka" className="py-24 bg-[#000000] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Získejte kalkulaci zdarma</h2>
              <p className="text-zinc-400">Vyplňte základní údaje o vašem projektu. Ozveme se vám s orientační cenou.</p>
            </div>
            
            <ContactForm />
            
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}