// src/components/applicator/JobExecutionForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, ThermometerSnowflake, CheckCircle2, Zap, PackageOpen, Loader2, Info, ArrowLeft, Wind, CalendarDays, Clock } from 'lucide-react'
import { submitJobEvidence } from '@/actions/evidence'

type QuoteForApplicator = {
  id: string;
  customerName: string;
  street: string | null;
  city: string;
  zip: string | null;
  materialName: string;
  applicatorNotes: string | null;
  scheduledDate?: Date | string | null; // Přidáno do typu pro termín od supervizora
}

export default function JobExecutionForm({ quote }: { quote: QuoteForApplicator }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [step, setStep] = useState(1)

  // Úkoly a časy
  const [calledCustomer, setCalledCustomer] = useState(false)
  const [siteInspected, setSiteInspected] = useState(false)
  
  // Nová pole pro datum a čas začátku/konce
  const [actualStartTime, setActualStartTime] = useState<string>('')
  const [actualEndTime, setActualEndTime] = useState<string>('')

  // Technická data
  const [ambientTemp, setAmbientTemp] = useState<string>('')
  const [internalTemp, setInternalTemp] = useState<string>('')
  const [surfaceTemp, setSurfaceTemp] = useState<string>('')
  const [surfaceType, setSurfaceType] = useState<string>('Dřevo')
  const [reactorStart, setReactorStart] = useState<string>('')
  const [reactorEnd, setReactorEnd] = useState<string>('')

  // Vícepráce
  const [foilRolls, setFoilRolls] = useState<string>('0')
  const [packingHours, setPackingHours] = useState<string>('0')
  const [generatorKwh, setGeneratorKwh] = useState<string>('0')

  const mapQuery = `${quote.street || ''} ${quote.city} ${quote.zip || ''}`.trim()
  const mapUrl = `https://mapy.cz/zakladni?q=${encodeURIComponent(mapQuery)}`
  
  const phoneMatch = quote.applicatorNotes?.match(/(\+420)?\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}/)
  const phoneNumber = phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : null

  const isWinter = ambientTemp !== '' && parseFloat(ambientTemp) < 5

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    const result = await submitJobEvidence({
      quoteId: quote.id,
      ambientTemp: parseFloat(ambientTemp) || 0,
      internalTemp: parseFloat(internalTemp) || 0,
      surfaceTemp: parseFloat(surfaceTemp) || 0,
      surfaceType: surfaceType,
      reactorStart: parseInt(reactorStart) || 0,
      reactorEnd: parseInt(reactorEnd) || 0,
      foilRolls: parseInt(foilRolls) || 0,
      packingHours: parseFloat(packingHours) || 0,
      generatorKwh: parseFloat(generatorKwh) || 0,
      actualStartTime: actualStartTime || null, // Připraveno pro backend
      actualEndTime: actualEndTime || null,     // Připraveno pro backend
    })

    setIsSubmitting(false)

    if (result.success) {
      setIsSuccess(true)
    } else {
      alert(result.error)
    }
  }

  // Formátování plánovaného data pro zobrazení
  const formattedScheduledDate = quote.scheduledDate 
    ? new Date(quote.scheduledDate).toLocaleDateString('cs-CZ') 
    : 'Termín neurčen'

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-zinc-50 min-h-screen p-6 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-2xl font-black text-[#000000]">Skvělá práce!</h1>
        <p className="text-zinc-500 font-medium leading-relaxed">
          Stavba pro zákazníka <strong>{quote.customerName}</strong> byla úspěšně označena jako dokončená. Data o spotřebě a vícepracích byla předána supervizorovi k fakturaci.
        </p>
        <button 
          onClick={() => router.push('/admin/quotes')}
          className="mt-8 px-8 py-4 bg-[#000000] text-white font-bold rounded-xl shadow-lg w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} /> Zpět na dispečink
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-zinc-50 min-h-screen pb-20 shadow-xl overflow-hidden">
      
      {/* HLAVIČKA ZAKÁZKY */}
      <div className="bg-[#000000] text-[#FEFEFA] p-6 rounded-b-3xl shadow-lg relative z-10">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Realizace zakázky</h2>
        <h1 className="text-2xl font-black mb-4">{quote.customerName}</h1>
        
        <div className="space-y-3">
          {/* Zobrazení termínu naplánovaného od supervizora */}
          <div className="flex items-center gap-3 bg-zinc-800 p-3 rounded-xl text-sm font-bold border border-zinc-700">
            <CalendarDays size={20} className="text-amber-500" />
            <span className="text-zinc-200">Naplánováno na: {formattedScheduledDate}</span>
          </div>

          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl transition-colors text-sm font-bold">
            <MapPin size={20} className="text-[#FF4F00]" />
            <span className="truncate">{mapQuery}</span>
          </a>
          
          {phoneNumber ? (
            <a href={`tel:${phoneNumber}`} className="flex items-center gap-3 bg-green-500/10 text-green-400 p-3 rounded-xl transition-colors text-sm font-bold border border-green-500/20">
              <Phone size={20} /> Zavolat: {phoneNumber}
            </a>
          ) : (
            <div className="flex items-center gap-3 bg-zinc-800 p-3 rounded-xl text-sm font-bold text-zinc-400">
              <Phone size={20} /> Telefon není v poznámce uveden
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-2">
        
        {quote.applicatorNotes && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-sm mt-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold mb-2 text-sm uppercase">
              <Info size={18} /> Pokyny ze smlouvy
            </div>
            <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed font-medium">
              {quote.applicatorNotes}
            </p>
          </div>
        )}

        {/* KROK 1: Příjezd a kontrola */}
        {step === 1 && (
          <div className="bg-[#FEFEFA] p-5 rounded-2xl shadow-sm border border-zinc-200 animate-in slide-in-from-right-4">
            <h3 className="font-black text-[#000000] text-lg mb-4">1. Kontrola na místě a reálný čas</h3>
            
            <div className="space-y-5">
              {/* Sekce pro zadání reálného času začátku a konce práce */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm text-zinc-800">
                  <Clock size={16} className="text-[#FF4F00]"/> Reálný čas na stavbě
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Začátek práce</label>
                    <input 
                      type="datetime-local" 
                      value={actualStartTime} 
                      onChange={e => setActualStartTime(e.target.value)} 
                      className="w-full p-3 bg-white border border-zinc-200 rounded-lg font-bold text-[#000000] focus:ring-2 focus:ring-[#FF4F00] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Konec práce (odhad nebo přesně)</label>
                    <input 
                      type="datetime-local" 
                      value={actualEndTime} 
                      onChange={e => setActualEndTime(e.target.value)} 
                      className="w-full p-3 bg-white border border-zinc-200 rounded-lg font-bold text-[#000000] focus:ring-2 focus:ring-[#FF4F00] outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Původní checkboxy */}
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <input type="checkbox" checked={calledCustomer} onChange={e => setCalledCustomer(e.target.checked)} className="w-6 h-6 rounded border-zinc-300 text-[#FF4F00] focus:ring-[#FF4F00] accent-[#FF4F00]" />
                  <span className="font-bold text-sm text-zinc-700">Zákazník kontaktován, souhlasí s příjezdem</span>
                </label>

                <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <input type="checkbox" checked={siteInspected} onChange={e => setSiteInspected(e.target.checked)} className="w-6 h-6 rounded border-zinc-300 text-[#FF4F00] focus:ring-[#FF4F00] accent-[#FF4F00]" />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-zinc-700 block">Obhlídka stavby hotová</span>
                    <span className="text-xs text-zinc-500">Ověření oken, trámů a čistoty podkladu. Pokud není zakryto fólií, bude provedeno naúčtováno v kroku 3!</span>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)} 
              disabled={!calledCustomer || !siteInspected || !actualStartTime}
              className="w-full mt-6 py-4 bg-[#000000] text-white font-bold rounded-xl disabled:opacity-50 transition-all"
            >
              Pokračovat (Teploty a Stroj)
            </button>
          </div>
        )}

        {/* KROK 2: Stroj a Teploty */}
        {step === 2 && (
          <div className="bg-[#FEFEFA] p-5 rounded-2xl shadow-sm border border-zinc-200 animate-in slide-in-from-right-4">
            <h3 className="font-black text-[#000000] text-lg mb-4">2. Start reaktoru a teploty</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Venkovní °C</label>
                  <input type="number" value={ambientTemp} onChange={e => setAmbientTemp(e.target.value)} placeholder="0" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg font-bold text-lg text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Vnitřní °C</label>
                  <input type="number" value={internalTemp} onChange={e => setInternalTemp(e.target.value)} placeholder="0" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg font-bold text-lg text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" />
                </div>
              </div>

              {isWinter && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3 animate-in zoom-in-95 duration-300">
                  <ThermometerSnowflake className="text-blue-600 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm">ZIMNÍ PROTOKOL AKTIVNÍ</h4>
                    <p className="text-xs text-blue-700 mt-1">Venkovní teplota je pod +5 °C. Nastartujte kompresor, zapněte ohřev systému a materiálu. <strong>Nechte prohřívat minimálně 30 minut</strong> před aplikací načisto!</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Teplota podkladu °C</label>
                  <input type="number" value={surfaceTemp} onChange={e => setSurfaceTemp(e.target.value)} placeholder="0" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg font-bold text-lg text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Typ podkladu</label>
                  <select value={surfaceType} onChange={e => setSurfaceType(e.target.value)} className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg font-bold text-sm text-[#000000] focus:ring-2 focus:ring-[#FF4F00] outline-none">
                    <option value="Dřevo (Fólie)">Dřevo (Fólie)</option>
                    <option value="Zdivo">Zdivo</option>
                    <option value="Beton">Beton</option>
                    <option value="Plech">Plech</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Počítadlo reaktoru: START</label>
                <input type="number" value={reactorStart} onChange={e => setReactorStart(e.target.value)} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-lg text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" placeholder="Např. 12500" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-6 py-4 bg-zinc-100 text-zinc-600 font-bold rounded-xl">Zpět</button>
              <button onClick={() => setStep(3)} disabled={!ambientTemp || !reactorStart} className="flex-1 py-4 bg-[#000000] text-white font-bold rounded-xl disabled:opacity-50 transition-all">Přejít k závěru</button>
            </div>
          </div>
        )}

        {/* KROK 3: Konec a Vícepráce */}
        {step === 3 && (
          <div className="bg-[#FEFEFA] p-5 rounded-2xl shadow-sm border border-zinc-200 animate-in slide-in-from-right-4">
            <h3 className="font-black text-[#000000] text-lg mb-4">3. Závěr a Vícepráce</h3>
            
            <div className="space-y-6">
              
              <div className="bg-amber-50/50 p-4 rounded-xl border border-zinc-200">
                <h4 className="flex items-center gap-2 font-bold text-sm text-[#000000] mb-3">
                  <PackageOpen size={18} className="text-[#FF4F00]"/> Chybějící připravenost (Oblepování)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Spotřebováno rolí</label>
                    <input type="number" value={foilRolls} onChange={e => setFoilRolls(e.target.value)} className="w-full p-3 bg-white border border-zinc-200 rounded-lg font-bold text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Hodin práce</label>
                    <input type="number" value={packingHours} onChange={e => setPackingHours(e.target.value)} className="w-full p-3 bg-white border border-zinc-200 rounded-lg font-bold text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-zinc-200">
                <h4 className="flex items-center gap-2 font-bold text-sm text-[#000000] mb-3">
                  <Zap size={18} className="text-blue-600"/> Elektřina 380V chyběla
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Použití agregátu (Motohodiny / kW)</label>
                  <input type="number" value={generatorKwh} onChange={e => setGeneratorKwh(e.target.value)} className="w-full p-3 bg-white border border-zinc-200 rounded-lg font-bold text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" />
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Počítadlo reaktoru: KONEC</label>
                <input type="number" value={reactorEnd} onChange={e => setReactorEnd(e.target.value)} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-lg text-[#000000] placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF4F00] outline-none" placeholder="Např. 13200" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="px-6 py-4 bg-zinc-100 text-zinc-600 font-bold rounded-xl">Zpět</button>
              <button onClick={handleSubmit} disabled={!reactorEnd || isSubmitting} className="flex-1 py-4 bg-[#FF4F00] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                Ukončit a Odeslat
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}