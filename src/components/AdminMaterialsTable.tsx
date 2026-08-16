// src/components/AdminMaterialsTable.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteMaterial, seedBasicMaterials } from '@/actions/material'

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
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSeeding, startSeeding] = useTransition()

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Opravdu chcete přesunout materiál "${name}" do archivu? Historické výpočty zůstanou zachovány.`)) {
      return
    }

    setIsDeleting(id)
    const result = await deleteMaterial(id)
    
    if (!result.success) {
      alert(result.error || 'Nepodařilo se archivovat materiál.')
    }
    setIsDeleting(null)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/materials/${id}/edit`)
  }

  const handleSeed = () => {
    startSeeding(async () => {
      const result = await seedBasicMaterials()
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  return (
    <div className="overflow-x-auto bg-[#FEFEFA] rounded-xl shadow-lg border border-zinc-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#000000] text-[#FEFEFA]">
            <th className="p-4 font-semibold text-sm rounded-tl-xl">Název</th>
            <th className="p-4 font-semibold text-sm hidden md:table-cell">Typ</th>
            <th className="p-4 font-semibold text-sm hidden sm:table-cell">Hustota</th>
            <th className="p-4 font-semibold text-sm">Cena / Sada</th>
            <th className="p-4 font-semibold text-sm text-right rounded-tr-xl">Akce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {initialMaterials.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-zinc-500">Zatím nebyly přidány žádné materiály (nebo byly všechny archivovány).</p>
                  
                  <button
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="px-5 py-2.5 bg-[#FF4F00] hover:bg-[#E64700] text-[#FEFEFA] font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isSeeding ? 'Nahrávám data...' : 'Automaticky nahrát základní pěny Ekoprodur'}
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            initialMaterials.map((material) => (
              <tr key={material.id} className="hover:bg-zinc-50 transition-colors">
                <td className="p-4">
                  <span className="font-medium text-[#000000]">{material.name}</span>
                  <div className="text-xs text-zinc-500 md:hidden mt-1">
                    {material.type === 'OPEN_CELL' ? 'Měkká' : 'Tvrdá'} | {material.density} kg/m³
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-zinc-700">
                  {material.type === 'OPEN_CELL' ? 'Otevřená struktura' : 'Uzavřená struktura'}
                </td>
                <td className="p-4 hidden sm:table-cell text-zinc-700">
                  {material.density} kg/m³
                </td>
                <td className="p-4 font-bold text-[#FF4F00]">
                  {material.buyPricePerSet ? `${material.buyPricePerSet} Kč` : '—'}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(material.id)}
                    className="inline-flex items-center px-3 py-1.5 bg-zinc-100 text-[#000000] hover:bg-zinc-200 font-medium text-sm rounded-md transition-colors"
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => handleDelete(material.id, material.name)}
                    disabled={isDeleting === material.id}
                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-md transition-colors disabled:opacity-50"
                  >
                    {isDeleting === material.id ? 'Archivuji...' : 'Smazat'}
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