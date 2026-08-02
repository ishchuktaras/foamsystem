'use client'

import { useState } from 'react'
import { deleteMaterial } from '@/actions/material'

// Typ odpovídající struktuře z databáze
type Material = {
  id: string
  name: string
  type: string
  density: number
  yieldPerSetM3: number
  wasteFactor: number
  buyPricePerSet: number | null
}

export default function AdminMaterialsTable({ initialMaterials }: { initialMaterials: Material[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Opravdu chcete smazat materiál "${name}"? Tato akce je nevratná.`)) {
      return
    }

    setIsDeleting(id)
    const result = await deleteMaterial(id)
    
    if (!result.success) {
      alert(result.error || 'Nepodařilo se smazat materiál.')
    }
    setIsDeleting(null)
  }

  const handleEdit = (id: string) => {
    // V dalším kroku sem napojíme otevření modálního okna nebo přesměrování na formulář
    console.log('Otevřít úpravu pro ID:', id)
    alert(`Zde se otevře formulář pro úpravu materiálu.`)
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#0D1B3E] text-white">
            <th className="p-4 font-semibold text-sm rounded-tl-xl">Název</th>
            <th className="p-4 font-semibold text-sm hidden md:table-cell">Typ</th>
            <th className="p-4 font-semibold text-sm hidden sm:table-cell">Hustota</th>
            <th className="p-4 font-semibold text-sm">Cena / Sada</th>
            <th className="p-4 font-semibold text-sm text-right rounded-tr-xl">Akce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialMaterials.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                Zatím nebyly přidány žádné materiály.
              </td>
            </tr>
          ) : (
            initialMaterials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="font-medium text-gray-900">{material.name}</span>
                  {/* Zobrazení na mobilu pro skryté sloupce */}
                  <div className="text-xs text-gray-500 md:hidden mt-1">
                    {material.type === 'OPEN_CELL' ? 'Měkká' : 'Tvrdá'} | {material.density} kg/m³
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-gray-700">
                  {material.type === 'OPEN_CELL' ? 'Otevřená struktura' : 'Uzavřená struktura'}
                </td>
                <td className="p-4 hidden sm:table-cell text-gray-700">
                  {material.density} kg/m³
                </td>
                <td className="p-4 font-medium text-[#3B82F6]">
                  {material.buyPricePerSet ? `${material.buyPricePerSet} Kč` : '—'}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(material.id)}
                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-[#0D1B3E] hover:bg-gray-200 font-medium text-sm rounded-md transition-colors"
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => handleDelete(material.id, material.name)}
                    disabled={isDeleting === material.id}
                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-md transition-colors disabled:opacity-50"
                  >
                    {isDeleting === material.id ? 'Mažu...' : 'Smazat'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}