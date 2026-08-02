'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMaterial } from '@/actions/material'

export default function MaterialForm() {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Stavy formuláře
  const [formData, setFormData] = useState({
    name: '',
    type: 'OPEN_CELL',
    density: '',
    yieldPerSetM3: '',
    wasteFactor: '',
    buyPricePerSet: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await createMaterial(formData)

    if (!result.success) {
      setError(result.error || 'Nastala chyba při ukládání.')
      setIsLoading(false)
      return
    }

    // Úspěch -> přesměrování zpět na tabulku
    router.push('/admin/materials')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Název */}
        <div className="flex flex-col space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Název materiálu</label>
          <input
  name="name"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="např. Ekoprodur S11E-MAX"
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white font-medium"
/>
        </div>

        {/* Typ */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Typ struktury</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white"
          >
            <option value="OPEN_CELL">Otevřená struktura (Měkká)</option>
            <option value="CLOSED_CELL">Uzavřená struktura (Tvrdá)</option>
          </select>
        </div>

        {/* Hustota */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Hustota (kg/m³)</label>
          <input
  name="name"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="např. 8"
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white font-medium"
/>
        </div>

        {/* Vydatnost */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Vydatnost sady (m³)</label>
          <input
  name="name"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="např. 39"
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white font-medium"
/>
        </div>

        {/* Koeficient ztráty */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Koeficient ztráty</label>
          <input
  name="name"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="např. 1.05"
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white font-medium"
/>
        </div>

        {/* Nákupní cena */}
        <div className="flex flex-col space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Nákupní cena za sadu (Kč)</label>
          <input
  name="name"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="např. 45000"
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white font-medium"
/>
          <span className="text-xs text-gray-500">Volitelný údaj. Slouží pro výpočet marže.</span>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/materials')}
          className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Zrušit
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Ukládám...' : 'Uložit materiál'}
        </button>
      </div>
    </form>
  )
}