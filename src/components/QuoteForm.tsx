// src/components/QuoteForm.tsx
'use client'

import { useState } from 'react'
import { Building2, MapPin, Search, Save, Loader2, AlertCircle, FileDown, Percent, FileSignature, Receipt } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createQuote, updateQuote } from '@/actions/quote'
import { calculateFoamProject, parseLambda } from '@/lib/calculations'
import jsPDF from 'jspdf'

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
  
  const [marginPercent, setMarginPercent] = useState<number>(100)

  const [isFetchingAres, setIsFetchingAres] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)
  const [isGeneratingContract, setIsGeneratingContract] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  
  const [aresError, setAresError] = useState('')

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
    
    if (initialData.id && initialData.totalCost && clientFinalPrice === 0) {
       const storedCost = Number(initialData.totalCost)
       const calculatedMargin = Math.round(((storedCost / calcResults.exactMaterialCost) - 1) * 100)
       if(marginPercent === 100 && calculatedMargin !== 100) {
           setMarginPercent(calculatedMargin > 0 ? calculatedMargin : 0)
       }
    }
    clientFinalPrice = Math.round(calcResults.exactMaterialCost * (1 + (marginPercent / 100)))
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
      // FIX ZDE: Nahrazení `any` za `unknown` a bezpečné ověření chyby
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

  // ==========================================
  // INICIALIZACE PDF S FONTEM A VEKTOROVÝM LOGEM
  // ==========================================
  const initPdf = async () => {
    const doc = new jsPDF()
    
    const loadFont = async (url: string, name: string, style: string) => {
      try {
        const res = await fetch(url)
        if (!res.ok) return 
        const blob = await res.blob()
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve((reader.result as string).split(',')[1])
          reader.readAsDataURL(blob)
        })
        doc.addFileToVFS(`${name}-${style}.ttf`, base64)
        doc.addFont(`${name}-${style}.ttf`, name, style)
      } catch (e) {
        console.warn(`Font ${url} nelze načíst.`)
      }
    }

    await loadFont('/fonts/Roboto-Regular.ttf', 'Roboto', 'normal')
    await loadFont('/fonts/Roboto-Bold.ttf', 'Roboto', 'bold')
    
    doc.setFont('Roboto', 'normal') 

    const drawLogo = (x: number, y: number) => {
      doc.setFont("Roboto", "bold")
      doc.setFontSize(22)
      doc.setTextColor(0, 0, 0)
      doc.text("IZOLACE", x, y)
      
      const w = doc.getTextWidth("IZOLACE")
      doc.setFillColor(255, 79, 0) 
      doc.roundedRect(x + w + 3, y - 7, 13, 9, 1.5, 1.5, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text("RS", x + w + 4.5, y - 0.5)
      doc.setTextColor(0, 0, 0) 
    }

    return { doc, drawLogo }
  }

  // ==========================================
  // 1. GENERÁTOR: CENOVÁ NABÍDKA
  // ==========================================
  const handleGenerateQuotePDF = async () => {
    if (!calcResults || !selectedMaterial || !customerName) return alert("Vyplňte jméno zákazníka a parametry.")
    setIsGeneratingQuote(true)
    
    try {
      const { doc, drawLogo } = await initPdf()
      const date = new Date().toLocaleDateString('cs-CZ')
      const companyName = companyProfile?.companyName || 'IZOLACE RS'
      
      drawLogo(20, 25)

      doc.setFontSize(22)
      doc.text('Cenová nabídka', 20, 42)
      doc.setFontSize(10)
      doc.setFont("Roboto", "normal")
      doc.setTextColor(100, 100, 100)
      doc.text(`Datum vystavení: ${date}`, 20, 49)
      
      doc.setFont("Roboto", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text('Dodavatel:', 120, 35)
      doc.setFont("Roboto", "normal")
      doc.text(companyName, 120, 42)
      if (companyProfile?.ico) doc.text(`IČO: ${companyProfile.ico}`, 120, 47)
      
      doc.setDrawColor(255, 79, 0) 
      doc.setLineWidth(0.5)
      doc.line(20, 58, 190, 58)

      doc.setFont("Roboto", "bold")
      doc.text('Odběratel:', 20, 68)
      doc.setFont("Roboto", "normal")
      doc.text(customerName, 20, 75)
      if (ico) doc.text(`IČO: ${ico}`, 20, 80)
      doc.text(`${street || ''}, ${city || ''} ${zip || ''}`, 20, ico ? 85 : 80)

      doc.setFont("Roboto", "bold")
      doc.text('Technická specifikace zateplení:', 20, 105)
      doc.setFont("Roboto", "normal")
      doc.text(`Aplikovaný materiál: ${selectedMaterial.name} (${selectedMaterial.type})`, 20, 115)
      doc.text(`Celková odhadovaná plocha: ${area} m²`, 20, 122)
      doc.text(`Požadovaná tloušťka izolační vrstvy: ${thickness} cm`, 20, 129)

      doc.setFillColor(0, 0, 0) 
      doc.rect(20, 145, 170, 30, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.text('Celková odhadovaná cena díla:', 25, 157)
      doc.setFontSize(20)
      doc.setFont("Roboto", "bold")
      doc.text(`${clientFinalPrice.toLocaleString('cs-CZ')} Kč`, 25, 168)

      doc.setTextColor(150, 150, 150)
      doc.setFontSize(9)
      doc.setFont("Roboto", "normal")
      doc.text('Uvedená cena obsahuje spotřebu materiálu a samotnou aplikaci.', 20, 190)
      doc.text('Tato nabídka je informativní a nepředstavuje závaznou smlouvu do jejího podpisu.', 20, 195)

      doc.save(`Nabidka-${customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e) {
      alert("Chyba při generování PDF. Zkontrolujte složku public/fonts.")
    } finally {
      setIsGeneratingQuote(false)
    }
  }

  // ==========================================
  // 2. GENERÁTOR: SMLOUVA O DÍLO
  // ==========================================
  const handleGenerateContractPDF = async () => {
    if (!calcResults || !selectedMaterial || !customerName) return alert("Vyplňte jméno zákazníka a parametry.")
    setIsGeneratingContract(true)
    
    try {
      const { doc, drawLogo } = await initPdf()
      const date = new Date().toLocaleDateString('cs-CZ')
      const companyName = companyProfile?.companyName || 'IZOLACE RS'
      
      drawLogo(20, 25)
      
      doc.setFontSize(18)
      doc.setFont("Roboto", "bold")
      doc.text('SMLOUVA O DÍLO', 105, 45, { align: 'center' })
      
      doc.setFontSize(10)
      doc.setFont("Roboto", "normal")
      doc.text('uzavřená podle ustanovení Občanského zákoníku', 105, 52, { align: 'center' })

      doc.setFont("Roboto", "bold")
      doc.text('1. Smluvní strany', 20, 70)
      
      doc.setFont("Roboto", "normal")
      doc.text('Zhotovitel:', 20, 80)
      doc.text(`${companyName}`, 45, 80)
      if (companyProfile?.ico) doc.text(`IČO: ${companyProfile.ico}`, 45, 85)
      if (companyProfile?.bankAccount) doc.text(`Číslo účtu: ${companyProfile.bankAccount}`, 45, 90)

      doc.text('Objednatel:', 20, 105)
      doc.text(`${customerName}`, 45, 105)
      if (ico) doc.text(`IČO: ${ico}`, 45, 110)
      doc.text(`${street || ''}, ${city || ''} ${zip || ''}`, 45, ico ? 115 : 110)

      const conditions = [
        "2. Předmět díla",
        `Zhotovitel se zavazuje k provedení aplikace stříkané izolační PUR pěny (${selectedMaterial.name}). Předpokládaný rozsah prací je ${area} m² o tloušťce ${thickness} cm.`,
        "3. Cena a platební podmínky",
        `Celková předběžná cena díla je stanovena na ${clientFinalPrice.toLocaleString('cs-CZ')} Kč. Objednatel uhradí zálohu ve výši 50 % před zahájením prací. Konečná částka bude vyúčtována dle skutečné spotřeby po předání díla.`,
        "4. Stavební připravenost a realizace",
        "Objednatel se zavazuje zajistit volný přístup na staveniště, možnost připojení k elektrické síti (380 V, jistič min. 25 A, zásuvka 5-kolík) a přístup k vodě. Plochy, které nemají být zasaženy pěnou (okna, pohledové trámy), musí být předem řádně zakryty fólií.",
        "5. Záruka a kvalita",
        "Zhotovitel poskytuje záruku na provedené práce v délce 60 měsíců. Životnost a tvarová stálost PUR pěny (nesesedá, neřídne) je garantována výrobcem po celou dobu životnosti stavby."
      ]

      let y = 135
      conditions.forEach(line => {
        if (line.match(/^[0-9]\./)) {
           doc.setFont("Roboto", "bold")
           y += 6
        } else {
           doc.setFont("Roboto", "normal")
        }
        const lines = doc.splitTextToSize(line, 170)
        doc.text(lines, 20, y)
        y += lines.length * 5 + 3
      })

      doc.setFont("Roboto", "bold")
      doc.text('6. Podpisy smluvních stran', 20, y + 10)
      doc.setFont("Roboto", "normal")
      doc.text(`V .......................... dne ${date}`, 20, y + 20)
      
      doc.text('......................................................', 20, y + 45)
      doc.text('Za zhotovitele', 30, y + 52)

      doc.text('......................................................', 120, y + 45)
      doc.text('Za objednatele', 130, y + 52)

      doc.save(`Smlouva-o-dilo-${customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e) {
      alert("Chyba při generování PDF. Zkontrolujte složku public/fonts.")
    } finally {
      setIsGeneratingContract(false)
    }
  }

  // ==========================================
  // 3. GENERÁTOR: ZÁLOHOVÁ FAKTURA
  // ==========================================
  const handleGenerateInvoicePDF = async () => {
    if (!calcResults || !selectedMaterial || !customerName) return alert("Vyplňte jméno zákazníka a parametry.")
    if (!companyProfile?.bankAccount) return alert("Pro fakturu si v Nastavení doplňte číslo bankovního účtu!")
    
    setIsGeneratingInvoice(true)
    
    try {
      const { doc, drawLogo } = await initPdf()
      const date = new Date()
      const dueDate = new Date()
      dueDate.setDate(date.getDate() + 7) 
      
      const zaloha = Math.round(clientFinalPrice * 0.5) 
      const vs = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0')
      
      drawLogo(20, 25)

      doc.setFontSize(20)
      doc.text('ZÁLOHOVÁ FAKTURA', 120, 25)
      
      doc.setFontSize(10)
      const companyName = companyProfile?.companyName || 'IZOLACE RS'
      doc.setFont("Roboto", "bold")
      doc.text('Dodavatel:', 20, 45)
      doc.setFont("Roboto", "normal")
      doc.text(companyName, 20, 52)
      if (companyProfile?.ico) doc.text(`IČO: ${companyProfile.ico}`, 20, 57)
      
      doc.setFont("Roboto", "bold")
      doc.text('Odběratel:', 120, 45)
      doc.setFont("Roboto", "normal")
      doc.text(customerName, 120, 52)
      if (ico) doc.text(`IČO: ${ico}`, 120, 57)
      doc.text(`${street || ''}, ${city || ''} ${zip || ''}`, 120, ico ? 62 : 57)

      doc.setDrawColor(200, 200, 200)
      doc.line(20, 75, 190, 75)

      doc.text(`Datum vystavení: ${date.toLocaleDateString('cs-CZ')}`, 20, 90)
      doc.setFont("Roboto", "bold")
      doc.setTextColor(220, 38, 38)
      doc.text(`Datum splatnosti: ${dueDate.toLocaleDateString('cs-CZ')}`, 120, 90)
      doc.setTextColor(0, 0, 0)
      doc.setFont("Roboto", "normal")

      doc.text('Položka', 20, 115)
      doc.text('Částka', 160, 115)
      doc.line(20, 120, 190, 120)
      
      doc.setFont("Roboto", "bold")
      doc.text(`Záloha na aplikaci PUR pěny (${selectedMaterial.name})`, 20, 130)
      doc.text(`${zaloha.toLocaleString('cs-CZ')} Kč`, 160, 130)

      doc.setFillColor(245, 245, 245)
      doc.rect(20, 150, 170, 45, 'F')
      doc.setFontSize(12)
      doc.text('PLATEBNÍ ÚDAJE:', 25, 162)
      
      doc.setFontSize(14)
      doc.text(`Číslo účtu: ${companyProfile.bankAccount}`, 25, 175)
      doc.text(`Variabilní symbol: ${vs}`, 25, 185)

      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.setFont("Roboto", "normal")
      doc.text('Nejedná se o daňový doklad. Vyúčtování proběhne konečnou fakturou po ukoncení prací.', 20, 210)

      doc.save(`Zalohovka-${customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e) {
      alert("Chyba při generování PDF.")
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = {
      customerName, ico, street, city, zip,
      materialName: selectedMaterial?.name || 'Nespecifikováno',
      area: String(area), thickness: String(thickness),
      totalCost: String(clientFinalPrice), applicatorNotes
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
      
      {/* LEVÝ SLOUPEC: Formulář */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#FEFEFA] p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200 space-y-6 md:space-y-8">
        
        <div className="space-y-5 md:space-y-6">
          <h3 className="text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2">Údaje o zákazníkovi</h3>
          
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">IČO (pro firmy)</label>
            <div className="flex gap-2 md:gap-3">
              <input type="text" value={ico} onChange={(e) => setIco(e.target.value.replace(/\D/g, ''))} placeholder="Např. 00006947" className="w-full px-3 py-3 md:px-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50"/>
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
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 pr-3 md:pl-11 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-3 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Ulice a č.p.</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-400"><MapPin size={18} /></div>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full pl-10 pr-3 md:pl-11 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Město *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
            <div className="sm:col-span-1 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">PSČ</label>
              <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6 pt-5 md:pt-6 border-t border-zinc-200">
          <h3 className="text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2">Technická specifikace</h3>
          
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Materiál *</label>
            <select value={selectedMaterialId} onChange={(e) => setSelectedMaterialId(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-zinc-50/50 truncate">
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
              <input type="number" required value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-bold bg-zinc-50/50"/>
            </div>
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Tloušťka (cm) *</label>
              <input type="number" required value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-bold bg-zinc-50/50"/>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide items-center gap-2">
              <AlertCircle size={16} className="text-[#FF4F00]" />
              Upozornění a pokyny pro aplikátora na stavbě
            </label>
            
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleAddPreset('Volat vždy 30 minut předem zákazníkovi')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF4F00] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">
                + Volat 30 min předem
              </button>
              <button type="button" onClick={() => handleAddPreset('Zakrýt: Trámy, omítky + střešní okna')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF4F00] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">
                + Zakrýt trámy/okna
              </button>
              <button type="button" onClick={() => handleAddPreset('Přípojka 380 V, jistič 25 A + zásuvka pětikolík')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF4F00] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">
                + Přípojka 380V
              </button>
            </div>

            <textarea 
              rows={4}
              value={applicatorNotes}
              onChange={(e) => setApplicatorNotes(e.target.value)}
              placeholder="• Zde se propisují jednotné pokyny pro aplikátora na stavbě..."
              className="w-full p-3 bg-zinc-50/50 border border-zinc-200 rounded-xl font-medium text-sm text-[#000000] focus:ring-2 focus:ring-[#FF4F00] outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-3.5 bg-[#FF4F00] hover:bg-[#E64700] text-[#FEFEFA] font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 hover:scale-[1.01] cursor-pointer">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {initialData.id ? 'Uložit změny v databázi' : 'Uložit do evidence'}
          </button>
        </div>
      </form>

      {/* PRAVÝ SLOUPEC: Obchodní cenotvorba a Dokumenty */}
      <div className="lg:col-span-1 space-y-4 md:space-y-6">
        
        <div className="bg-[#FEFEFA] p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Percent className="text-[#FF4F00]" size={20} />
            <h3 className="font-bold text-[#000000]">Obchodní marže</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 mb-4">Nastavte procentuální přirážku k nákupní ceně materiálu.</p>
          
          <input 
            type="range" min="0" max="300" step="5" value={marginPercent}
            onChange={(e) => setMarginPercent(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF4F00]"
          />
          <div className="text-center mt-3 font-black text-2xl text-[#FF4F00]">{marginPercent} %</div>
        </div>

        {calcResults && (
          <div className="bg-linear-to-br from-[#000000] to-[#1a1a1a] p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-lg text-[#FEFEFA] border border-zinc-800">
            <p className="text-zinc-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-1">Celková cena</p>
            <div className="text-3xl md:text-4xl font-black mb-4 truncate">{clientFinalPrice.toLocaleString('cs-CZ')} <span className="text-xl">Kč</span></div>
            
            <div className="space-y-2 text-xs md:text-sm text-zinc-300 pt-4 border-t border-zinc-800 mb-6">
              <div className="flex justify-between">
                <span>Čistý náklad:</span>
                <span className="font-medium text-[#FEFEFA]">{calcResults.exactMaterialCost.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>Záloha pro klienta (50 %):</span>
                <span className="font-bold text-[#FF4F00]">{(clientFinalPrice / 2).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            {/* GENERÁTORY DOKUMENTŮ */}
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Generování PDF</p>
              
              <button onClick={handleGenerateQuotePDF} disabled={isGeneratingQuote || !customerName} type="button" className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm transition-colors flex items-center gap-3 cursor-pointer">
                {isGeneratingQuote ? <Loader2 size={18} className="animate-spin text-[#FF4F00]" /> : <FileDown size={18} className="text-[#FF4F00]" />}
                Cenová nabídka
              </button>
              
              <button onClick={handleGenerateContractPDF} disabled={isGeneratingContract || !customerName} type="button" className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm transition-colors flex items-center gap-3 cursor-pointer">
                {isGeneratingContract ? <Loader2 size={18} className="animate-spin text-[#FF4F00]" /> : <FileSignature size={18} className="text-[#FF4F00]" />}
                Smlouva o dílo
              </button>

              <button onClick={handleGenerateInvoicePDF} disabled={isGeneratingInvoice || !customerName} type="button" className="w-full py-2.5 px-4 bg-[#FEFEFA] text-[#000000] hover:bg-zinc-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-3 cursor-pointer mt-2">
                {isGeneratingInvoice ? <Loader2 size={18} className="animate-spin text-[#FF4F00]" /> : <Receipt size={18} className="text-[#FF4F00]" />}
                Zálohová faktura
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