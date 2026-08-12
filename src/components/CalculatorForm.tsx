// src/components/CalculatorForm.tsx

'use client'

import { useState } from 'react'
import { Calculator, FileDown, FileText, ClipboardSignature, Ruler, Maximize } from 'lucide-react'

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
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '')
  const [area, setArea] = useState<number | ''>('')
  const [thickness, setThickness] = useState<number | ''>('')
  
  const [result, setResult] = useState<CalculatorResult | null>(null)

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

  const handleExportPDF = () => alert("Zde bude logika pro vygenerování PDF dokumentu (např. přes jsPDF).")
  const handleExportDOC = () => alert("Zde bude logika pro export do upravitelného Word dokumentu.")
  const handleAttachToInquiry = () => alert("Zde se data přenesou do rozepsané komerční nabídky nebo poptávkového formuláře.")

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
                
                <div className="flex flex-col border border-gray-200 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group cursor-pointer" onClick={handleExportPDF}>
                  <button className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    <FileDown size={22} className="text-[#3B82F6]" />
                    Uložit do PDF
                  </button>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nepřepisovatelný dokument s přehledem spotřeby, připravený k okamžitému odeslání.
                  </p>
                </div>

                <div className="flex flex-col border border-gray-200 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group cursor-pointer" onClick={handleExportDOC}>
                  <button className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    <FileText size={22} className="text-[#3B82F6]" />
                    Uložit do DOC
                  </button>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Upravitelný soubor Word pro rychlé doplnění specifických podmínek do smlouvy.
                  </p>
                </div>

                <div className="flex flex-col border border-[#3B82F6]/30 bg-blue-50/50 rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-md transition-all group cursor-pointer" onClick={handleAttachToInquiry}>
                  <button className="flex items-center gap-2 font-bold text-[#0D1B3E] group-hover:text-[#3B82F6] transition-colors mb-2">
                    <ClipboardSignature size={22} className="text-[#3B82F6]" />
                    Vložit do nabídky
                  </button>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Automaticky propíše objemy a náklady jako závaznou položku do nabídky.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}