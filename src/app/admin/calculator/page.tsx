// src/app/admin/calculator/page.tsx

import { getAllMaterialsAdmin } from '@/actions/material'
import CalculatorForm from '@/components/CalculatorForm'
import { Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CalculatorPage() {
  const materials = await getAllMaterialsAdmin()

  return (
    <div className="min-h-screen bg-[#FEFEFA] p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hlavička */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#000000] tracking-tight">Kalkulátor spotřeby</h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Profesionální nástroj pro přesný výpočet spotřeby izolační pěny, odhadu ztrát a stanovení nákladů.
          </p>
        </div>

        {/* Informační panel s vysvětlením metodiky - kompletně bez modré */}
        <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-6 flex gap-4 shadow-sm">
          <div className="mt-1 shrink-0">
            <Info className="text-[#FF4F00]" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[#000000] mb-3 text-lg">Jak interpretovat výsledky kalkulace?</h3>
            <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-4 marker:text-[#FF4F00]">
              <li>
                <strong className="text-[#000000]">Čistý objem:</strong> Matematický objem materiálu, který přesně vyplní zadanou plochu a tloušťku (bez zohlednění ořezu).
              </li>
              <li>
                <strong className="text-[#000000]">Objem vč. ztráty:</strong> Reálný objem upravený o technologický prořez. Odpovídá fyzické realitě při aplikaci.
              </li>
              <li>
                <strong className="text-[#000000]">Ztráta materiálu:</strong> Přesná kvantifikace odpadu v kilogramech a krychlových metrech pro dokonalou kontrolu nad efektivitou práce.
              </li>
              <li>
                <strong className="text-[#000000]">Potřebné sady:</strong> Systém automaticky zaokrouhluje počet sad směrem nahoru, aby byl zajištěn dostatek materiálu pro úspěšné dokončení zakázky.
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