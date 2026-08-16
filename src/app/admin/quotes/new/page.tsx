// src/app/admin/quotes/new/page.tsx

import { FileSignature, Stamp, CheckCircle2, Info } from 'lucide-react'
import QuoteForm from '@/components/QuoteForm'
import { db } from '@/lib/db'
import { getCompanyProfile } from '@/actions/settings'
import { calculateFoamProject, parseLambda } from '@/lib/calculations'

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const materialId = resolvedParams.materialId as string || ''
  const area = resolvedParams.area as string || ''
  const thickness = resolvedParams.thickness as string || ''

  const hasCalculatedData = Boolean(materialId && area && thickness)

  const materials = await db.material.findMany({
    where: { isArchived: false },
    orderBy: { name: 'asc' }
  })

  const companyProfile = await getCompanyProfile()

  let materialName = ''
  let displayTotalCost = 0
  let displayCostPerM2 = 0
  let displayCostPerM3 = 0
  let displayExactSets = 0
  let displayExactMaterialCost = 0 

  if (hasCalculatedData) {
    const selected = materials.find(m => m.id === materialId)
    if (selected) {
      materialName = selected.name
      const calcResults = calculateFoamProject({
        areaM2: Number(area),
        thicknessCm: Number(thickness),
        density: selected.density,
        wasteFactor: selected.wasteFactor,
        yieldPerSetM3: selected.yieldPerSetM3,
        buyPricePerSet: selected.buyPricePerSet || 0,
        lambda: parseLambda(selected.lambda)
      })
      displayTotalCost = calcResults.totalCost
      displayCostPerM2 = calcResults.costPerM2
      displayCostPerM3 = calcResults.costPerM3
      displayExactSets = calcResults.exactSets
      displayExactMaterialCost = calcResults.exactMaterialCost
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner v černé s oranžovými akcenty */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] p-8 md:p-10 text-[#FEFEFA] shadow-xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Nová poptávka / nabídka
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Vytvořte novou zakázku pro klienta. Nastavte obchodní marži a vygenerujte profesionální PDF nabídku.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <FileSignature size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none text-[#FF4F00]">
          <Stamp size={150} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        
        {/* INFORMAČNÍ BANNER S DETAILNÍMI NÁKLADY */}
        {hasCalculatedData ? (
          <div className="bg-[#FEFEFA] border-2 border-[#000000] rounded-xl p-5 mb-8 shadow-sm flex gap-4 items-start">
            <CheckCircle2 className="text-[#FF4F00] shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-[#000000] mb-1">Data z kalkulátoru úspěšně přenesena</h3>
              <p className="text-zinc-600 text-sm mb-3">
                Zkontrolujte údaje o zákazníkovi a nastavte marži (v bloku vpravo dole). Zde jsou reálné <b>nákupní náklady</b> této zakázky:
              </p>
              
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[#000000] text-sm font-semibold border border-zinc-200 shadow-sm">
                  {materialName}
                </span>
                <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[#000000] text-sm font-semibold border border-zinc-200 shadow-sm">
                  Plocha: {area} m²
                </span>
                <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[#000000] text-sm font-semibold border border-zinc-200 shadow-sm">
                  Tloušťka: {thickness} cm
                </span>
                
                <span className="bg-[#000000] px-3 py-1 rounded-lg text-[#FEFEFA] font-black text-sm border border-[#000000] shadow-sm">
                  Celkem nákup: {displayTotalCost.toLocaleString('cs-CZ')} Kč
                </span>
                <span className="bg-[#FF4F00] px-3 py-1 rounded-lg text-[#FEFEFA] font-bold text-sm shadow-sm">
                  Vystříkaný materiál ({displayExactSets} sady): {displayExactMaterialCost.toLocaleString('cs-CZ')} Kč
                </span>
                <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[#000000] font-bold text-sm border border-zinc-200 shadow-sm">
                  {displayCostPerM2.toLocaleString('cs-CZ')} Kč / m²
                </span>
                <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[#000000] font-bold text-sm border border-zinc-200 shadow-sm">
                  {displayCostPerM3.toLocaleString('cs-CZ')} Kč / m³
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-5 mb-8 shadow-sm flex gap-4 items-center">
            <Info className="text-[#FF4F00] shrink-0" size={24} />
            <p className="text-[#000000] text-sm font-medium">
              Vytváříte čistou nabídku. Můžete vybrat materiál a zadat parametry přímo zde.
            </p>
          </div>
        )}

        <QuoteForm 
          materials={materials} 
          companyProfile={companyProfile}
          initialData={{ materialId, area, thickness }} 
        />

      </div>
    </div>
  )
}