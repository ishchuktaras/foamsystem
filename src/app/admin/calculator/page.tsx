// src/app/admin/calculator/page.tsx

import { getAllMaterialsAdmin } from '@/actions/material'
import CalculatorForm from '@/components/CalculatorForm'

export const dynamic = 'force-dynamic'

export default async function CalculatorPage() {
  // Načtení reálných materiálů z databáze pro Select box
  const materials = await getAllMaterialsAdmin()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Kalkulátor spotřeby</h1>
          <p className="text-gray-600 mt-1">
            Zadejte parametry plochy a vyberte izolační pěnu pro výpočet potřebných sad a celkové ceny.
          </p>
        </div>
        
        {/* Samotné UI kalkulačky */}
        <CalculatorForm materials={materials} />
      </div>
    </div>
  )
}