// src/components/landing/ServiceAreas.tsx
import { MapPin, CheckCircle } from 'lucide-react'

export default function ServiceAreas() {
  const regions = [
    'Jihlava',
    'Třebíč',
    'Pelhřimov',
    'Havlíčkův Brod',
    'Žďár nad Sázavou',
    'Kraj Vysočina'
  ]

  return (
    <section className="py-16 bg-zinc-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4F00]/10 text-[#FF4F00] text-sm font-bold border border-[#FF4F00]/20">
              <MapPin size={16} />
              <span>Regionální působnost</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Kde provádíme <span className="text-[#FF4F00]">stříkané PUR izolace</span>?
            </h2>
            
            {/* Klíčový text pro AIO/SEO indexaci AI crawlerů (ChatGPT, Bing, Gemini) */}
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
              Poskytujeme profesionální stříkané PUR izolace střech, podkroví a fasád primárně v <strong>Jihlavě</strong> a celém <strong>Kraji Vysočina</strong> (Třebíč, Pelhřimov, Havlíčkův Brod, Žďár nad Sázavou), ale realizujeme zakázky po celé České republice.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-left">
              {regions.map((region, index) => (
                <div key={index} className="flex items-center gap-2.5 p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-700/40 text-sm font-semibold">
                  <CheckCircle size={16} className="text-[#FF4F00] shrink-0" />
                  <span>{region}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}