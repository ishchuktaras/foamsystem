// src/components/QuoteForm.tsx

'use client'

import { useState } from 'react'
import { Building2, MapPin, Search, Save, Loader2, AlertCircle, FileDown, Percent } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createQuote } from '@/actions/quote'
import { calculateFoamProject, parseLambda } from '@/lib/calculations'
import jsPDF from 'jspdf'

// --- PŘESNÉ TYPESCRIPT DEFINICE (TOTO OPRAVUJE TU CHYBU) ---
interface Material {
  id: string;
  name: string;
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
    materialId: string;
    area: string;
    thickness: string;
  };
}
// -----------------------------------------------------------

export default function QuoteForm({ materials, companyProfile, initialData }: QuoteFormProps) {
  const router = useRouter()
  
  // Zákazník
  const [ico, setIco] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  
  // Parametry zakázky
  const [selectedMaterialId, setSelectedMaterialId] = useState(initialData.materialId || (materials[0]?.id || ''))
  const [area, setArea] = useState<number | ''>(initialData.area ? Number(initialData.area) : '')
  const [thickness, setThickness] = useState<number | ''>(initialData.thickness ? Number(initialData.thickness) : '')
  
  // Obchodní marže (Výchozí 100% přirážka k nákupní ceně materiálu)
  const [marginPercent, setMarginPercent] = useState<number>(100)

  // UI stavy
  const [isFetchingAres, setIsFetchingAres] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [aresError, setAresError] = useState('')

  // Výpočet reálných čísel na pozadí
  const selectedMaterial = materials.find(m => m.id === selectedMaterialId)
  
  let calcResults = null
  let clientFinalPrice = 0

  if (selectedMaterial && area && thickness) {
    calcResults = calculateFoamProject({
      areaM2: Number(area),
      thicknessCm: Number(thickness),
      density: selectedMaterial.density,
      wasteFactor: selectedMaterial.wasteFactor,
      yieldPerSetM3: selectedMaterial.yieldPerSetM3,
      buyPricePerSet: selectedMaterial.buyPricePerSet || 0,
      lambda: parseLambda(selectedMaterial.lambda)
    })
    
    // Prodejní cena = Nákladová cena * (1 + (marže / 100))
    clientFinalPrice = calcResults.totalCost * (1 + (marginPercent / 100))
  }

  // ARES načítání
  const fetchAresData = async () => {
    if (!ico || ico.length < 6) {
      setAresError('Zadejte platné IČO.')
      return
    }
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
        setAresError('Nepodařilo se spojit s rejstříkem ARES.')
      }
    } finally {
      setIsFetchingAres(false)
    }
  }

  // Generování obchodního PDF pro klienta
  const handleGenerateClientPDF = () => {
    if (!calcResults || !selectedMaterial || !customerName) {
      alert("Vyplňte jméno zákazníka a parametry izolace.")
      return
    }
    setIsGeneratingPDF(true)
    
    try {
      const doc = new jsPDF()
      const date = new Date().toLocaleDateString('cs-CZ')
      
      // HLAVIČKA
      doc.setFontSize(22)
      doc.setTextColor(13, 27, 62) 
      doc.text('CENOVA NABIDKA', 20, 25)
      
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Datum vystaveni: ${date}`, 20, 32)
      doc.text(`Platnost nabidky: 14 dni`, 20, 37)

      // TVOJE FIRMA
      const companyName = companyProfile?.companyName || 'Dodavatel izolačních služeb'
      doc.setFont("helvetica", "bold")
      doc.text('Dodavatel:', 120, 25)
      doc.setFont("helvetica", "normal")
      doc.text(companyName, 120, 32)
      if (companyProfile?.ico) doc.text(`ICO: ${companyProfile.ico}`, 120, 37)
      if (companyProfile?.email) doc.text(companyProfile.email, 120, 42)
      if (companyProfile?.phone) doc.text(companyProfile.phone, 120, 47)

      doc.setDrawColor(59, 130, 246) 
      doc.setLineWidth(0.5)
      doc.line(20, 52, 190, 52)

      // ZÁKAZNÍK
      doc.setFontSize(11)
      doc.setTextColor(20, 20, 20)
      doc.setFont("helvetica", "bold")
      doc.text('Odberatel:', 20, 65)
      
      doc.setFont("helvetica", "normal")
      doc.text(customerName, 20, 72)
      if (ico) doc.text(`ICO: ${ico}`, 20, 77)
      doc.text(`${street || ''}`, 20, ico ? 82 : 77)
      doc.text(`${city || ''} ${zip || ''}`, 20, ico ? 87 : 82)

      // SPECIFIKACE ZAKÁZKY
      doc.setFont("helvetica", "bold")
      doc.text('Specifikace izolačního systemu:', 20, 105)
      doc.setFont("helvetica", "normal")
      
      doc.text(`Material: ${selectedMaterial.name}`, 20, 115)
      doc.text(`Celkova plocha k izolaci: ${area} m2`, 20, 122)
      doc.text(`Pozadovana tloustka vrstvy: ${thickness} cm`, 20, 129)

      // TEPELNÝ ODPOR
      if (calcResults.thermalResistance) {
        doc.setTextColor(59, 130, 246)
        doc.setFont("helvetica", "bold")
        doc.text(`Garantovany tepelny odpor (R): ${calcResults.thermalResistance} m2K/W`, 20, 140)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(20, 20, 20)
      }

      // CENOVÝ BOX
      doc.setFillColor(13, 27, 62) 
      doc.rect(20, 155, 170, 45, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.text('Celkova cena za diko vcetne materialu a prace:', 25, 170)
      
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(`${clientFinalPrice.toLocaleString('cs-CZ')} Kc`, 25, 188)

      // BANKOVNÍ SPOJENÍ
      if (companyProfile?.bankAccount) {
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Bankovni spojeni pro uhrazeni zalohy/faktury: ${companyProfile.bankAccount}`, 20, 220)
      }

      // PATIČKA
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Tato nabidka je informativni a nepredstavuje zavaznou smlouvu do jejiho podpisu.', 20, 275)

      doc.save(`Nabidka-${customerName.replace(/\s+/g, '-').toLowerCase() || 'klient'}.pdf`)
    } catch (error) {
      console.error(error)
      alert("Chyba při generování PDF.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Uložení nabídky do DB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = {
      customerName,
      ico,
      street,
      city,
      zip,
      materialName: selectedMaterial?.name || 'Nespecifikováno',
      area: String(area),
      thickness: String(thickness),
      totalCost: String(clientFinalPrice) 
    }

    const result = await createQuote(formData)

    if (result.success) {
      router.push('/admin/quotes')
      router.refresh()
    } else {
      alert(result.error || 'Něco se pokazilo při ukládání.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* LEVÝ SLOUPEC: Formulář */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        
        {/* ARES a Zákazník */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#0D1B3E] border-b border-gray-100 pb-2">Údaje o zákazníkovi</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">IČO (pro firmy)</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={ico}
                onChange={(e) => setIco(e.target.value.replace(/\D/g, ''))}
                placeholder="Např. 00006947" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] bg-gray-50/50"
              />
              <button 
                type="button"
                onClick={fetchAresData}
                disabled={isFetchingAres}
                className="px-6 py-3 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                {isFetchingAres ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Načíst
              </button>
            </div>
            {aresError && <p className="text-red-500 text-sm flex items-center gap-1 mt-1"><AlertCircle size={14} /> {aresError}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Název firmy / Jméno a příjmení *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Building2 size={18} /></div>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Ulice a č.p.</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><MapPin size={18} /></div>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"/>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Město *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"/>
            </div>
            <div className="md:col-span-1 space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">PSČ</label>
              <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"/>
            </div>
          </div>
        </div>

        {/* Technické parametry */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-[#0D1B3E] border-b border-gray-100 pb-2">Technická specifikace</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Materiál *</label>
            <select value={selectedMaterialId} onChange={(e) => setSelectedMaterialId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium bg-gray-50/50">
              {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Plocha (m²) *</label>
              <input type="number" required value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-bold"/>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Tloušťka (cm) *</label>
              <input type="number" required value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-bold"/>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 hover:scale-[1.01] cursor-pointer">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Uložit do evidence
          </button>
        </div>
      </form>

      {/* PRAVÝ SLOUPEC: Obchodní cenotvorba a PDF */}
      <div className="lg:col-span-1 space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="text-emerald-500" size={20} />
            <h3 className="font-bold text-[#0D1B3E]">Obchodní marže</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Nastavte procentuální přirážku k nákupní ceně materiálu (zahrnuje práci, režii a zisk).</p>
          
          <input 
            type="range" 
            min="0" max="300" step="5"
            value={marginPercent}
            onChange={(e) => setMarginPercent(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
          />
          <div className="text-center mt-3 font-black text-2xl text-[#3B82F6]">{marginPercent} %</div>
        </div>

        {calcResults && (
          <div className="bg-gradient-to-br from-[#0D1B3E] to-[#1a2c5b] p-6 rounded-2xl shadow-lg text-white">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">Cena pro klienta</p>
            <div className="text-4xl font-black mb-4">{clientFinalPrice.toLocaleString('cs-CZ')} <span className="text-xl">Kč</span></div>
            
            <div className="space-y-2 text-sm text-blue-100/80 pt-4 border-t border-white/10">
              <div className="flex justify-between">
                <span>Nákup materiálu:</span>
                <span className="font-medium text-white">{calcResults.totalCost.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>Hrubý zisk (Marže):</span>
                <span className="font-medium text-emerald-400">{(clientFinalPrice - calcResults.totalCost).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGenerateClientPDF}
              disabled={isGeneratingPDF || !customerName}
              className="mt-6 w-full py-3 bg-white text-[#0D1B3E] hover:bg-gray-50 font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPDF ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              Vytvořit PDF pro klienta
            </button>
            {!customerName && <p className="text-xs text-blue-200/50 text-center mt-2">Nejprve vyplňte jméno zákazníka</p>}
          </div>
        )}
      </div>

    </div>
  )
}