// src/app/admin/quotes/[id]/page.tsx
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, MapPin, CalendarDays, User, Thermometer, Wind } from 'lucide-react'
import BillingPanel from '@/components/admin/BillingPanel'

// Překlad databázových stavů do češtiny včetně barev
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  INQUIRY: { label: 'Poptávka', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ORDER: { label: 'Objednávka', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONTRACT: { label: 'Smlouva', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  COMPLETED: { label: 'Dokončeno', color: 'bg-green-50 text-green-700 border-green-200' },
}

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params
  const quoteId = resolvedParams.id

  const quote = await db.quote.findUnique({
    where: { id: quoteId },
    include: { evidence: true, responsibleUser: true }
  })

  if (!quote) return notFound()

  const companyProfile = await db.companyProfile.findFirst()

  // Získáme český popisek a barvu podle aktuálního stavu z databáze
  const statusBadge = STATUS_MAP[quote.status] || { label: quote.status, color: 'bg-zinc-100 text-zinc-700 border-zinc-200' }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/quotes" className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-zinc-600 shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#000000]">Detail zakázky</h1>
          <p className="text-zinc-500 text-sm">{quote.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INFO PANEL (Zákazník a plánování) */}
        <div className="lg:col-span-2 bg-[#FEFEFA] rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="font-bold text-xl text-[#000000]">{quote.customerName}</h2>
                <p className="text-sm text-zinc-500 font-medium mt-0.5">IČO: {quote.ico || 'Neprovedeno'}</p>
              </div>
            </div>
            
            {/* Vykreslení přeloženého stavu */}
            <span className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${statusBadge.color}`}>
              {statusBadge.label}
            </span>

          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Adresa realizace</p>
              <div className="flex items-start gap-3 text-zinc-700 font-medium bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <MapPin size={20} className="text-[#FF4F00] shrink-0 mt-0.5" />
                <span>{quote.street}<br/>{quote.city} {quote.zip}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Přiřazení a termín</p>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
                <div className="flex items-center gap-3 text-zinc-700 font-medium">
                  <User size={18} className="text-zinc-400 shrink-0" />
                  <span>{quote.responsibleUser?.name || 'Zatím nepřiřazeno'}</span>
                </div>
                {quote.scheduledDate ? (
                  <div className="flex items-center gap-3 text-zinc-700 font-medium pt-3 border-t border-zinc-200">
                    <CalendarDays size={18} className="text-[#FF4F00] shrink-0" />
                    <span className="font-bold text-[#FF4F00]">{new Date(quote.scheduledDate).toLocaleDateString('cs-CZ')}</span>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-zinc-200 text-sm text-zinc-400 italic">Termín neurčen</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TECHNICKÁ DATA PANEL (Původní odhad) */}
        <div className="bg-gradient-to-br from-[#000000] to-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-6 text-white flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-5">Technická specifikace</p>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Materiál</p>
                <p className="font-bold text-lg text-blue-400">{quote.materialName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                  <p className="text-xs text-zinc-400 uppercase font-bold mb-1">Plocha</p>
                  <p className="font-bold text-lg">{quote.area} m²</p>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                  <p className="text-xs text-zinc-400 uppercase font-bold mb-1">Tloušťka</p>
                  <p className="font-bold text-lg">{quote.thickness} cm</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5 mt-5 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 mb-1">Původní odhad ceny (bez víceprací)</p>
            <p className="font-black text-3xl text-[#FF4F00]">{Number(quote.totalCost).toLocaleString('cs-CZ')} <span className="text-xl">Kč</span></p>
          </div>
        </div>
      </div>

      {quote.evidence && (
        <div className="bg-[#FEFEFA] p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-zinc-100 rounded-xl"><Wind className="text-zinc-600" size={20} /></div>
            <h3 className="text-lg font-black text-[#000000]">Technický deník aplikátora</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm">
              <p className="text-zinc-500 font-bold uppercase text-[10px] mb-2 flex items-center gap-1"><Thermometer size={14}/> Teploty (°C)</p>
              <div className="space-y-1">
                <p className="font-bold text-zinc-800 flex justify-between"><span>Venkovní:</span> <span>{quote.evidence.ambientTemp}</span></p>
                <p className="font-bold text-zinc-800 flex justify-between"><span>Vnitřní:</span> <span>{quote.evidence.internalTemp}</span></p>
                <p className="font-bold text-zinc-800 flex justify-between"><span>Povrch:</span> <span>{quote.evidence.surfaceTemp}</span></p>
              </div>
            </div>
            
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm flex flex-col justify-center">
              <p className="text-zinc-500 font-bold uppercase text-[10px] mb-1">Typ povrchu</p>
              <p className="font-black text-lg text-zinc-800">{quote.evidence.surfaceType}</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 shadow-sm flex flex-col justify-center">
              <p className="text-orange-600 font-bold uppercase text-[10px] mb-1">Stroj (Zdvihy Start - Konec)</p>
              <p className="font-black text-xl text-[#FF4F00]">
                {quote.evidence.reactorStart} <span className="text-orange-300 font-normal">→</span> {quote.evidence.reactorEnd}
              </p>
            </div>
            
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm flex flex-col justify-center">
              <p className="text-zinc-500 font-bold uppercase text-[10px] mb-2">Ztížené podmínky / Výšky</p>
              <div className="space-y-1">
                <p className="font-bold text-zinc-800 flex justify-between">
                  <span>Práce ve výškách:</span> 
                  <span className={quote.evidence.workingAtHeights ? 'text-red-500' : 'text-zinc-400'}>{quote.evidence.workingAtHeights ? 'Ano' : 'Ne'}</span>
                </p>
                <p className="font-bold text-zinc-800 flex justify-between">
                  <span>Ztížené prostředí:</span> 
                  <span className={quote.evidence.difficultEnv ? 'text-red-500' : 'text-zinc-400'}>{quote.evidence.difficultEnv ? 'Ano' : 'Ne'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ODSTRANĚNÉ "as any", PŘEDÁVÁ SE ČISTÝ OBJEKT */}
      {quote.status === 'COMPLETED' && quote.evidence && (
        <BillingPanel 
          quote={quote} 
          evidence={quote.evidence} 
          companyProfile={companyProfile} 
        />
      )}
    </div>
  )
}