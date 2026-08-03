// src/app/admin/materials/[id]/edit/page.tsx

import { notFound } from 'next/navigation'
import { getMaterialById } from '@/actions/material'
import MaterialForm from '@/components/MaterialForm'

type EditMaterialPageProps = {
  params: {
    id: string
  }
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  // Načtení dat o konkrétním materiálu z databáze
  const material = await getMaterialById(params.id)

  // Ochrana: pokud někdo zadá neexistující ID do URL, vyhodíme 404
  if (!material) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Úprava materiálu</h1>
          <p className="text-gray-600 mt-1">
            Upravujete parametry pro izolační pěnu:{' '}
            <span className="font-semibold text-gray-900">{material.name}</span>
          </p>
        </div>
        
        {/* Formulář s předvyplněnými daty a předaným ID pro UPDATE akci */}
        <MaterialForm 
          materialId={material.id} 
          initialData={{
            name: material.name,
            type: material.type,
            density: material.density,
            yieldPerSetM3: material.yieldPerSetM3,
            wasteFactor: material.wasteFactor,
            buyPricePerSet: material.buyPricePerSet,
          }} 
        />
        
      </div>
    </div>
  )
}