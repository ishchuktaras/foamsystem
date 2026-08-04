// src/components/CalculatorForm.tsx

'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'

// Aktualizovaný typ o data potřebná pro výpočet
type Material = {
  id: string
  name: string
  type: string
  density: number
  yieldPerSetM3: number
  wasteFactor: number
  buyPricePerSet: number | null
}

type CalculatorFormProps = {
  materials: Material[]
}

type CalculationResult = {
  pureVolume: number
  totalVolume: number
  exactSets: number
  roundedSets: number
  totalMaterialCost: number | null
}

export default function CalculatorForm({ materials }: CalculatorFormProps) {
  const [formData, setFormData] = useState({
    materialId: '',
    areaSqm: '',
    thicknessCm: '',
  })

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Skryjeme výsledek při změně hodnot, aby technik viděl, že musí přepočítat
    setResult(null) 
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const material = materials.find(m => m.id === formData.materialId)
    if (!material) {
      setError('Vyberte platný materiál.')
      return
    }

    const area = parseFloat(formData.areaSqm)
    const thicknessCm = parseFloat(formData.thicknessCm)

    if (isNaN(area) || isNaN(thicknessCm) || area <= 0 || thicknessCm <= 0) {
      setError('Zadejte platné kladné hodnoty pro plochu a tloušťku.')
      return
    }

    // 1. Převod tloušťky na metry
    const thicknessM = thicknessCm / 100

    // 2. Výpočet čistého objemu v m3
    const pureVolume = area * thicknessM

    // 3. Výpočet objemu včetně ztráty (prořez/zástřik)
    const totalVolume = pureVolume * material.wasteFactor

    // 4. Výpočet potřebných sad
    const exactSets = totalVolume / material.yieldPerSetM3
    const roundedSets = Math.ceil(exactSets)

    // 5. Výpočet nákladů (pokud je zadána nákupní cena)
    const totalMaterialCost = material.buyPricePerSet 
      ? roundedSets * material.buyPricePerSet 
      : null

    setResult({
      pureVolume,
      totalVolume,
      exactSets,
      roundedSets,
      totalMaterialCost
    })
  }

  // Najdeme aktuálně vybraný materiál pro zobrazení detailů ve výsledku
  const selectedMaterial = materials.find(m => m.id === formData.materialId)

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
      <form onSubmit={handleCalculate} className="space-y-6">
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#0D1B3E]">Izolační materiál</label>
          <select
            name="materialId"
            required
            value={formData.materialId}
            onChange={handleChange}
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] bg-white font-medium"
          >
            <option value="" disabled>-- Vyberte materiál --</option>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name} ({mat.type === 'OPEN_CELL' ? 'Měkká' : 'Tvrdá'}, {mat.density} kg/m³)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0D1B3E]">Plocha k izolaci</label>
            <div className="relative">
              <input
                type="number"
                name="areaSqm"
                step="0.1"
                min="0.1"
                required
                value={formData.areaSqm}
                onChange={handleChange}
                placeholder="např. 150"
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium placeholder-gray-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">m²</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0D1B3E]">Požadovaná tloušťka</label>
            <div className="relative">
              <input
                type="number"
                name="thicknessCm"
                step="0.5"
                min="0.5"
                required
                value={formData.thicknessCm}
                onChange={handleChange}
                placeholder="např. 20"
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium placeholder-gray-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">cm</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="w-full py-4 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-colors text-lg flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Spočítat spotřebu
          </button>
        </div>
      </form>

      {/* Zobrazení výsledků */}
      {result && selectedMaterial && (
        <div className="mt-8 overflow-hidden rounded-xl border border-[#3B82F6]/20 bg-[#3B82F6]/5">
          <div className="bg-[#3B82F6] p-4 text-white text-center">
            <h3 className="font-bold text-lg">Výsledek kalkulace pro {selectedMaterial.name}</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Čistý objem</p>
              <p className="text-xl font-bold text-[#0D1B3E]">{result.pureVolume.toFixed(2)} m³</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Objem vč. ztráty ({(selectedMaterial.wasteFactor * 100 - 100).toFixed(0)} %)</p>
              <p className="text-xl font-bold text-[#0D1B3E]">{result.totalVolume.toFixed(2)} m³</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#0D1B3E] sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Potřebný počet sad materiálu</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-[#0D1B3E]">{result.roundedSets} ks</p>
                  <p className="text-sm text-gray-400 font-medium">(přesně: {result.exactSets.toFixed(2)} sad)</p>
                </div>
              </div>
              
              {result.totalMaterialCost && (
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium mb-1">Náklad na materiál</p>
                  <p className="text-2xl font-bold text-[#3B82F6]">
                    {result.totalMaterialCost.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}