// src/app/admin/evidence/page.tsx

import { db } from '@/lib/db'
import { ClipboardCheck, Thermometer, Cog, Package, HardHat } from 'lucide-react'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export default async function EvidenceListPage() {
  const session = await auth()
  const currentUser = session?.user as { id?: string; role?: string } | undefined
  const role = currentUser?.role ? String(currentUser.role).toUpperCase() : ''
  const userId = currentUser?.id

  const isApplicator = role === 'APLIKATOR'

  // Pro evidenci nás zajímají POUZE dokončené zakázky. Aplikátor navíc vidí jen ty své.
  const whereClause = isApplicator 
    ? {
        status: 'COMPLETED' as const,
        OR: [
          { responsibleUserId: userId },
          { assignedUsers: { some: { id: userId } } }
        ]
      }
    : { status: 'COMPLETED' as const }

  const completedQuotes = await db.quote.findMany({
    where: whereClause,
    include: { 
      evidence: true,
      responsibleUser: true // <-- TADY JSME PŘIDALI NAČTENÍ APLIKÁTORA Z DATABÁZE
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500 max-w-full overflow-hidden">
      
      <div className="relative overflow-hidden rounded-2xl bg-[#000000] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {isApplicator ? 'Moje odevzdaná práce' : 'Evidence práce'}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Archiv dokončených realizací. Technické parametry, klimatické podmínky a záznamy o spotřebě materiálu na stavbě.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <ClipboardCheck size={300} />
        </div>
      </div>

      {completedQuotes.length === 0 ? (
        <div className="bg-[#FEFEFA] p-12 rounded-2xl border border-zinc-200 text-center shadow-sm">
          <ClipboardCheck size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-xl font-bold text-[#000000]">Zatím žádná odevzdaná stavba</h3>
          <p className="text-zinc-500 mt-2">
            {isApplicator 
              ? 'Až dokončíte a odevzdáte nějakou zakázku, objeví se v tomto archivu.'
              : 'Až u některé nabídky vyplníš technickou evidenci, objeví se zde.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {completedQuotes.map((quote) => (
            <div key={quote.id} className="bg-[#FEFEFA] text-[#000000] rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              
              <div className="p-6 md:w-1/3 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-bold text-[#FF4F00] uppercase tracking-wider mb-1">Zákazník</div>
                  <h3 className="text-xl font-black text-[#000000] mb-2">{quote.customerName}</h3>
                  <div className="text-sm text-zinc-600 mb-4">{quote.city}</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Materiál:</span>
                    <span className="font-bold text-[#000000]">{quote.materialName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Rozsah:</span>
                    <span className="font-bold text-[#000000]">{quote.area} m² / {quote.thickness} cm</span>
                  </div>
                  
                  {/* NOVÝ ŘÁDEK S INFORMACÍ O APLIKÁTOROVI */}
                  <div className="flex justify-between mt-2 pt-2 border-t border-zinc-200">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <HardHat size={14} className="text-[#FF4F00]" /> Aplikátor:
                    </span>
                    <span className="font-bold text-[#000000]">
                      {quote.responsibleUser?.name || quote.responsibleUser?.email || 'Nepřiřazeno'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {quote.evidence ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#000000] font-bold border-b border-zinc-100 pb-2">
                        <Thermometer size={16} className="text-[#FF4F00]" /> Teploty
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-zinc-500">Venkovní:</span> <strong className="text-[#000000]">{quote.evidence.ambientTemp} °C</strong></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Vnitřní:</span> <strong className="text-[#000000]">{quote.evidence.internalTemp} °C</strong></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Povrch:</span> <strong className="text-[#000000]">{quote.evidence.surfaceTemp} °C</strong></div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-zinc-100"><span className="text-zinc-500">Podklad:</span> <strong className="uppercase text-[#000000]">{quote.evidence.surfaceType}</strong></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#000000] font-bold border-b border-zinc-100 pb-2">
                        <Cog size={16} className="text-[#FF4F00]" /> Reaktory
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-zinc-500">Start:</span> <strong className="text-[#000000]">{quote.evidence.reactorStart}</strong></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Konec:</span> <strong className="text-[#000000]">{quote.evidence.reactorEnd}</strong></div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-zinc-100"><span className="text-zinc-500">Zdvihy celkem:</span> <strong className="text-[#FF4F00]">{quote.evidence.reactorEnd - quote.evidence.reactorStart}</strong></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#000000] font-bold border-b border-zinc-100 pb-2">
                        <Package size={16} className="text-[#FF4F00]" /> Provoz
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-zinc-500">Balení (role):</span> <strong className="text-[#000000]">{quote.evidence.foilRolls} ks</strong></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Čas balení:</span> <strong className="text-[#000000]">{quote.evidence.packingHours} h</strong></div>
                        
                        {(quote.evidence.workingAtHeights || quote.evidence.ventilationUsed || quote.evidence.difficultEnv) && (
                          <div className="mt-2 pt-2 border-t border-zinc-100 flex flex-wrap gap-1">
                            {quote.evidence.workingAtHeights && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Výšky</span>}
                            {quote.evidence.ventilationUsed && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Odvětrávání</span>}
                            {quote.evidence.difficultEnv && <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Ztížené podm.</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-3 text-center text-zinc-400 py-8 italic">Data evidence chybí</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}