'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'

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

// NOVÉ: Přesná definice typu pro výsledek místo zakázaného "any"
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
}

export default function CalculatorForm({ materials }: { materials: Material[] }) {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '')
  const [area, setArea] = useState<number | ''>('')
  const [thickness, setThickness] = useState<number | ''>('')
  
  // OPRAVENO: Místo <any> používáme <CalculatorResult | null>
  const [result, setResult] = useState<CalculatorResult | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!area || !thickness || !selectedMaterialId) return

    const material = materials.find(m => m.id === selectedMaterialId)
    if (!material) return

    // 1. Výpočet čistého objemu
    const pureVolumeM3 = Number(area) * (Number(thickness) / 100)
    
    // 2. Výpočet celkového objemu včetně ztráty
    const totalVolumeM3 = pureVolumeM3 * material.wasteFactor
    
    // 3. Výpočet potřebných sad (zaokrouhleno nahoru pro reálný nákup)
    const exactSets = totalVolumeM3 / material.yieldPerSetM3
    const requiredSets = Math.ceil(exactSets)
    
    // 4. Výpočet celkových nákladů
    const totalCost = material.buyPricePerSet ? requiredSets * material.buyPricePerSet : 0

    // 5. Výpočet ztráty na 1 m2
    const wasteVolumeM3 = totalVolumeM3 - pureVolumeM3
    const wastePerSqmM3 = Number(area) > 0 ? (wasteVolumeM3 / Number(area)) : 0

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
      wastePerSqmLiters: (wastePerSqmM3 * 1000).toFixed(1)
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCalculate} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#0D1B3E]">Izolační materiál</label>
          <select 
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] bg-white"
          >
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name} ({mat.type}, {mat.density} kg/m³)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#0D1B3E]">Plocha k izolaci</label>
            <div className="relative">
              <input 
                type="number" 
                min="0.1" 
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                placeholder="150" 
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E]"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">m²</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#0D1B3E]">Požadovaná tloušťka</label>
            <div className="relative">
              <input 
                type="number" 
                min="1" 
                step="1"
                value={thickness}
                onChange={(e) => setThickness(e.target.value ? Number(e.target.value) : '')}
                placeholder="20" 
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E]"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Calculator size={18} />
          Spočítat spotřebu
        </button>
      </form>

      {/* Výsledky kalkulace */}
      {result && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-[#3B82F6] px-6 py-4">
            <h3 className="text-white font-bold text-lg text-center">
              Výsledek kalkulace pro {result.materialName}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* 1. Řádek - Objemy */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Čistý objem</p>
                <p className="text-xl font-bold text-[#0D1B3E]">{result.pureVolumeM3} m³</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">
                  Objem vč. ztráty ({result.wastePercent} %)
                </p>
                <p className="text-xl font-bold text-[#0D1B3E]">{result.totalVolumeM3} m³</p>
              </div>

              {/* 2. Řádek - Plocha a ztráta (NOVÉ) */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Zadaná plocha</p>
                <p className="text-xl font-bold text-[#0D1B3E]">{result.areaSqm} m²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Ztráta materiálu na 1 m²</p>
                <p className="text-xl font-bold text-[#0D1B3E]">
                  {result.wastePerSqmM3} m³ <span className="text-sm text-gray-400 font-medium ml-1">({result.wastePerSqmLiters} l)</span>
                </p>
              </div>
            </div>

            {/* 3. Řádek - Peníze a sady */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Potřebný počet sad materiálu</p>
                <p className="text-2xl font-bold text-[#0D1B3E]">
                  {result.requiredSets} ks <span className="text-sm text-gray-400 font-medium">(přesně: {result.exactSets} sad)</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-gray-500 mb-1">Náklad na materiál</p>
                <p className="text-2xl font-bold text-[#3B82F6]">
                  {result.totalCost.toLocaleString('cs-CZ')} Kč
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}