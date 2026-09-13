// src/app/admin/dispatch/page.tsx

import { db } from '@/lib/db'
import { CalendarDays, MapPin, CheckCircle2, Clock, Wrench, Thermometer, User, ArrowRight } from 'lucide-react'
import DispatchForm from '@/components/DispatchForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// Pomocná funkce pro získání formátovaného čísla zakázky (YYYYMM-XXX)
async function getFormattedQuoteNumber(quoteId: string, createdAt: Date) {
  const date = new Date(createdAt)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  
  const quotesInMonth = await db.quote.findMany({
    where: {
      createdAt: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1)
      }
    },
    orderBy: { createdAt: 'asc' },
    select: { id: true }
  })

  const orderNumber = quotesInMonth.findIndex(q => q.id === quoteId) + 1
  return `${year}${month.toString().padStart(2, '0')}-${orderNumber.toString().padStart(3, '0')}`
}

export default async function DispatchPage() {
  const [activeQuotesRaw, completedQuotesRaw, applicators] = await Promise.all([
    db.quote.findMany({
      where: { status: { not: 'COMPLETED' } },
      include: { responsibleUser: true },
      orderBy: { createdAt: 'desc' }
    }),
    db.quote.findMany({
      where: { status: 'COMPLETED' },
      include: { responsibleUser: true, evidence: true },
      orderBy: { updatedAt: 'desc' }
    }),
    db.user.findMany({
      where: {
        role: { in: ['APLIKATOR', 'TECHNIK', 'SUPERVIZOR'] }
      },
      select: { id: true, name: true, email: true, role: true }
    })
  ])

  // Paralelní výpočet formátovaných čísel pro všechny zobrazené zakázky
  const activeQuotes = await Promise.all(activeQuotesRaw.map(async (q) => ({
    ...q,
    formattedId: await getFormattedQuoteNumber(q.id, q.createdAt)
  })))

  const completedQuotes = await Promise.all(completedQuotesRaw.map(async (q) => ({
    ...q,
    formattedId: await getFormattedQuoteNumber(q.id, q.createdAt)
  })))

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-500 w-full min-w-0 pb-16">
      
      {/* Banner */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Dispečink & Rozvrh tras
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            Plánování realizací, přiřazování odpovědných aplikátorů a kontrola vyplněných technických deníků z terénu.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <CalendarDays size={300} />
        </div>
      </div>

      {/* SEKCE 1: AKTIVNÍ / ROZPRACOVANÉ ZAKÁZKY K PLANOVÁNÍ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
          <Clock size={22} className="text-[#FF4F00]" /> Aktivní zakázky k naplánování ({activeQuotes.length})
        </h2>

        {activeQuotes.length === 0 ? (
          <div className="w-full bg-[#FEFEFA] p-8 rounded-2xl border border-zinc-200 text-center shadow-sm text-zinc-500">
            Žádné aktivní zakázky k dispečerskému řízení.
          </div>
        ) : (
          <div className="w-full min-w-0">
            
            {/* MOBILNÍ KARTY */}
            <div className="block md:hidden space-y-4 w-full">
              {activeQuotes.map((quote) => {
                const dateValue = quote.scheduledDate 
                  ? new Date(quote.scheduledDate).toISOString().split('T')[0] 
                  : ''

                return (
                  <div key={quote.id} className="w-full bg-[#FEFEFA] p-5 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                      <div className="pr-2">
                        <div className="font-bold text-[#000000] text-lg leading-tight flex flex-col gap-1">
                          <span className="text-xs font-mono text-zinc-400 font-normal">{quote.formattedId}</span>
                          {quote.customerName}
                        </div>
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

            {/* DESKTOP TABULKA */}
            <div className="hidden md:block w-full bg-[#FEFEFA] rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-[#000000] text-[#FEFEFA] text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">Číslo / Zákazník / Lokalita</th>
                      <th className="py-4 px-6 font-semibold">Materiál & Rozsah</th>
                      <th className="py-4 px-6 font-semibold">Stav</th>
                      <th className="py-4 px-6 font-semibold text-right">Plán a přiřazení</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm">
                    {activeQuotes.map((quote) => {
                      const dateValue = quote.scheduledDate 
                        ? new Date(quote.scheduledDate).toISOString().split('T')[0] 
                        : ''

                      return (
                        <tr key={quote.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="text-[10px] font-mono text-zinc-400 mb-0.5">{quote.formattedId}</div>
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

      {/* SEKCE 2: DOKONČENÉ STAVBY A TECHNICKÉ DENÍKY Z TERÉNU */}
      <div className="pt-8 border-t border-zinc-200 space-y-4">
        <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
          <CheckCircle2 size={22} className="text-emerald-600" /> Dokončené stavby & Technické deníky ({completedQuotes.length})
        </h2>

        {completedQuotes.length === 0 ? (
          <div className="w-full bg-[#FEFEFA] p-8 rounded-2xl border border-zinc-200 text-center shadow-sm text-zinc-500">
            Zatím neevidujeme žádné dokončené stavby s odevzdaným deníkem.
          </div>
        ) : (
          <div className="space-y-4">
            {completedQuotes.map((quote) => {
              const ev = quote.evidence
              const strokes = ev ? (ev.reactorEnd - ev.reactorStart) : 0

              return (
                <div key={quote.id} className="w-full bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Dokončeno
                        </span>
                        {/* ZMĚNA: Tady už se používá vygenerované pořadové číslo zakázky */}
                        <span className="text-xs text-zinc-400 font-mono tracking-widest">{quote.formattedId}</span>
                      </div>
                      <h3 className="font-extrabold text-xl text-[#000000]">{quote.customerName}</h3>
                      <p className="text-sm text-zinc-500">{quote.street || ''}, {quote.city} • {quote.area} m² / {quote.thickness} cm ({quote.materialName})</p>
                    </div>

                    <div>
                      <Link 
                        href={`/admin/quotes/${quote.id}`}
                        className="px-5 py-2.5 bg-[#000000] hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 w-full md:w-auto justify-center"
                      >
                        <Wrench size={16} /> Detail a Fakturace <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* TELEMETRIE A TECHNICKÁ DATA Z DENÍKU */}
                  {ev ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      
                      {/* 1. Kdo a kdy */}
                      <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <User size={12}/> Vyplnil aplikátor
                        </p>
                        <p className="font-bold text-zinc-800">{quote.responsibleUser?.name || 'Neznámý'}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {ev.createdAt ? new Date(ev.createdAt).toLocaleString('cs-CZ') : 'Reálná realizace'}
                        </p>
                      </div>

                      {/* 2. Teploty */}
                      <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Thermometer size={12}/> Teploty (Ven / In / Podklad)
                        </p>
                        <p className="font-bold text-zinc-800">
                          {ev.ambientTemp}°C / {ev.internalTemp}°C / {ev.surfaceTemp}°C
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Podklad: {ev.surfaceType}</p>
                      </div>

                      {/* 3. Spotřeba na reaktoru */}
                      <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Spotřeba / Zdvihy reaktoru</p>
                        <p className="font-black text-[#FF4F00]">
                          {strokes} zdvihů <span className="text-xs font-normal text-zinc-600">({ev.reactorStart} → {ev.reactorEnd})</span>
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Koeficient stroje aplikován</p>
                      </div>

                      {/* 4. Vícepráce */}
                      <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Vícepráce a příplatky</p>
                        <p className="font-bold text-zinc-800 text-xs">
                          Fólie: {ev.foilRolls} rolí ({ev.packingHours}h)<br/>
                          Agregát: {ev.generatorKwh || 0} kWh
                        </p>
                        <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                          {ev.finalInvoiceTotal ? `Fakturováno: ${Math.round(ev.finalInvoiceTotal).toLocaleString('cs-CZ')} Kč` : 'Čeká na uložení vyúčtování'}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-xl font-medium">
                      Stavba je označena jako dokončená, ale aplikátor zatím neodeslal data z mobilního deníku.
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}