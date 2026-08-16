// src/components/[id]/edit/page.tsx

import { notFound } from 'next/navigation'
import { getMaterialById } from '@/actions/material'
import MaterialForm from '@/components/MaterialForm'

export default async function EditMaterialPage({ params }: { params: { id: string } }) {
  // Načteme data ze serveru pomocí ID z URL adresy
  const material = await getMaterialById(params.id)

  // Pokud uživatel zadá neexistující ID, ukážeme mu 404
  if (!material) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Úprava materiálu</h1>
          <p className="text-gray-600 mt-1">
            Změňte parametry nebo nákupní cenu pro <strong className="text-[#FF4F00]">{material.name}</strong>.
          </p>
        </div>

        {/* Formuláři předáme ID i předvyplněná data */}
        <MaterialForm 
          materialId={material.id} 
          initialData={material} 
        />

      </div>
    </div>
  )
}
