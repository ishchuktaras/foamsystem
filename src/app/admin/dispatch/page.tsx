// src/app/admin/dispatch/page.tsx

import { db } from '@/lib/db'
import { CalendarDays, MapPin } from 'lucide-react'
import DispatchForm from '@/components/DispatchForm'

export const dynamic = 'force-dynamic'

export default async function DispatchPage() {
  const [quotes, applicators] = await Promise.all([
    db.quote.findMany({
      where: { status: { not: 'COMPLETED' } },
      include: { responsibleUser: true },
      orderBy: { createdAt: 'desc' }
    }),
    db.user.findMany({
      where: {
        role: { in: ['APLIKATOR', 'TECHNIK', 'SUPERVIZOR'] }
      },
      select: { id: true, name: true, email: true, role: true }
    })
  ])

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500 max-w-full overflow-hidden">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Dispečink & Rozvrh tras
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            Plánování realizací a přiřazování odpovědných aplikátorů k jednotlivým zakázkám.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <CalendarDays size={300} />
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-[#FEFEFA] p-12 rounded-2xl border border-zinc-200 text-center shadow-sm">
          <CalendarDays size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-xl font-bold text-[#000000]">Žádné aktivní zakázky</h3>
        </div>
      ) : (
        <div className="w-full">
          
          {/* 1. ZOBRAZENÍ PRO MOBILY (Karty pod sebou) */}
          <div className="block md:hidden space-y-4 w-full">
            {quotes.map((quote) => {
              const dateValue = quote.scheduledDate 
                ? new Date(quote.scheduledDate).toISOString().split('T')[0] 
                : ''

              return (
                <div key={quote.id} className="bg-[#FEFEFA] p-5 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                    <div className="pr-2">
                      <div className="font-bold text-[#000000] text-lg leading-tight">{quote.customerName}</div>
                      <div className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} className="text-[#FF4F00]" /> {quote.city}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md text-xs border border-amber-200">
                        {quote.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Materiál:</span>
                      <span className="bg-[#FF4F00]/10 text-[#FF4F00] font-bold px-2.5 py-1 rounded-lg text-xs border border-[#FF4F00]/20">
                        {quote.materialName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Rozměry:</span>
                      <span className="font-bold text-zinc-800">{quote.area} m² / {quote.thickness} cm</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100">
                    <DispatchForm 
                      isMobile={true}
                      quoteId={quote.id}
                      defaultDate={dateValue}
                      defaultUserId={quote.responsibleUserId || ''}
                      applicators={applicators}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* 2. ZOBRAZENÍ PRO DESKTOP (Tabulka) */}
          <div className="hidden md:block bg-[#FEFEFA] rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#000000] text-[#FEFEFA] text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Zákazník / Lokalita</th>
                    <th className="py-4 px-6 font-semibold">Materiál & Rozsah</th>
                    <th className="py-4 px-6 font-semibold">Stav</th>
                    <th className="py-4 px-6 font-semibold text-right">Plán a přiřazení</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {quotes.map((quote) => {
                    const dateValue = quote.scheduledDate 
                      ? new Date(quote.scheduledDate).toISOString().split('T')[0] 
                      : ''

                    return (
                      <tr key={quote.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#000000] text-base">{quote.customerName}</div>
                          <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={12} className="text-[#FF4F00]" /> {quote.city}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className="bg-[#FF4F00]/10 text-[#FF4F00] font-semibold px-2.5 py-1 rounded-lg text-xs border border-[#FF4F00]/20 block w-max mb-1">
                            {quote.materialName}
                          </span>
                          <div className="text-xs text-zinc-500">{quote.area} m² / {quote.thickness} cm</div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-md text-xs border border-amber-200">
                            {quote.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <DispatchForm 
                            isMobile={false}
                            quoteId={quote.id}
                            defaultDate={dateValue}
                            defaultUserId={quote.responsibleUserId || ''}
                            applicators={applicators}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}