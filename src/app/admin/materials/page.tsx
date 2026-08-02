import Link from 'next/link'
import { getAllMaterialsAdmin } from '@/actions/material'
import AdminMaterialsTable from '@/components/AdminMaterialsTable'

export const dynamic = 'force-dynamic'

export default async function MaterialsAdminPage() {
  const materials = await getAllMaterialsAdmin()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Hlavička administrace */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0D1B3E]">Správa materiálů</h1>
            <p className="text-gray-600 mt-1">
              Přidávejte, upravujte a mažte izolační pěny a jejich parametry.
            </p>
          </div>
          
          <Link 
            href="/admin/materials/new"
            className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors w-full sm:w-auto text-center inline-block"
          >
            + Přidat nový materiál
          </Link>
        </div>

        {/* Samotná tabulka naplněná daty ze serveru */}
        <AdminMaterialsTable initialMaterials={materials} />
        
      </div>
    </div>
  )
}