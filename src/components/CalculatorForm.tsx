// src/components/CalculatorForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, FileDown, FileText, ClipboardSignature, Ruler, Maximize, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'

// Definice typu pro materiál
type Material = {
  id: string;
  name: string;
  type: string;
  density: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number | null;
}

type CalculatorResult = {
  materialName: string;
  wastePercent: string;
  pureVolumeM3: string;
  totalVolumeM3: string;
  exactSets: string;
  requiredSets: number;
  totalCost: number;
  areaSqm: number;
  wastePerSqmM3: string;
  wastePerSqmLiters: string;
  wasteKgTotal: string;
  wasteKgPerSqm: string;
  wasteKgPerM3: string;
}

export default function CalculatorForm({ materials }: { materials: Material[] }) {
  const router = useRouter()
  
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '')
  const [area, setArea] = useState<number | ''>('')
  const [thickness, setThickness] = useState<number | ''>('')
  const [result, setResult] = useState<CalculatorResult | null>(null)

  // UX stavy pro tlačítka
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingDOC, setIsExportingDOC] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!area || !thickness || !selectedMaterialId) return
    const material = materials.find(m => m.id === selectedMaterialId)
    if (!material) return

    const pureVolumeM3 = Number(area) * (Number(thickness) / 100)
    const totalVolumeM3 = pureVolumeM3 * material.wasteFactor
    const exactSets = totalVolumeM3 / material.yieldPerSetM3
    const requiredSets = Math.ceil(exactSets)
    const totalCost = material.buyPricePerSet ? requiredSets * material.buyPricePerSet : 0
    const wasteVolumeM3 = totalVolumeM3 - pureVolumeM3
    const wastePerSqmM3 = Number(area) > 0 ? (wasteVolumeM3 / Number(area)) : 0
    const wasteKgTotal = wasteVolumeM3 * material.density
    const wasteKgPerSqm = Number(area) > 0 ? (wasteKgTotal / Number(area)) : 0
    const wasteKgPerM3 = pureVolumeM3 > 0 ? (wasteKgTotal / pureVolumeM3) : 0

    setResult({
      materialName: material.name,
      wastePercent: ((material.wasteFactor - 1) * 100).toFixed(0),
      pureVolumeM3: pureVolumeM3.toFixed(2),
      totalVolumeM3: totalVolumeM3.toFixed(2),
      exactSets: exactSets.toFixed(2),
      requiredSets,
      totalCost,
      areaSqm: Number(area),
      wastePerSqmM3: wastePerSqmM3.toFixed(3),
      wastePerSqmLiters: (wastePerSqmM3 * 1000).toFixed(1),
      wasteKgTotal: wasteKgTotal.toFixed(2),
      wasteKgPerSqm: wasteKgPerSqm.toFixed(2),
      wasteKgPerM3: wasteKgPerM3.toFixed(2)
    })
  }

  // 1. Logika pro PDF (čistý a profesionální export)
  const handleExportPDF = async () => {
    if (!result) return
    setIsExportingPDF(true)
    
    try {
      const doc = new jsPDF()
      const date = new Date().toLocaleDateString('cs-CZ')
      
      // Hlavička
      doc.setFontSize(22)
      doc.setTextColor(13, 27, 62) // #0D1B3E
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
      doc.text(`Pozadovana tloustka: ${thickness} cm`, 20, 61)
      
      doc.text(`Cisty objem: ${result.pureVolumeM3} m3`, 20, 75)
      doc.text(`Objem vc. ztrat (${result.wastePercent}%): ${result.totalVolumeM3} m3`, 20, 83)
      doc.text(`Celkova hmotnostni ztrata: ${result.wasteKgTotal} kg`, 20, 91)

      // Finanční box
      doc.setFillColor(240, 248, 255) // Jemně modré pozadí
      doc.rect(20, 105, 170, 30, 'F')
      
      doc.setFontSize(14)
      doc.setTextColor(13, 27, 62)
      doc.setFont("helvetica", "bold")
      doc.text(`Potrebny pocet sad: ${result.requiredSets} ks`, 25, 115)
      doc.text(`Celkovy naklad na material: ${result.totalCost.toLocaleString('cs-CZ')} Kc`, 25, 125)

      // Uložení
      doc.save(`kalkulace-${result.materialName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`)
    } catch (error) {
      console.error("Chyba při generování PDF:", error)
      alert("Něco se pokazilo při generování PDF.")
    } finally {
      setIsExportingPDF(false)
    }
  }

  // 2. Logika pro DOC (HTML Blob převod pro Word)
  const handleExportDOC = () => {
    if (!result) return
    setIsExportingDOC(true)

    setTimeout(() => {
      // Vytvoříme HTML strukturu, kterou MS Word umí přečíst
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Kalkulace spotřeby</title></head><body>"
      const footer = "</body></html>"
      const content = `
        <h1 style="color: #0D1B3E; font-family: sans-serif;">Kalkulace spotřeby materiálu</h1>
        <p style="color: #666; font-family: sans-serif;">Vygenerováno systémem FoamSystem</p>
        <hr />
        <table style="width: 100%; font-family: sans-serif; text-align: left; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Materiál:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.materialName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plocha:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.areaSqm} m²</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tloušťka:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${thickness} cm</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Čistý objem:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.pureVolumeM3} m³</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Objem vč. ztrát:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${result.totalVolumeM3} m³</td></tr>
          <tr><td style="padding: 8px;"><strong>Hmotnostní ztráta:</strong></td><td style="padding: 8px;">${result.wasteKgTotal} kg</td></tr>
        </table>
        <br/>
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; font-family: sans-serif;">
          <h2 style="color: #0D1B3E; margin-top: 0;">Výsledek</h2>
          <p><strong>Potřebný počet sad:</strong> ${result.requiredSets} ks</p>
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
    }, 500) // Drobná pauza pro UX efekt
  }

  // 3. Logika pro Vložení do nabídky (Přenos dat přes URL parametry)
  const handleAttachToInquiry = () => {
    if (!result) return
    setIsRedirecting(true)
    
    // Připravíme data do query stringu
    const params = new URLSearchParams({
      materialId: selectedMaterialId,
      materialName: result.materialName,
      area: result.areaSqm.toString(),
      thickness: thickness.toString(),
      cost: result.totalCost.toString(),
      sets: result.requiredSets.toString()
    })

    // Zde nastav cílovou URL podle toho, jak se jmenuje tvoje stránka pro tvorbu nabídek
    router.push(`/admin/quotes/new?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Vstupní formulář */}
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

      {/* Výsledky kalkulace */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-r from-[#3B82F6] to-blue-500 px-6 py-5">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              Výsledek pro: {result.materialName}
            </h3>
            <p className="text-blue-100 text-sm mt-1">Data jsou připravena pro fakturaci a obchodní nabídku.</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <p className="text-sm font-semibold text-gray-500 mb-1">Čistý objem</p>
                <p className="text-2xl font-black text-[#0D1B3E]">{result.pureVolumeM3} m³</p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">Matematický výpočet objemu k vyplnění zadaného prostoru (bez technologického odpadu).</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  Objem vč. ztráty ({result.wastePercent} %)
                </p>
                <p className="text-2xl font-black text-[#0D1B3E]">{result.totalVolumeM3} m³</p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">Celkový potřebný objem suroviny zohledňující ořez a technologickou ztrátu pěny.</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <p className="text-sm font-semibold text-gray-500 mb-1">Ztráta materiálu na 1 m²</p>
                <p className="text-2xl font-black text-[#0D1B3E]">
                  {result.wastePerSqmM3} m³ <span className="text-sm text-gray-400 font-bold ml-1">({result.wasteKgPerSqm} kg)</span>
                </p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">Kvantifikace ztraceného materiálu připadající přesně na jeden metr čtvereční.</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <p className="text-sm font-semibold text-gray-500 mb-1">Celková hmotnostní ztráta</p>
                <p className="text-2xl font-black text-[#0D1B3E]">
                  {result.wasteKgTotal} kg
                </p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">Fyzická váha materiálu (v kilogramech), která bude představovat celkový technologický odpad.</p>
              </div>
            </div>

            {/* Zvýrazněná finanční sekce */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8 shadow-inner">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Potřebný počet sad</p>
                <p className="text-3xl font-black text-[#0D1B3E]">
                  {result.requiredSets} ks 
                </p>
                <p className="text-sm text-gray-500 mt-1 font-medium">Přesný výpočet: {result.exactSets} sad</p>
              </div>
              <div className="mt-6 md:mt-0 md:text-right">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Náklad na materiál</p>
                <p className="text-3xl font-black text-[#3B82F6]">
                  {result.totalCost.toLocaleString('cs-CZ')} Kč
                </p>
                <p className="text-sm text-gray-500 mt-1 font-medium">Cena za zaokrouhlený počet sad.</p>
              </div>
            </div>

            {/* Akční tlačítka */}
            <div className="border-t border-gray-100 pt-8">
              <h4 className="text-[#0D1B3E] font-extrabold mb-5 text-lg">Další kroky a obchodní zpracování</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Tlačítko PDF */}
                <button 
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="flex flex-col border border-gray-200 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group text-left disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    {isExportingPDF ? <Loader2 size={22} className="animate-spin text-[#3B82F6]" /> : <FileDown size={22} className="text-[#3B82F6]" />}
                    {isExportingPDF ? 'Generuji PDF...' : 'Uložit do PDF'}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nepřepisovatelný dokument s přehledem spotřeby, připravený k okamžitému odeslání.
                  </p>
                </button>

                {/* Tlačítko DOC */}
                <button 
                  onClick={handleExportDOC}
                  disabled={isExportingDOC}
                  className="flex flex-col border border-gray-200 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group text-left disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    {isExportingDOC ? <Loader2 size={22} className="animate-spin text-[#3B82F6]" /> : <FileText size={22} className="text-[#3B82F6]" />}
                    {isExportingDOC ? 'Připravuji soubor...' : 'Uložit do DOC'}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Upravitelný soubor Word pro rychlé doplnění specifických podmínek do smlouvy.
                  </p>
                </button>

                {/* Tlačítko Přenos do Nabídky */}
                <button 
                  onClick={handleAttachToInquiry}
                  disabled={isRedirecting}
                  className="flex flex-col border border-[#3B82F6]/30 bg-blue-50/50 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group text-left disabled:opacity-70 disabled:cursor-not-allowed"
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