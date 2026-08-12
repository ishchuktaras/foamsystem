// src/app/admin/quotes/new/page.tsx

import { FileSignature, Stamp, CheckCircle2, Info } from 'lucide-react'

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Rozbalení parametrů z URL, které nám poslala kalkulačka
  const resolvedParams = await searchParams
  
  const materialName = resolvedParams.materialName as string || ''
  const area = resolvedParams.area as string || ''
  const thickness = resolvedParams.thickness as string || ''
  const cost = resolvedParams.cost as string || ''
  const sets = resolvedParams.sets as string || ''

  // Kontrola, zda jsme přišli z kalkulačky (máme data)
  const hasCalculatedData = Boolean(materialName && area)

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Nová poptávka / nabídka
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Vytvořte novou zakázku pro klienta. {hasCalculatedData ? 'Data z kalkulačky byla úspěšně přenesena.' : 'Vyplňte údaje o klientovi a nacenění.'}
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <FileSignature size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Stamp size={150} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        {/* Informační blok o načtených datech z URL */}
        {hasCalculatedData ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 shadow-sm flex gap-4 items-start">
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-emerald-900 mb-1">Úspěšně napojeno na kalkulátor</h3>
              <p className="text-emerald-700 text-sm mb-3">Tato zakázka bude automaticky předvyplněna následujícími technickými parametry:</p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white px-3 py-1 rounded-lg text-emerald-800 text-sm font-semibold border border-emerald-100 shadow-sm">
                  {materialName}
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-emerald-800 text-sm font-semibold border border-emerald-100 shadow-sm">
                  Plocha: {area} m²
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-emerald-800 text-sm font-semibold border border-emerald-100 shadow-sm">
                  Tloušťka: {thickness} cm
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-[#3B82F6] font-black text-sm border border-emerald-100 shadow-sm">
                  Náklad: {Number(cost).toLocaleString('cs-CZ')} Kč
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 shadow-sm flex gap-4 items-center">
            <Info className="text-[#3B82F6] shrink-0" size={24} />
            <p className="text-blue-800 text-sm font-medium">
              Vytváříte čistou nabídku. Pokud potřebujete spočítat spotřebu materiálu, doporučujeme začít v Kalkulátoru.
            </p>
          </div>
        )}

        {/* Zástupný blok pro budoucí formulář */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0D1B3E] mb-6">Příprava formuláře zakázky...</h2>
          <div className="space-y-4">
            <div className="h-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 animate-pulse"></div>
            <div className="h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200 animate-pulse"></div>
            <div className="h-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 animate-pulse w-1/3"></div>
          </div>
        </div>

      </div>
    </div>
  )
}