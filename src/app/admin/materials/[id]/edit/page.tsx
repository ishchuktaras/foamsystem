import { getMaterialById } from '@/actions/material'
import MaterialForm from '@/components/MaterialForm'

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
      <div className="p-8 text-red-600 font-bold">
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
      <div className="p-8 text-red-600 font-bold">
        Chyba 404: Materiál s ID {resolvedParams.id} v databázi neexistuje. (Možná byl smazán?)
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Úprava materiálu</h1>
          <p className="text-gray-600 mt-1">
            Změňte parametry nebo nákupní cenu pro <strong className="text-[#3B82F6]">{material.name}</strong>.
          </p>
        </div>

        <MaterialForm 
          materialId={material.id} 
          initialData={material} 
        />
      </div>
    </div>
  )
}