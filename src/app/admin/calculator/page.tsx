// src/app/admin/calculator/page.tsx

import { getAllMaterialsAdmin } from '@/actions/material'
import CalculatorForm from '@/components/CalculatorForm'
import { Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CalculatorPage() {
  // Načtení reálných materiálů z databáze pro Select box
  const materials = await getAllMaterialsAdmin()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hlavička */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1B3E] tracking-tight">Kalkulátor spotřeby</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Profesionální nástroj pro přesný výpočet spotřeby izolační pěny, odhadu ztrát a stanovení nákladů.
          </p>
        </div>

        {/* Informační panel s vysvětlením metodiky */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 flex gap-4 shadow-sm">
          <div className="mt-1 shrink-0">
            <Info className="text-[#3B82F6]" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[#0D1B3E] mb-3 text-lg">Jak interpretovat výsledky kalkulace?</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4 marker:text-[#3B82F6]">
              <li>
                <strong className="text-[#0D1B3E]">Čistý objem:</strong> Matematický objem materiálu, který přesně vyplní zadanou plochu a tloušťku (bez zohlednění ořezu).
              </li>
              <li>
                <strong className="text-[#0D1B3E]">Objem vč. ztráty:</strong> Reálný objem upravený o technologický prořez. Odpovídá fyzické realitě při aplikaci.
              </li>
              <li>
                <strong className="text-[#0D1B3E]">Ztráta materiálu:</strong> Přesná kvantifikace odpadu v kilogramech a krychlových metrech pro dokonalou kontrolu nad efektivitou práce.
              </li>
              <li>
                <strong className="text-[#0D1B3E]">Potřebné sady:</strong> Systém automaticky zaokrouhluje počet sad směrem nahoru, aby byl zajištěn dostatek materiálu pro úspěšné dokončení zakázky.
              </li>
            </ul>
          </div>
        </div>
        
        {/* Samotné UI kalkulačky */}
        <CalculatorForm materials={materials} />
      </div>
    </div>
  )
}