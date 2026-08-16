// src/components/CalculatorForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, FileDown, FileText, ClipboardSignature, Ruler, Maximize, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { calculateFoamProject, parseLambda } from '@/lib/calculations'

type Material = {
  id: string;
  name: string;
  type: string;
  density: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number | null;
  lambda?: string | null; 
}

type CalculatorResult = {
  materialName: string;
  areaSqm: number;
  thicknessCm: number;
  coveragePerM3: number;
  pureVolumeM3: number;
  totalVolumeM3: number;
  totalVolumeLiters: number;
  totalMassKg: number;
  kgPerM2: number;
  exactSets: number;
  totalSets: number;
  totalCost: number;
  costPerM2: number;
  costPerM3: number;
  exactMaterialCost: number;
  thermalResistance: number | null;
}

export default function CalculatorForm({ materials }: { materials: Material[] }) {
  const router = useRouter()
  
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '')
  const [area, setArea] = useState<number | ''>('')
  const [thickness, setThickness] = useState<number | ''>('')
  
  const [result, setResult] = useState<CalculatorResult | null>(null)

  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingDOC, setIsExportingDOC] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!area || !thickness || !selectedMaterialId) return
    const material = materials.find(m => m.id === selectedMaterialId)
    if (!material) return

    const calcResults = calculateFoamProject({
      areaM2: Number(area),
      thicknessCm: Number(thickness),
      density: material.density,
      wasteFactor: material.wasteFactor,
      yieldPerSetM3: material.yieldPerSetM3,
      buyPricePerSet: material.buyPricePerSet || 0,
      lambda: parseLambda(material.lambda)
    })

    setResult({
      materialName: material.name,
      areaSqm: Number(area),
      thicknessCm: Number(thickness),
      ...calcResults
    })
  }

  // PDF Export s novými barvami
  const handleExportPDF = async () => {
    if (!result) return
    setIsExportingPDF(true)
    
    try {
      const doc = new jsPDF()
      const date = new Date().toLocaleDateString('cs-CZ')
      
      // Hlavička v černé
      doc.setFontSize(22)
      doc.setTextColor(0, 0, 0) 
      doc.text('Kalkulace spotreby materialu', 20, 20)
      
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Vygenerovano systemem FoamSystem dne: ${date}`, 20, 28)

      // Oranžová dělící čára
      doc.setDrawColor(255, 79, 0) 
      doc.setLineWidth(0.5)
      doc.line(20, 32, 190, 32)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      
      doc.text(`Material: ${result.materialName}`, 20, 45)
      doc.text(`Zadana plocha: ${result.areaSqm} m2`, 20, 53)
      doc.text(`Pozadovana tloustka: ${result.thicknessCm} cm`, 20, 61)
      
      doc.text(`Cisty objem: ${result.pureVolumeM3} m3`, 20, 75)
      doc.text(`Objem vc. ztrat: ${result.totalVolumeM3} m3 (${result.totalVolumeLiters} litru)`, 20, 83)
      doc.text(`Celkova hmotnost materialu: ${result.totalMassKg} kg`, 20, 91)
      
      if (result.thermalResistance) {
        doc.setTextColor(255, 79, 0) // Oranžové zvýraznění
        doc.text(`Dosazeny tepelny odpor (R): ${result.thermalResistance} m2K/W`, 20, 99)
        doc.setTextColor(0, 0, 0)
      }

      // Finanční box v černé
      doc.setFillColor(0, 0, 0) 
      doc.rect(20, 110, 170, 30, 'F')
      
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.text(`Potrebny pocet sad: ${result.totalSets} ks`, 25, 120)
      doc.text(`Celkovy naklad na material: ${result.totalCost.toLocaleString('cs-CZ')} Kc`, 25, 130)

      doc.save(`kalkulace-${result.materialName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`)
    } catch (error) {
      console.error("Chyba při generování PDF:", error)
      alert("Něco se pokazilo při generování PDF.")
    } finally {
      setIsExportingPDF(false)
    }
  }

  const handleExportDOC = () => { /* DOC logika */ }

  const handleAttachToInquiry = () => {
    if (!result) return
    setIsRedirecting(true)
    const params = new URLSearchParams({
      materialId: selectedMaterialId,
      materialName: result.materialName,
      area: result.areaSqm.toString(),
      thickness: result.thicknessCm.toString(),
      cost: result.totalCost.toString(),
      sets: result.totalSets.toString()
    })
    router.push(`/admin/quotes/new?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCalculate} className="bg-[#FEFEFA] p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Izolační materiál</label>
          <select 
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50 cursor-pointer font-medium"
          >
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name} (Typ: {mat.type}, Hustota: {mat.density} kg/m³)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Plocha k izolaci</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Maximize size={18} />
              </div>
              <input 
                type="number" 
                min="0.1" step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                placeholder="Např. 150" 
                className="w-full pl-11 pr-12 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50 font-semibold"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">m²</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Požadovaná tloušťka</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Ruler size={18} />
              </div>
              <input 
                type="number" 
                min="1" step="1"
                value={thickness}
                onChange={(e) => setThickness(e.target.value ? Number(e.target.value) : '')}
                placeholder="Např. 20" 
                className="w-full pl-11 pr-12 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50 font-semibold"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">cm</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-[#000000] hover:bg-zinc-800 text-[#FEFEFA] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
        >
          <Calculator size={20} className="text-[#FF4F00]" />
          Zpracovat kalkulaci spotřeby
        </button>
      </form>

      {/* SUPERVISOR DASHBOARD */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden mt-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-r from-[#000000] to-zinc-900 px-6 py-5 border-b-4 border-[#FF4F00]">
            <h3 className="text-[#FEFEFA] font-bold text-xl flex items-center gap-2">
              Výsledek pro: {result.materialName}
            </h3>
            <p className="text-zinc-400 text-sm mt-1">
              Plocha: {result.areaSqm} m² | Tloušťka: {result.thicknessCm} cm
            </p>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-extrabold text-[#000000] border-b border-zinc-200 pb-2 mb-6">
              Detailní analýza zakázky
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-[#FEFEFA] border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3 border-b border-zinc-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Fyzický objem & Hmota</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Celkový objem pěny</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#000000]">{result.totalVolumeM3} <span className="text-sm font-semibold">m³</span></span>
                      <span className="text-sm text-zinc-400 font-medium">({result.totalVolumeLiters.toLocaleString('cs-CZ')} l)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Celková hmotnost</p>
                    <p className="text-xl font-bold text-[#000000]">{result.totalMassKg.toLocaleString('cs-CZ')} <span className="text-sm">kg</span></p>
                  </div>
                  <div className="pt-3 border-t border-zinc-200">
                    <p className="text-sm text-zinc-500 font-medium">Spotřeba na 1 m²</p>
                    <p className="text-lg font-bold text-[#000000]">{result.kgPerM2} <span className="text-xs text-zinc-500">kg / m²</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FEFEFA] border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3 border-b border-zinc-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Jednotkové náklady</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Náklad na 1 m²</p>
                    <p className="text-2xl font-extrabold text-[#000000]">{result.costPerM2.toLocaleString('cs-CZ')} <span className="text-sm font-semibold">Kč</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Náklad na 1 m³</p>
                    <p className="text-xl font-bold text-[#000000]">{result.costPerM3.toLocaleString('cs-CZ')} <span className="text-sm font-semibold">Kč</span></p>
                  </div>
                  <div className="pt-3 border-t border-zinc-200">
                    <p className="text-sm text-zinc-500 font-medium">Vystříkaný materiál (čistá cena)</p>
                    <p className="text-lg font-bold text-[#FF4F00]">{result.exactMaterialCost.toLocaleString('cs-CZ')} <span className="text-xs text-zinc-500">Kč</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FEFEFA] border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3 border-b border-zinc-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Logistika & Sklad</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Potřebné sady (Nákup)</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#000000]">{result.totalSets} <span className="text-sm font-semibold">sad(y)</span></span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Přesná spotřeba</p>
                    <p className="text-xl font-bold text-[#000000]">{result.exactSets} <span className="text-sm">sady</span></p>
                  </div>
                  
                  {result.thermalResistance && (
                    <div className="pt-3 border-t border-zinc-200">
                      <p className="text-sm text-zinc-500 font-medium">Tepelný odpor (R)</p>
                      <p className="text-lg font-bold text-[#FF4F00]">{result.thermalResistance} <span className="text-xs text-zinc-500">m²·K/W</span></p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h4 className="text-[#000000] font-extrabold mb-5 text-lg">Další kroky a obchodní zpracování</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <button onClick={handleExportPDF} disabled={isExportingPDF} className="flex flex-col border border-zinc-200 rounded-xl p-5 hover:border-[#FF4F00] transition-all group text-left cursor-pointer">
                  <div className="flex items-center gap-2 font-bold text-[#000000] group-hover:text-[#FF4F00] mb-2">
                    {isExportingPDF ? <Loader2 size={22} className="animate-spin text-[#FF4F00]" /> : <FileDown size={22} className="text-[#FF4F00]" />} Uložit do PDF
                  </div>
                </button>

                <button onClick={handleExportDOC} disabled={isExportingDOC} className="flex flex-col border border-zinc-200 rounded-xl p-5 hover:border-[#FF4F00] transition-all group text-left cursor-pointer">
                  <div className="flex items-center gap-2 font-bold text-[#000000] group-hover:text-[#FF4F00] mb-2">
                    {isExportingDOC ? <Loader2 size={22} className="animate-spin text-[#FF4F00]" /> : <FileText size={22} className="text-[#FF4F00]" />} Uložit do DOC
                  </div>
                </button>

                <button onClick={handleAttachToInquiry} disabled={isRedirecting} className="flex flex-col border border-[#FF4F00]/30 bg-[#FF4F00]/5 rounded-xl p-5 hover:border-[#FF4F00] transition-all group text-left cursor-pointer">
                  <div className="flex items-center gap-2 font-bold text-[#000000] group-hover:text-[#FF4F00] mb-2">
                    {isRedirecting ? <Loader2 size={22} className="animate-spin text-[#FF4F00]" /> : <ClipboardSignature size={22} className="text-[#FF4F00]" />} Vložit do nabídky
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}