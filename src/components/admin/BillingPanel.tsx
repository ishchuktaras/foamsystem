// src/components/admin/BillingPanel.tsx
'use client'

import { useState } from 'react'
import { Calculator, FileText, Save, FileDown, Loader2, CheckCircle2, Zap, PackageOpen } from 'lucide-react'
import { saveBillingData } from '@/actions/evidence'
import jsPDF from 'jspdf'

interface CompanyProfileData {
  companyName?: string | null;
  ico?: string | null;
  bankAccount?: string | null;
}

interface QuoteData {
  customerName: string;
  ico?: string | null;
  street?: string | null;
  city?: string | null;
  zip?: string | null;
  materialName: string;
  totalCost: string;
}

interface JobEvidenceData {
  id: string;
  pricePerKg: number | null;
  machineCoefficient: number | null;
  foilRolls: number;
  packingHours: number;
  generatorKwh: number | null;
  heightsSurcharge: number | null;
  difficultEnvSurcharge: number | null;
  reactorStart: number;
  reactorEnd: number;
}

type BillingPanelProps = {
  quote: QuoteData;
  evidence: JobEvidenceData;
  companyProfile: CompanyProfileData | null;
}

export default function BillingPanel({ quote, evidence, companyProfile }: BillingPanelProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saved, setSaved] = useState(false)

  // Výchozí výpočet zdvihů z evidence
  const strokes = evidence.reactorEnd - evidence.reactorStart
  const initialCoefficient = evidence.machineCoefficient || 0.12

  // Stav pro uživatelské úpravy
  const [machineCoefficient, setMachineCoefficient] = useState<number>(initialCoefficient)
  
  // Reálná spotřeba v kg - předvyplní se výpočtem, ale jde přepsat ručně
  const [usedKg, setUsedKg] = useState<number>(strokes > 0 ? Math.round(strokes * initialCoefficient * 10) / 10 : 0)
  
  // Prodejní cena za 1 kg pro klienta
  const [pricePerKg, setPricePerKg] = useState<number>(evidence.pricePerKg || 350) 

  const [foilRollPrice, setFoilRollPrice] = useState<number>(150) 
  const [packingHourRate, setPackingHourRate] = useState<number>(350) 
  const [generatorKwRate, setGeneratorKwRate] = useState<number>(20) 
  const [heightsSurcharge, setHeightsSurcharge] = useState<number>(evidence.heightsSurcharge || 0)
  const [difficultEnvSurcharge, setDifficultEnvSurcharge] = useState<number>(evidence.difficultEnvSurcharge || 0)

  // Sledování změn pro synchronizaci bez useEffectu (zabraňuje kaskádovým renderům)
  const [prevStrokes, setPrevStrokes] = useState(strokes)
  const [prevCoefficient, setPrevCoefficient] = useState(machineCoefficient)

  if (strokes !== prevStrokes || machineCoefficient !== prevCoefficient) {
    setPrevStrokes(strokes)
    setPrevCoefficient(machineCoefficient)
    setUsedKg(Math.round(strokes * machineCoefficient * 10) / 10)
  }

  const materialCost = usedKg * pricePerKg
  const packingCost = (evidence.foilRolls * foilRollPrice) + (evidence.packingHours * packingHourRate)
  const generatorCost = (evidence.generatorKwh || 0) * generatorKwRate
  
  const finalTotal = materialCost + packingCost + generatorCost + heightsSurcharge + difficultEnvSurcharge

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    const result = await saveBillingData(evidence.id, {
      pricePerKg,
      machineCoefficient,
      packingPriceRate: packingCost,
      heightsSurcharge,
      difficultEnvSurcharge,
      finalInvoiceTotal: finalTotal,
      generatorSurcharge: generatorCost
    })
    setIsSaving(false)
    if (result.success) setSaved(true)
    else alert(result.error)
  }

  const generateInvoicePDF = async () => {
    setIsGenerating(true)
    try {
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

      // Hlavička
      doc.setFont("Roboto", "bold")
      doc.setFontSize(22)
      doc.setTextColor(0, 0, 0)
      doc.text("FAKTURA - DAŇOVÝ DOKLAD", 20, 25)
      
      doc.setFontSize(10)
      const companyName = companyProfile?.companyName || 'IZOLACE RS'
      doc.text('Dodavatel:', 20, 45)
      doc.setFont("Roboto", "normal")
      doc.text(companyName, 20, 52)
      if (companyProfile?.ico) doc.text(`IČO: ${companyProfile.ico}`, 20, 57)
      
      doc.setFont("Roboto", "bold")
      doc.text('Odběratel:', 120, 45)
      doc.setFont("Roboto", "normal")
      doc.text(quote.customerName, 120, 52)
      if (quote.ico) doc.text(`IČO: ${quote.ico}`, 120, 57)
      doc.text(`${quote.street || ''}, ${quote.city || ''} ${quote.zip || ''}`, 120, quote.ico ? 62 : 57)

      doc.setDrawColor(255, 79, 0)
      doc.setLineWidth(0.5)
      doc.line(20, 70, 190, 70)

      const issueDate = new Date()
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14) 
      const vs = issueDate.getFullYear().toString() + (issueDate.getMonth() + 1).toString().padStart(2, '0') + issueDate.getDate().toString().padStart(2, '0')

      doc.text(`Datum vystavení: ${issueDate.toLocaleDateString('cs-CZ')}`, 20, 85)
      doc.setFont("Roboto", "bold")
      doc.setTextColor(220, 38, 38)
      doc.text(`Datum splatnosti: ${dueDate.toLocaleDateString('cs-CZ')}`, 120, 85)
      doc.setTextColor(0, 0, 0)

      doc.setFont("Roboto", "bold")
      doc.text('Položka', 20, 105)
      doc.text('Cena s DPH', 160, 105)
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 110, 190, 110)
      
      doc.setFont("Roboto", "normal")
      let y = 120
      
      doc.text(`Aplikace PUR pěny (${quote.materialName}): ${usedKg} kg`, 20, y)
      doc.text(`${Math.round(materialCost).toLocaleString('cs-CZ')} Kč`, 160, y)
      y += 10

      if (packingCost > 0) {
        doc.text(`Vícepráce: Zakrývání a fólie (${evidence.foilRolls} ks, ${evidence.packingHours} hod)`, 20, y)
        doc.text(`${Math.round(packingCost).toLocaleString('cs-CZ')} Kč`, 160, y)
        y += 10
      }

      if (generatorCost > 0) {
        doc.text(`Provoz vlastního agregátu (${evidence.generatorKwh || 0} kWh)`, 20, y)
        doc.text(`${Math.round(generatorCost).toLocaleString('cs-CZ')} Kč`, 160, y)
        y += 10
      }

      if (heightsSurcharge > 0) {
        doc.text(`Příplatek: Práce ve výškách`, 20, y)
        doc.text(`${Math.round(heightsSurcharge).toLocaleString('cs-CZ')} Kč`, 160, y)
        y += 10
      }
      
      if (difficultEnvSurcharge > 0) {
        doc.text(`Příplatek: Ztížené prostředí`, 20, y)
        doc.text(`${Math.round(difficultEnvSurcharge).toLocaleString('cs-CZ')} Kč`, 160, y)
        y += 10
      }

      const originalCostNum = Number(quote.totalCost) || 0
      const zaloha = Math.round(originalCostNum * 0.5)
      doc.setTextColor(150, 150, 150)
      doc.text(`Odečet uhrazené zálohy:`, 20, y + 5)
      doc.text(`-${zaloha.toLocaleString('cs-CZ')} Kč`, 160, y + 5)
      
      const kUhrade = finalTotal - zaloha

      doc.setFillColor(245, 245, 245)
      doc.rect(20, y + 15, 170, 45, 'F')
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.text('K ÚHRADĚ CELKEM:', 25, y + 28)
      doc.setFontSize(22)
      doc.setFont("Roboto", "bold")
      doc.text(`${Math.max(0, Math.round(kUhrade)).toLocaleString('cs-CZ')} Kč`, 130, y + 30)

      doc.setFontSize(12)
      doc.text(`Číslo účtu: ${companyProfile?.bankAccount || 'DOPLŇTE V NASTAVENÍ'}`, 25, y + 45)
      doc.text(`Variabilní symbol: ${vs}`, 25, y + 52)

      doc.save(`Faktura-Konecna-${quote.customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (error) {
      alert('Chyba při generování PDF.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-[#FEFEFA] p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
        <div className="p-3 bg-[#FF4F00]/10 text-[#FF4F00] rounded-xl"><Calculator size={24} /></div>
        <div>
          <h2 className="text-xl font-black text-[#000000]">Vyúčtování stavby a Fakturace</h2>
          <p className="text-sm text-zinc-500">Na základě reálných dat zadaných aplikátorem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* LEVÝ SLOUPEC: SPOTŘEBA A SAZBY */}
        <div className="space-y-6">
          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4">
            <h3 className="font-bold text-zinc-800 text-sm uppercase tracking-wide">Základní materiál (PUR pěna)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">
                  Reálná spotřeba (kg)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={usedKg} 
                  onChange={e => setUsedKg(Number(e.target.value))} 
                  className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg font-bold text-[#000000]" 
                />
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Lze upravit ručně</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">
                  Prodejní cena / 1 kg (Kč)
                </label>
                <input 
                  type="number" 
                  value={pricePerKg} 
                  onChange={e => setPricePerKg(Number(e.target.value))} 
                  className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg font-bold text-[#000000]" 
                />
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Cena pro zákazníka</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
              <span>Zapsáno aplikátorem: <b>{strokes} zdvihů</b></span>
              <div className="flex items-center gap-1">
                <span>Koeficient:</span>
                <input 
                  type="number" 
                  step="0.01" 
                  value={machineCoefficient} 
                  onChange={e => setMachineCoefficient(Number(e.target.value))} 
                  className="w-16 p-1 text-center bg-white border border-zinc-200 rounded text-xs font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 space-y-4">
            <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wide flex items-center gap-2"><PackageOpen size={16}/> Vícepráce: Balení</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-700 mb-1">Cena za 1 roli (Kč)</label>
                <input type="number" value={foilRollPrice} onChange={e => setFoilRollPrice(Number(e.target.value))} className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-[#000000]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-700 mb-1">Sazba balení/hod (Kč)</label>
                <input type="number" value={packingHourRate} onChange={e => setPackingHourRate(Number(e.target.value))} className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-[#000000]" />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-amber-200/50">
              <span className="text-amber-800">Aplikátor zadal:</span>
              <span className="font-black text-amber-900">{evidence.foilRolls} rolí, {evidence.packingHours} hod.</span>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 space-y-4">
            <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wide flex items-center gap-2"><Zap size={16}/> Vícepráce: Agregát</h3>
            <div>
              <label className="block text-xs font-bold text-blue-700 mb-1">Sazba za 1 kWh (Kč)</label>
              <input type="number" value={generatorKwRate} onChange={e => setGeneratorKwRate(Number(e.target.value))} className="w-full p-2.5 bg-white border border-blue-300 rounded-lg font-bold text-[#000000]" />
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-blue-200/50">
              <span className="text-blue-800">Aplikátor zadal:</span>
              <span className="font-black text-blue-900">{evidence.generatorKwh || 0} kWh</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">Příplatek: Výšky (Kč)</label>
              <input type="number" value={heightsSurcharge} onChange={e => setHeightsSurcharge(Number(e.target.value))} className="w-full p-3 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-[#000000]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">Příplatek: Ztíž. prostředí</label>
              <input type="number" value={difficultEnvSurcharge} onChange={e => setDifficultEnvSurcharge(Number(e.target.value))} className="w-full p-3 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-[#000000]" />
            </div>
          </div>
        </div>

        {/* PRAVÝ SLOUPEC: SOUHRN A AKCE */}
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-br from-[#000000] to-zinc-900 p-6 rounded-2xl text-white shadow-lg mb-6 flex-1">
            <h3 className="text-zinc-400 text-sm uppercase tracking-wider font-bold mb-6">Konečná kalkulace</h3>
            
            <div className="space-y-3 text-sm font-medium mb-8">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-300">Původní odhad:</span>
                <span className="text-zinc-500 line-through">{Number(quote.totalCost).toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span>Materiál ({usedKg} kg × {pricePerKg} Kč):</span>
                <span>{Math.round(materialCost).toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between items-center text-amber-400">
                <span>Doplatek: Fólie a balení:</span>
                <span>+{Math.round(packingCost).toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between items-center text-blue-400">
                <span>Doplatek: Agregát:</span>
                <span>+{Math.round(generatorCost).toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between items-center text-red-400 border-b border-zinc-800 pb-3">
                <span>Ostatní příplatky:</span>
                <span>+{Math.round(heightsSurcharge + difficultEnvSurcharge).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-zinc-400 font-bold">Konečná cena díla:</span>
              <span className="text-4xl font-black text-[#FF4F00]">{Math.round(finalTotal).toLocaleString('cs-CZ')} <span className="text-xl">Kč</span></span>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-[#000000] font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : (saved ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Save size={20} />)}
              {saved ? 'Uloženo do databáze' : 'Uložit vyúčtování'}
            </button>

            <button onClick={generateInvoicePDF} disabled={isGenerating || !saved} className="w-full py-4 bg-[#FF4F00] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={20} />}
              Vystavit konečnou fakturu (PDF)
            </button>
            {!saved && <p className="text-xs text-center text-zinc-500">Před generováním faktury uložte vyúčtování.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}