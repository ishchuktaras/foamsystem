// src/app/admin/quotes/page.tsx

import Link from 'next/link'
import { FileText, TrendingUp, PlusCircle } from 'lucide-react'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
  // Bezpečné načtení dat s automatickou inferencí typu z Prisemy
  const quotes = await db.quote.findMany({
    orderBy: { createdAt: 'desc' }
  }).catch((error) => {
    console.error("Chyba při načítání nabídek z databáze:", error)
    return []
  })

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Nabídky a poptávky
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Kompletní evidence klientských zakázek. Tvořte cenové nabídky, sledujte stav rozpracovaných projektů a automaticky stahujte firemní údaje pomocí integrace ARES.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <FileText size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <TrendingUp size={150} />
        </div>
      </div>

      {/* Akční panel s tlačítkem */}
      <div className="flex justify-end">
        <Link 
          href="/admin/quotes/new" 
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
        >
          <PlusCircle size={20} />
          Nová poptávka
        </Link>
      </div>

      {/* Podmíněný výpis: Seznam vs. Prázdný stav */}
      {quotes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4 mt-8 max-w-4xl mx-auto">
          <div className="flex justify-center text-gray-300 mb-2">
            <FileText size={64} />
          </div>
          <h3 className="text-xl font-bold text-[#0D1B3E]">Zatím tu nejsou žádné záznamy</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Klikněte na tlačítko &quot;Nová poptávka&quot;, vyzkoušejte si automatické načítání firem z ARES a uložte první zakázku.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-6xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D1B3E] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Zákazník / Firma</th>
                  <th className="py-4 px-6 font-semibold">Materiál</th>
                  <th className="py-4 px-6 font-semibold">Plocha / Tloušťka</th>
                  <th className="py-4 px-6 font-semibold">Celková cena</th>
                  <th className="py-4 px-6 font-semibold">Vytvořeno</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0D1B3E]">{quote.customerName}</div>
                      {quote.ico && <div className="text-xs text-gray-400">IČO: {quote.ico}</div>}
                      <div className="text-xs text-gray-500">{quote.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-[#3B82F6] font-semibold px-2.5 py-1 rounded-lg text-xs border border-blue-100">
                        {quote.materialName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="font-medium">{quote.area} m²</div>
                      <div className="text-xs text-gray-400">Tloušťka: {quote.thickness} cm</div>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-[#0D1B3E]">
                      {Number(quote.totalCost).toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {new Date(quote.createdAt).toLocaleDateString('cs-CZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
    </div>
  )
}