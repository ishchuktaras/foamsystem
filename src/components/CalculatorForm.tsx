// src/components/CalculatorForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, FileDown, FileText, ClipboardSignature, Ruler, Maximize, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { calculateFoamProject, parseLambda } from '@/lib/calculations'

// 1. Rozšířená definice typu materiálu o parametr lambda
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

// 2. Definice typu pro výsledek (odpovídá výstupu z calculateFoamProject)
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
  
  // Stav pro výsledky výpočtu
  const [result, setResult] = useState<CalculatorResult | null>(null)

  // UX stavy pro tlačítka
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingDOC, setIsExportingDOC] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Hlavní výpočetní funkce odesílající data do našeho nového modulu
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!area || !thickness || !selectedMaterialId) return
    const material = materials.find(m => m.id === selectedMaterialId)
    if (!material) return

    // Využití našeho nového, dokonalého matematického modulu
    const calcResults = calculateFoamProject({
      areaM2: Number(area),
      thicknessCm: Number(thickness),
      density: material.density,
      wasteFactor: material.wasteFactor,
      yieldPerSetM3: material.yieldPerSetM3,
      buyPricePerSet: material.buyPricePerSet || 0,
      lambda: parseLambda(material.lambda)
    })

    // Uložení obohaceného objektu do stavu
    setResult({
      materialName: material.name,
      areaSqm: Number(area),
      thicknessCm: Number(thickness),
      ...calcResults
    })
  }

  // 1. Logika pro PDF 
  const handleExportPDF = async () => {
    if (!result) return
    setIsExportingPDF(true)
    
    try {
      const doc = new jsPDF()
      const date = new Date().toLocaleDateString('cs-CZ')
      
      // Hlavička
      doc.setFontSize(22)
      doc.setTextColor(13, 27, 62) 
      doc.text('Kalkulace spotreby materialu', 20, 20)
      
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Vygenerovano systemem FoamSystem dne: ${date}`, 20, 28)

      // Oddělovací čára
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 32, 190, 32)

      // Hlavní data
      doc.setFontSize(12)
      doc.setTextColor(20, 20, 20)
      
      doc.text(`Material: ${result.materialName}`, 20, 45)
      doc.text(`Zadana plocha: ${result.areaSqm} m2`, 20, 53)
      doc.text(`Pozadovana tloustka: ${result.thicknessCm} cm`, 20, 61)
      
      doc.text(`Cisty objem: ${result.pureVolumeM3} m3`, 20, 75)
      doc.text(`Objem vc. ztrat: ${result.totalVolumeM3} m3 (${result.totalVolumeLiters} litru)`, 20, 83)
      doc.text(`Celkova hmotnost materialu: ${result.totalMassKg} kg`, 20, 91)
      
      if (result.thermalResistance) {
        doc.text(`Dosazeny tepelny odpor (R): ${result.thermalResistance} m2K/W`, 20, 99)
      }

      // Finanční box
      doc.setFillColor(240, 248, 255) 
      doc.rect(20, 110, 170, 30, 'F')
      
      doc.setFontSize(14)
      doc.setTextColor(13, 27, 62)
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

  // 2. Logika pro DOC (HTML Blob)
  const handleExportDOC = () => {
    if (!result) return
    setIsExportingDOC(true)

    setTimeout(() => {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Kalkulace spotřeby</title></head><body>"
      const footer = "</body></html>"
      const content = `
        <h1 style="color: #0D1B3E; font-family: sans-serif;">Kalkulace spotřeby materiálu</h1>
        <p style="color: #666; font-family: sans-serif;">Vygenerováno systémem FoamSystem</p>
        <hr />
        <table style="width: 100%; font-family: sans-serif; text-align: left; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Materiál:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.materialName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plocha:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.areaSqm} m²</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tloušťka:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.thicknessCm} cm</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Čistý objem:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.pureVolumeM3} m³</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Objem vč. ztrát:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.totalVolumeM3} m³</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Hmotnost materiálu:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.totalMassKg} kg</td></tr>
          ${result.thermalResistance ? `<tr><td style="padding: 8px;"><strong>Tepelný odpor (R):</strong></td><td style="padding: 8px;">${result.thermalResistance} m²K/W</td></tr>` : ''}
        </table>
        <br/>
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; font-family: sans-serif;">
          <h2 style="color: #0D1B3E; margin-top: 0;">Výsledek</h2>
          <p><strong>Potřebný počet sad:</strong> ${result.totalSets} ks</p>
          <p><strong>Náklad na materiál:</strong> ${result.totalCost.toLocaleString('cs-CZ')} Kč</p>
        </div>
      `
      
      const sourceHTML = header + content + footer
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML)
      
      const fileDownload = document.createElement("a")
      document.body.appendChild(fileDownload)
      fileDownload.href = source
      fileDownload.download = `kalkulace-${Date.now()}.doc`
      fileDownload.click()
      document.body.removeChild(fileDownload)
      
      setIsExportingDOC(false)
    }, 500)
  }

  // 3. Logika pro Vložení do nabídky
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
      {/* Vstupní formulář zůstává stejný */}
      <form onSubmit={handleCalculate} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Izolační materiál</label>
          <select 
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-[#0D1B3E] bg-gray-50/50 hover:bg-white transition-colors cursor-pointer font-medium"
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
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Plocha k izolaci</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Maximize size={18} />
              </div>
              <input 
                type="number" 
                min="0.1" 
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                placeholder="Např. 150" 
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-[#0D1B3E] bg-gray-50/50 hover:bg-white transition-colors font-semibold"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">m²</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Požadovaná tloušťka</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Ruler size={18} />
              </div>
              <input 
                type="number" 
                min="1" 
                step="1"
                value={thickness}
                onChange={(e) => setThickness(e.target.value ? Number(e.target.value) : '')}
                placeholder="Např. 20" 
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-[#0D1B3E] bg-gray-50/50 hover:bg-white transition-colors font-semibold"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">cm</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          <Calculator size={20} />
          Zpracovat kalkulaci spotřeby
        </button>
      </form>

      {/* --- SUPERVISOR DASHBOARD: Výsledky kalkulace --- */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-r from-[#3B82F6] to-blue-500 px-6 py-5">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              Výsledek pro: {result.materialName}
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Plocha: {result.areaSqm} m² | Tloušťka: {result.thicknessCm} cm
            </p>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-extrabold text-[#0D1B3E] border-b border-gray-100 pb-2 mb-6">
              Detailní analýza zakázky
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* BLOK 1: Fyzika a hmota */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-blue-50/50 px-5 py-3 border-b border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">Fyzický objem & Hmota</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Celkový objem pěny</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#0D1B3E]">{result.totalVolumeM3} <span className="text-sm font-semibold">m³</span></span>
                      <span className="text-sm text-gray-400 font-medium">({result.totalVolumeLiters.toLocaleString('cs-CZ')} l)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Celková hmotnost</p>
                    <p className="text-xl font-bold text-[#0D1B3E]">{result.totalMassKg.toLocaleString('cs-CZ')} <span className="text-sm">kg</span></p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Spotřeba na 1 m²</p>
                    <p className="text-lg font-bold text-[#0D1B3E]">{result.kgPerM2} <span className="text-xs text-gray-500">kg / m²</span></p>
                  </div>
                </div>
              </div>

              {/* BLOK 2: Ekonomika */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-emerald-50/50 px-5 py-3 border-b border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Jednotkové náklady</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Náklad na 1 m²</p>
                    <p className="text-2xl font-extrabold text-[#0D1B3E]">{result.costPerM2.toLocaleString('cs-CZ')} <span className="text-sm font-semibold">Kč</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Náklad na 1 m³</p>
                    <p className="text-xl font-bold text-[#0D1B3E]">{result.costPerM3.toLocaleString('cs-CZ')} <span className="text-sm font-semibold">Kč</span></p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Vystříkaný materiál (čistá cena)</p>
                    <p className="text-lg font-bold text-gray-700">{result.exactMaterialCost.toLocaleString('cs-CZ')} <span className="text-xs">Kč</span></p>
                  </div>
                </div>
              </div>

              {/* BLOK 3: Logistika & Sklad */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-orange-50/50 px-5 py-3 border-b border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-700">Logistika & Sklad</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Potřebné sady (Nákup)</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#0D1B3E]">{result.totalSets} <span className="text-sm font-semibold">sad(y)</span></span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Přesná spotřeba</p>
                    <p className="text-xl font-bold text-[#0D1B3E]">{result.exactSets} <span className="text-sm">sady</span></p>
                  </div>
                  
                  {result.thermalResistance && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500 font-medium">Tepelný odpor (R)</p>
                      <p className="text-lg font-bold text-[#3B82F6]">{result.thermalResistance} <span className="text-xs text-gray-500">m²·K/W</span></p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Akční tlačítka - zůstávají beze změny */}
            <div className="border-t border-gray-100 pt-8">
              <h4 className="text-[#0D1B3E] font-extrabold mb-5 text-lg">Další kroky a obchodní zpracování</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <button 
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="flex flex-col border border-gray-200 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group text-left disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    {isExportingPDF ? <Loader2 size={22} className="animate-spin text-[#3B82F6]" /> : <FileDown size={22} className="text-[#3B82F6]" />}
                    {isExportingPDF ? 'Generuji PDF...' : 'Uložit do PDF'}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nepřepisovatelný dokument s přehledem spotřeby, připravený k okamžitému odeslání.
                  </p>
                </button>

                <button 
                  onClick={handleExportDOC}
                  disabled={isExportingDOC}
                  className="flex flex-col border border-gray-200 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group text-left disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    {isExportingDOC ? <Loader2 size={22} className="animate-spin text-[#3B82F6]" /> : <FileText size={22} className="text-[#3B82F6]" />}
                    {isExportingDOC ? 'Připravuji soubor...' : 'Uložit do DOC'}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Upravitelný soubor Word pro rychlé doplnění specifických podmínek do smlouvy.
                  </p>
                </button>

                <button 
                  onClick={handleAttachToInquiry}
                  disabled={isRedirecting}
                  className="flex flex-col border border-[#3B82F6]/30 bg-blue-50/50 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group text-left disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    {isRedirecting ? <Loader2 size={22} className="animate-spin text-[#3B82F6]" /> : <ClipboardSignature size={22} className="text-[#3B82F6]" />}
                    {isRedirecting ? 'Přesměrovávám...' : 'Vložit do nabídky'}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Automaticky propíše objemy a náklady jako závaznou položku do nabídky.
                  </p>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}