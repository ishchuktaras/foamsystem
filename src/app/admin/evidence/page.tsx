// src/app/admin/evidence/page.tsx
import { db } from '@/lib/db'
import Link from 'next/link'
import { CalendarDays, MapPin, CheckCircle2, Clock, ArrowRight, Wrench, Thermometer, User, Wind } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EvidencePage() {
  // 1. ZAKÁZKY ČEKAJÍCÍ NA REALIZACI (mají termín, ale nejsou COMPLETED)
  const pendingQuotes = await db.quote.findMany({
    where: {
      scheduledDate: { not: null },
      status: { not: 'COMPLETED' }
    },
    include: { responsibleUser: true },
    orderBy: { scheduledDate: 'asc' }
  })

  // 2. ARCHIV DOKONČENÝCH STAVEB (mají vyplněnou evidenci)
  const completedQuotes = await db.quote.findMany({
    where: {
      status: 'COMPLETED',
      evidence: { isNot: null }
    },
    include: { evidence: true, responsibleUser: true },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-16">
      
      {/* BANNER PRO SUPERVIZORA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-6 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">Evidence práce (Zástup)</h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            Centrální správa technických deníků. Zde můžete jako supervizor rovnou odklikat a zadat realizaci za aplikátora, nebo si prohlížet historii již odevzdaných staveb.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <Wind size={300} />
        </div>
      </div>

      {/* SEKCE 1: KARTY K ODKLIKÁNÍ (STEJNÉ JAKO MÁ APLIKÁTOR) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
          <Clock size={22} className="text-[#FF4F00]" /> Čeká na zadání realizace ({pendingQuotes.length})
        </h2>

        {pendingQuotes.length === 0 ? (
          <div className="bg-[#FEFEFA] p-8 rounded-2xl border border-zinc-200 text-center text-zinc-500 shadow-sm font-medium">
            Paráda! Aktuálně nemáte žádné zakázky, které by čekaly na vyplnění deníku.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingQuotes.map((quote) => {
              const dateValue = quote.scheduledDate 
                ? new Date(quote.scheduledDate).toLocaleDateString('cs-CZ') 
                : 'Termín neurčen'

              return (
                <div key={quote.id} className="bg-[#FEFEFA] p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-[#FF4F00]/50 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {quote.status}
                      </span>
                      <span className="text-xs font-bold text-[#FF4F00] flex items-center gap-1">
                        <CalendarDays size={14} /> {dateValue}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-[#000000] mb-1">{quote.customerName}</h3>
                    
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                      <MapPin size={14} className="text-[#FF4F00]" /> {quote.street || ''}, {quote.city}
                    </p>
                    <p className="text-xs font-bold text-zinc-600 flex items-center gap-1 mb-3">
                      <User size={14} className="text-zinc-400" /> Přiřazeno: {quote.responsibleUser?.name || 'Nepřiřazeno'}
                    </p>

                    <div className="text-xs font-semibold text-zinc-700 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 mb-4">
                      {quote.materialName} ({quote.area} m² / {quote.thickness} cm)
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">Odeslat jako supervizor</span>
                    <Link 
                      href={`/admin/quotes/${quote.id}/evidence`} 
                      className="px-4 py-2 bg-[#FF4F00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      Zadat deník <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SEKCE 2: ARCHIV ODEVZDANÝCH STAVEB */}
      <div className="pt-8 border-t border-zinc-200 space-y-4">
        <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
          <CheckCircle2 size={22} className="text-emerald-600" /> Archiv odevzdaných staveb ({completedQuotes.length})
        </h2>

        {completedQuotes.length === 0 ? (
          <div className="bg-[#FEFEFA] p-10 rounded-2xl border border-zinc-200 text-center flex flex-col items-center justify-center shadow-sm">
            <CheckCircle2 size={40} className="text-zinc-300 mb-3" />
            <p className="text-zinc-500 font-medium text-lg">Zatím žádná odevzdaná stavba.</p>
            <p className="text-zinc-400 text-sm mt-1">Až u některé zakázky nahoře vyplníte evidenci, přesune se sem do archivu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedQuotes.map((quote) => {
              const ev = quote.evidence
              const strokes = ev ? (ev.reactorEnd - ev.reactorStart) : 0

              return (
                <div key={quote.id} className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Dokončeno
                        </span>
                        <span className="text-xs text-zinc-400">Aplikátor: {quote.responsibleUser?.name || 'Neznámý'}</span>
                      </div>
                      <h3 className="font-extrabold text-xl text-[#000000]">{quote.customerName}</h3>
                      <p className="text-sm text-zinc-500">{quote.street || ''}, {quote.city} • {quote.area} m² / {quote.thickness} cm ({quote.materialName})</p>
                    </div>

                    <div>
                      <Link 
                        href={`/admin/quotes/${quote.id}/evidence`}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 justify-center"
                      >
                        <Wrench size={14} /> Detail a úprava deníku
                      </Link>
                    </div>
                  </div>

                  {ev && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Thermometer size={12}/> Teploty (Ven / In / Podklad)
                        </p>
                        <p className="font-bold text-zinc-800">
                          {ev.ambientTemp}°C / {ev.internalTemp}°C / {ev.surfaceTemp}°C
                        </p>
                      </div>

                      <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Zdvihy reaktoru</p>
                        <p className="font-black text-[#FF4F00]">
                          {strokes} zdvihů <span className="text-xs font-normal text-zinc-600">({ev.reactorStart} → {ev.reactorEnd})</span>
                        </p>
                      </div>

                      <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Vícepráce</p>
                        <p className="font-bold text-zinc-800 text-xs">
                          Fólie: {ev.foilRolls} rolí ({ev.packingHours}h)<br/>
                          Agregát: {ev.generatorKwh || 0} kWh
                        </p>
                      </div>
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