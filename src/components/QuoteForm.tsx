// src/components/QuoteForm.tsx
'use client'

import { useState } from 'react'
import { Building2, MapPin, Search, Save, Loader2, AlertCircle, FileDown, Percent, Receipt, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createQuote, updateQuote } from '@/actions/quote'
import { generateCombinedPDF, generateInvoicePDF } from '@/lib/pdfGenerator'

interface Material {
  id: string;
  name: string;
  type: string;
  density: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number | null;
  lambda?: string | null;
}

interface CompanyProfile {
  companyName?: string | null;
  ico?: string | null;
  email?: string | null;
  phone?: string | null;
  bankAccount?: string | null;
}

interface QuoteFormProps {
  materials: Material[];
  companyProfile: CompanyProfile | null;
  initialData: {
    id?: string;
    materialId: string;
    area: string;
    thickness: string;
    customerName?: string;
    ico?: string;
    street?: string;
    city?: string;
    zip?: string;
    totalCost?: string;
    applicatorNotes?: string | null;
  };
}

export default function QuoteForm({ materials, companyProfile, initialData }: QuoteFormProps) {
  const router = useRouter()
  
  const [ico, setIco] = useState(initialData.ico || '')
  const [customerName, setCustomerName] = useState(initialData.customerName || '')
  const [street, setStreet] = useState(initialData.street || '')
  const [city, setCity] = useState(initialData.city || '')
  const [zip, setZip] = useState(initialData.zip || '')
  const [applicatorNotes, setApplicatorNotes] = useState(initialData.applicatorNotes || '')

  const [selectedMaterialId, setSelectedMaterialId] = useState(initialData.materialId || (materials[0]?.id || ''))
  const [area, setArea] = useState<number | ''>(initialData.area ? Number(initialData.area) : '')
  const [thickness, setThickness] = useState<number | ''>(initialData.thickness ? Number(initialData.thickness) : '')
  
  const [lossPercent, setLossPercent] = useState<number>(10)
  const [marginPercent, setMarginPercent] = useState<number>(100)

  const [isFetchingAres, setIsFetchingAres] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingCombined, setIsGeneratingCombined] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [aresError, setAresError] = useState('')

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId)
  
  let basePrice = 0
  let vat = 0
  let totalPrice = 0
  let techData = null

  if (selectedMaterial && area && thickness) {
    const thicknessM = Number(thickness) / 100
    const pureVolumeM3 = Number(area) * thicknessM
    const lossMultiplier = 1 + (lossPercent / 100)
    const totalVolumeM3 = pureVolumeM3 * lossMultiplier
    
    const exactSets = totalVolumeM3 / selectedMaterial.yieldPerSetM3
    const totalSets = Math.ceil(exactSets)
    const estimatedLifts = Math.round(exactSets * 4011)

    const buyPricePerSet = selectedMaterial.buyPricePerSet || 0
    const exactMaterialCost = exactSets * buyPricePerSet
    
    if (initialData.id && initialData.totalCost && basePrice === 0) {
       const storedCost = Number(initialData.totalCost)
       const calculatedMargin = Math.round(((storedCost / exactMaterialCost) - 1) * 100)
       if(marginPercent === 100 && calculatedMargin !== 100) {
           setMarginPercent(calculatedMargin > 0 ? calculatedMargin : 0)
       }
    }
    
    basePrice = Math.round(exactMaterialCost * (1 + (marginPercent / 100)))
    vat = Math.round(basePrice * 0.21)
    totalPrice = basePrice + vat

    techData = {
      pureVolumeM3: pureVolumeM3.toFixed(2),
      totalVolumeM3: totalVolumeM3.toFixed(2),
      wastedVolumeM3: (totalVolumeM3 - pureVolumeM3).toFixed(2),
      exactSets: exactSets.toFixed(2),
      totalSets,
      estimatedLifts,
      exactMaterialCost: Math.round(exactMaterialCost)
    }
  }

  const fetchAresData = async () => {
    if (!ico || ico.length < 6) return setAresError('Zadejte platné IČO.')
    setIsFetchingAres(true)
    setAresError('')
    try {
      const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`)
      if (!response.ok) throw new Error('Subjekt nenalezen.')
      const data = await response.json()
      setCustomerName(data.obchodniJmeno || '')
      if (data.sidlo) {
        const adresa = []
        if (data.sidlo.nazevUlice) adresa.push(data.sidlo.nazevUlice)
        if (data.sidlo.cisloDomovni) adresa.push(data.sidlo.cisloOrientacni ? `${data.sidlo.cisloDomovni}/${data.sidlo.cisloOrientacni}` : data.sidlo.cisloDomovni)
        setStreet(adresa.join(' ') || data.sidlo.nazevObce || '')
        setCity(data.sidlo.nazevObce || '')
        setZip(data.sidlo.psc ? data.sidlo.psc.toString() : '')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAresError(error.message)
      } else {
        setAresError('Nepodařilo se spojit s ARES.')
      }
    } finally {
      setIsFetchingAres(false)
    }
  }

  const handleAddPreset = (presetText: string) => {
    setApplicatorNotes(prev => prev ? `${prev}\n• ${presetText}` : `• ${presetText}`)
  }

  const handleGenerateCombined = async () => {
    setIsGeneratingCombined(true)
    await generateCombinedPDF({
      customerName, ico, street, city, zip,
      materialName: selectedMaterial?.name || '',
      area, thickness, basePrice, vat, totalPrice,
      companyProfile
    })
    setIsGeneratingCombined(false)
  }

  const handleGenerateInvoice = async () => {
    setIsGeneratingInvoice(true)
    await generateInvoicePDF({
      customerName, ico, street, city, zip,
      materialName: selectedMaterial?.name || '',
      area, thickness, basePrice, vat, totalPrice,
      companyProfile
    })
    setIsGeneratingInvoice(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = {
      customerName, ico, street, city, zip,
      materialName: selectedMaterial?.name || 'Nespecifikováno',
      area: String(area), thickness: String(thickness),
      totalCost: String(basePrice),
      applicatorNotes
    }

    let result;
    if (initialData.id) result = await updateQuote(initialData.id, formData)
    else result = await createQuote(formData)

    if (result.success) {
      router.push('/admin/quotes')
      router.refresh()
    } else {
      alert(result.error || 'Něco se pokazilo při ukládání.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start">
      
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#FEFEFA] p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200 space-y-6 md:space-y-8">
        
        <div className="space-y-5 md:space-y-6">
          <h3 className="text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2">Údaje o zákazníkovi</h3>
          
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">IČO (pro firmy)</label>
            <div className="flex gap-2 md:gap-3">
              <input type="text" value={ico} onChange={(e) => setIco(e.target.value.replace(/\D/g, ''))} placeholder="Např. 00006947" className="w-full px-3 py-3 md:px-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] bg-zinc-50"/>
              <button type="button" onClick={fetchAresData} disabled={isFetchingAres} className="px-4 md:px-6 py-3 bg-[#000000] hover:bg-zinc-800 text-[#FEFEFA] font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0">
                {isFetchingAres ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span className="hidden sm:inline">Načíst</span>
              </button>
            </div>
            {aresError && <p className="text-red-500 text-sm flex items-center gap-1 mt-1"><AlertCircle size={14} /> {aresError}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Název firmy / Jméno *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-400"><Building2 size={18} /></div>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 pr-3 md:pl-11 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-3 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Ulice a č.p.</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-400"><MapPin size={18} /></div>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full pl-10 pr-3 md:pl-11 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Město *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
            <div className="sm:col-span-1 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">PSČ</label>
              <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6 pt-5 md:pt-6 border-t border-zinc-200">
          <h3 className="text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2">Technická specifikace</h3>
          
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Materiál *</label>
            <select value={selectedMaterialId} onChange={(e) => setSelectedMaterialId(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50 truncate">
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.type}, {m.density} kg/m³)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Plocha (m²) *</label>
              <input type="number" required min="1" max="10000" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-bold bg-zinc-50/50"/>
            </div>
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Tloušťka (cm) *</label>
              <input type="number" required min="1" max="100" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-bold bg-zinc-50/50"/>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="flex justify-between items-center">
              <label className="flex text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide items-center gap-2">
                <Settings size={16} className="text-[#FF8730]" /> Předpokládaný přestřik
              </label>
              <span className="font-black text-[#FF8730] text-lg">{lossPercent} %</span>
            </div>
            <input 
              type="range" min="5" max="15" step="1" value={lossPercent}
              onChange={(e) => setLossPercent(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF8730]"
            />
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>5 % (Ideální podmínky)</span>
              <span>15 % (Ztížený přístup)</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <label className="flex text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide items-center gap-2">
              <AlertCircle size={16} className="text-[#FF8730]" />
              Upozornění a pokyny pro aplikátora na stavbě
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleAddPreset('Volat vždy 30 minut předem zákazníkovi')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF8730] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">+ Volat 30 min předem</button>
              <button type="button" onClick={() => handleAddPreset('Zakrýt: Trámy, omítky + střešní okna')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF8730] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">+ Zakrýt trámy/okna</button>
              <button type="button" onClick={() => handleAddPreset('Přípojka 380 V, jistič 25 A + zásuvka pětikolík')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF8730] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">+ Přípojka 380V</button>
            </div>
            <textarea 
              rows={4} value={applicatorNotes} onChange={(e) => setApplicatorNotes(e.target.value)} placeholder="• Zde se propisují jednotné pokyny pro aplikátora na stavbě..."
              className="w-full p-3 bg-zinc-50/50 border border-zinc-200 rounded-xl font-medium text-sm text-[#000000] focus:ring-2 focus:ring-[#FF8730] outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-3.5 bg-[#FF8730] hover:bg-[#E67020] text-[#FEFEFA] font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 hover:scale-[1.01] cursor-pointer">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {initialData.id ? 'Uložit změny v databázi' : 'Uložit do evidence'}
          </button>
        </div>
      </form>

      <div className="lg:col-span-1 space-y-4 md:space-y-6">
        {techData && (
          <div className="bg-[#FEFEFA] p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200">
            <h3 className="font-bold text-[#000000] mb-4 text-sm uppercase tracking-wide">Technická predikce spotřeby</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-center">
                <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Odhad sad k naložení</p>
                <p className="text-2xl font-black text-[#000000]">{techData.totalSets} <span className="text-sm font-medium text-zinc-500">ks</span></p>
                <p className="text-[10px] text-zinc-400 mt-1">Přesně: {techData.exactSets}</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-center">
                <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Předpoklad Graco A25</p>
                <p className="text-xl font-black text-[#000000] mt-1">{techData.estimatedLifts.toLocaleString('cs-CZ')} <span className="text-xs font-medium text-zinc-500">zdvihů</span></p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-3">
              <span>Čistý objem: {techData.pureVolumeM3} m³</span>
              <span className="text-red-500 font-bold">+ {techData.wastedVolumeM3} m³ odpad</span>
            </div>
          </div>
        )}

        <div className="bg-[#FEFEFA] p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Percent className="text-[#FF8730]" size={20} />
            <h3 className="font-bold text-[#000000]">Obchodní marže</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 mb-4">Zadejte procentuální přirážku k nákupní ceně materiálu.</p>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input 
                type="number" min="0" step="1" 
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-2xl font-black text-[#FF8730] text-center"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">%</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {[20, 50, 80, 100].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMarginPercent(val)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-colors ${marginPercent === val ? 'bg-[#FF8730] text-white border-[#FF8730]' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}
                >
                  {val} %
                </button>
              ))}
            </div>
          </div>
        </div>

        {techData && (
          <div className="bg-linear-to-br from-[#000000] to-[#1a1a1a] p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-lg text-[#FEFEFA] border border-zinc-800">
            <p className="text-zinc-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-2 border-b border-zinc-800 pb-2">Rozpad ceny</p>
            <div className="space-y-2 text-xs md:text-sm text-zinc-300 mb-4">
              <div className="flex justify-between">
                <span>Cena bez DPH:</span>
                <span className="font-medium text-[#FEFEFA]">{basePrice.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>DPH (21 %):</span>
                <span className="font-medium text-[#FEFEFA]">{vat.toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-black mb-4 text-[#FF8730] truncate pt-4 border-t border-zinc-700">
              {totalPrice.toLocaleString('cs-CZ')} <span className="text-xl">Kč</span>
            </div>
            <div className="space-y-2 text-xs md:text-sm text-zinc-300 pt-2 border-t border-zinc-800 mb-6">
              <div className="flex justify-between">
                <span>Čistý náklad (vč. odpadu):</span>
                <span className="font-medium text-[#FEFEFA]">{techData.exactMaterialCost.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Záloha pro klienta (80 %):</span>
                <span className="font-bold text-lg text-[#FF8730]">{(totalPrice * 0.8).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Generování PDF</p>
              <button onClick={handleGenerateCombined} disabled={isGeneratingCombined || !customerName} type="button" className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm transition-colors flex items-center gap-3 cursor-pointer">
                {isGeneratingCombined ? <Loader2 size={18} className="animate-spin text-[#FF8730]" /> : <FileDown size={18} className="text-[#FF8730]" />} Smlouva o dílo a nabídka
              </button>
              <button onClick={handleGenerateInvoice} disabled={isGeneratingInvoice || !customerName} type="button" className="w-full py-2.5 px-4 bg-[#FEFEFA] text-[#000000] hover:bg-zinc-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-3 cursor-pointer mt-2">
                {isGeneratingInvoice ? <Loader2 size={18} className="animate-spin text-[#FF8730]" /> : <Receipt size={18} className="text-[#FF8730]" />} Zálohová faktura (80 %)
              </button>
            </div>
            {!customerName && <p className="text-xs text-red-400 text-center mt-4">Pro generování PDF vyplňte zákazníka</p>}
            {!companyProfile?.bankAccount && customerName && <p className="text-xs text-amber-400 text-center mt-4">Pro fakturu chybí číslo účtu (Nastavení)</p>}
          </div>
        )}
      </div>
    </div>
  )
}