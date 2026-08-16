// src/app/admin/quotes/new/page.tsx

import { FileSignature, Stamp, CheckCircle2, Info } from 'lucide-react'
import QuoteForm from '@/components/QuoteForm'
import { db } from '@/lib/db'
import { getCompanyProfile } from '@/actions/settings'
import { calculateFoamProject, parseLambda } from '@/lib/calculations' // Přidán import matematiky

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 1. Načtení základních URL parametrů z Kalkulačky
  const resolvedParams = await searchParams
  const materialId = resolvedParams.materialId as string || ''
  const area = resolvedParams.area as string || ''
  const thickness = resolvedParams.thickness as string || ''

  const hasCalculatedData = Boolean(materialId && area && thickness)

  // 2. Načtení materiálů z DB
  const materials = await db.material.findMany({
    where: { isArchived: false },
    orderBy: { name: 'asc' }
  })

  // 3. Načtení tvého firemního profilu pro hlavičku PDF
  const companyProfile = await getCompanyProfile()

  // 4. Přepočítání přesných detailních nákladů pro banner!
  let materialName = ''
  let displayTotalCost = 0
  let displayCostPerM2 = 0
  let displayCostPerM3 = 0

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
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Nová poptávka / nabídka
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Vytvořte novou zakázku pro klienta. Nastavte obchodní marži a vygenerujte profesionální PDF nabídku.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <FileSignature size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Stamp size={150} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        
        {/* INFORMAČNÍ BANNER S DETAILNÍMI NÁKLADY */}
        {hasCalculatedData ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 shadow-sm flex gap-4 items-start">
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-emerald-900 mb-1">Data z kalkulátoru úspěšně přenesena</h3>
              <p className="text-emerald-700 text-sm mb-3">
                Zkontrolujte údaje o zákazníkovi a nastavte marži (v bloku vpravo dole). Zde jsou reálné <b>nákupní náklady</b> této zakázky:
              </p>
              
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="bg-white px-3 py-1 rounded-lg text-emerald-800 text-sm font-semibold border border-emerald-100 shadow-sm">
                  {materialName}
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-emerald-800 text-sm font-semibold border border-emerald-100 shadow-sm">
                  Plocha: {area} m²
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-emerald-800 text-sm font-semibold border border-emerald-100 shadow-sm">
                  Tloušťka: {thickness} cm
                </span>
                
                {/* Rozpad nákladů na m2 a m3 */}
                <span className="bg-white px-3 py-1 rounded-lg text-[#3B82F6] font-black text-sm border border-emerald-200 shadow-sm">
                  Celkem: {displayTotalCost.toLocaleString('cs-CZ')} Kč
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-gray-700 font-bold text-sm border border-emerald-200 shadow-sm">
                  {displayCostPerM2.toLocaleString('cs-CZ')} Kč / m²
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-gray-700 font-bold text-sm border border-emerald-200 shadow-sm">
                  {displayCostPerM3.toLocaleString('cs-CZ')} Kč / m³
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 shadow-sm flex gap-4 items-center">
            <Info className="text-[#3B82F6] shrink-0" size={24} />
            <p className="text-blue-800 text-sm font-medium">
              Vytváříte čistou nabídku. Můžete vybrat materiál a zadat parametry přímo zde.
            </p>
          </div>
        )}

        {/* Náš chytrý formulář */}
        <QuoteForm 
          materials={materials} 
          companyProfile={companyProfile}
          initialData={{ materialId, area, thickness }} 
        />

      </div>
    </div>
  )
}