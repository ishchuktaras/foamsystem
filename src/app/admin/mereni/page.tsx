// src/app/admin/mereni/page.tsx

'use client'

import { useState } from 'react'
import { Scan, Maximize, Ruler, Save, Edit3, Camera, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import ARScanner from '@/components/ARScanner' // Import nové komponenty

export default function MeasurementPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [hasData, setHasData] = useState(false)
  
  // Změřené/Upravitelné hodnoty (v metrech)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)

  // Vypočtená plocha
  const area = (width * height).toFixed(2)

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Hlavní Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] p-8 md:p-10 text-[#FEFEFA] shadow-xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
            Chytré zaměření
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Naskenujte prostor pomocí rozšířené reality (AR) nebo analyzujte fotku. Systém vygeneruje přesné proporce a vypočítá plochu k zateplení.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-8 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <Scan size={250} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEVÝ SLOUPEC - Ovládání a Skenování */}
        <div className="space-y-6">
          <div className="bg-[#FEFEFA] p-6 rounded-2xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold text-[#000000] mb-4">Vstupní data</h2>
            
            {!hasData ? (
              <div className="space-y-4">
                {/* ZDE JSME PŘIDALI PODMÍNKU PRO ZOBRAZENÍ SKENERU */}
                {isScanning ? (
                  <ARScanner 
                    onClose={() => setIsScanning(false)}
                    onComplete={(w, h) => {
                      setWidth(w)
                      setHeight(h)
                      setHasData(true)
                      setIsScanning(false)
                    }}
                  />
                ) : (
                  <>
                    <button 
                      onClick={() => setIsScanning(true)} // Změna: Spouští reálný stav skenování
                      className="w-full p-6 border-2 border-dashed border-[#FF4F00] bg-orange-50 hover:bg-orange-100 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
                    >
                      <Scan size={32} className="text-[#FF4F00]" />
                      <span className="font-bold text-[#FF4F00]">
                        Spustit AR měření (WebXR)
                      </span>
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-zinc-200"></div>
                      <span className="flex-shrink-0 mx-4 text-zinc-400 text-sm font-medium">NEBO</span>
                      <div className="flex-grow border-t border-zinc-200"></div>
                    </div>

                    <button className="w-full p-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-zinc-700 cursor-pointer">
                      <Camera size={20} />
                      Nahrát fotku pro AI analýzu
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm font-medium border border-amber-100">
                  <AlertCircle size={18} />
                  Zkontrolujte vygenerované proporce a v případě odchylky je upravte.
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-500 flex items-center gap-1">
                      <Ruler size={14} /> Šířka (m)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full p-3 bg-white border border-zinc-300 rounded-xl font-bold text-lg text-[#000000] focus:ring-2 focus:ring-[#FF4F00] focus:border-[#FF4F00] outline-none"
                      />
                      <Edit3 size={16} className="absolute right-3 top-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-500 flex items-center gap-1">
                      <Ruler size={14} className="rotate-90" /> Délka/Výška (m)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full p-3 bg-white border border-zinc-300 rounded-xl font-bold text-lg text-[#000000] focus:ring-2 focus:ring-[#FF4F00] focus:border-[#FF4F00] outline-none"
                      />
                      <Edit3 size={16} className="absolute right-3 top-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setHasData(false)}
                    className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors"
                  >
                    Měřit znovu
                  </button>
                  <Link 
                    href={`/admin/quotes/new?area=${area}`} 
                    className="flex-1 px-4 py-3 bg-[#000000] hover:bg-zinc-800 text-[#FEFEFA] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Save size={18} />
                    Přenést {area} m² do kalkulačky
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PRAVÝ SLOUPEC - Vizuální kontrola proporcí */}
        <div className="bg-[#FEFEFA] p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col">
          <h2 className="text-xl font-bold text-[#000000] mb-4 flex items-center gap-2">
            <Maximize size={20} className="text-[#FF4F00]" />
            Generované proporce
          </h2>
          
          <div className="flex-1 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center p-6 min-h-[300px]">
            {!hasData ? (
              <div className="text-center text-zinc-400">
                <Maximize size={48} className="mx-auto mb-2 opacity-20" />
                <p>Čekám na data z měření...</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                
                {/* DYNAMICKÝ BOX PROPORCÍ */}
                <div 
                  className="bg-[#FF4F00] bg-opacity-20 border-2 border-[#FF4F00] border-dashed rounded-lg flex items-center justify-center shadow-inner transition-all duration-300 relative"
                  style={{ 
                    aspectRatio: height > 0 ? `${width} / ${height}` : '1 / 1',
                    maxHeight: '250px',
                    maxWidth: '100%',
                    width: width >= height ? '100%' : 'auto',
                    height: height > width ? '100%' : 'auto'
                  }}
                >
                  <span className="absolute -top-6 text-sm font-bold text-zinc-600">{width} m</span>
                  <span className="absolute -right-12 text-sm font-bold text-zinc-600 rotate-90">{height} m</span>
                </div>

                <div className="text-center">
                  <div className="text-sm text-zinc-500 uppercase font-bold tracking-wider mb-1">Celková plocha</div>
                  <div className="text-4xl font-black text-[#000000]">
                    {area} <span className="text-xl text-zinc-400">m²</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}