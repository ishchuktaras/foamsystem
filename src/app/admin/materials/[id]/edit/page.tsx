// src/app/admin/materials/[id]/edit/page.tsx

import { getMaterialById } from '@/actions/material'
import MaterialForm from '@/components/MaterialForm'
import { Boxes, Settings2 } from 'lucide-react'

export default async function EditMaterialPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Rozbalení parametrů
  const resolvedParams = await params
  
  // LOG 1: Vypíše do terminálu VS Code, jaké ID si Next.js přečetl z URL
  console.log("=== DEBUG ID Z URL ===", resolvedParams.id)

  if (!resolvedParams.id) {
    return (
      <div className="p-8 text-red-600 font-bold bg-red-50 rounded-xl m-8 border border-red-200">
        Chyba: Nepodařilo se přečíst ID z URL. Máš složku pojmenovanou přesně [id]?
      </div>
    )
  }
  
  // 2. Načtení z databáze
  const material = await getMaterialById(resolvedParams.id)
  
  // LOG 2: Vypíše do terminálu, jestli databáze něco našla
  console.log("=== DEBUG MATERIÁL Z DB ===", material)

  if (!material) {
    return (
      <div className="p-8 text-red-600 font-bold bg-red-50 rounded-xl m-8 border border-red-200">
        Chyba 404: Materiál s ID {resolvedParams.id} v databázi neexistuje. (Možná byl smazán?)
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Úprava materiálu
          </h1>
          <p className="text-zinc-300/80 text-lg leading-relaxed">
            Změňte technické parametry, výtěžnost nebo nákupní cenu pro izolační systém <strong className="text-white bg-white/20 px-2 py-0.5 rounded mx-1">{material.name}</strong>.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <Boxes size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Settings2 size={150} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-4">
        <MaterialForm 
          materialId={material.id} 
          initialData={material} 
        />
      </div>

    </div>
  )
}