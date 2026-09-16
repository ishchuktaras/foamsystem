// src/components/landing/Services.tsx
import { Home, Building, Factory, ArrowUpToLine, Layers, ShieldCheck } from 'lucide-react'

const services = [
  {
    title: 'Šikmé střechy a podkroví',
    description: 'Měkká PUR pěna dokonale vyplní každý prostor mezi krokvemi bez tepelných mostů. Zabrání únikům tepla, v létě chrání před přehříváním a funguje jako skvělá akustická izolace.',
    icon: Home
  },
  {
    title: 'Ploché střechy',
    description: 'Tvrdá pěna vytvoří jednolitou, bezespárou a 100% voděodolnou vrstvu. Řeší zatékání i tepelné ztráty v jednom jediném kroku a prodlužuje životnost střechy.',
    icon: ArrowUpToLine
  },
  {
    title: 'Fasády a základy',
    description: 'Tvrdá pěna s uzavřenou strukturou nepustí vlhkost k základu domu. Ideální řešení pro sokly a fasády bez nutnosti složitého mechanického kotvení.',
    icon: Building
  },
  {
    title: 'Dřevostavby',
    description: 'Rychlá aplikace a absolutní vzduchotěsnost. Naše stříkaná izolace zaručuje splnění přísných norem pro nízkoenergetické a pasivní domy (Blower Door test).',
    icon: ShieldCheck
  },
  {
    title: 'Haly a průmysl',
    description: 'Rychlé zateplení obrovských ploch (až stovky m² denně). Účinně zabraňuje kondenzaci vody na plechových střechách a radikálně snižuje náklady na vytápění.',
    icon: Factory
  },
  {
    title: 'Stropy a podlahy',
    description: 'Tepelná i kročejová izolace v jednom. Pěna se dostane do každé spáry, zamezí průvanu a vytvoří dokonalý podklad bez zbytečného zatížení konstrukce.',
    icon: Layers
  }
]

export default function Services() {
  return (
    <section id="sluzby" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#000000] tracking-tight mb-6">
            Co všechno <span className="text-[#FF4F00]">zateplujeme?</span>
          </h2>
          <p className="text-lg text-zinc-600 font-medium leading-relaxed">
            Stříkaná izolace se přizpůsobí jakémukoliv povrchu. Podívejte se, kde všude naše PUR pěna odvádí tu nejlepší práci.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div 
                key={index} 
                className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#FF4F00]/10 hover:border-[#FF4F00]/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF4F00] group-hover:border-[#FF4F00] transition-colors duration-300 shadow-sm">
                  <Icon className="text-[#000000] group-hover:text-white transition-colors duration-300" size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#000000] mb-4">
                  {service.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}