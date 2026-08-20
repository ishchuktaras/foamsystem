// src/app/admin/quotes/page.tsx

import Link from 'next/link'
import { FileText, TrendingUp, PlusCircle, Trash2, ClipboardCheck, Calendar } from 'lucide-react'
import { db } from '@/lib/db'
import { deleteQuote } from '@/actions/quote'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
  const session = await auth()
  const currentUser = session?.user as { id?: string; role?: string } | undefined
  const role = currentUser?.role ? String(currentUser.role).toUpperCase() : ''
  const userId = currentUser?.id

  const isApplicator = role === 'APLIKATOR'

  const whereClause = isApplicator 
    ? {
        OR: [
          { responsibleUserId: userId },
          { assignedUsers: { some: { id: userId } } }
        ]
      } 
    : {}

  const quotes = await db.quote.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  }).catch((error) => {
    console.error("Chyba při načítání nabídek z databáze:", error)
    return []
  })

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Prémiový Banner */}
      <div className="relative rounded-2xl bg-linear-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-6 md:p-10 text-[#FEFEFA] shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
            {isApplicator ? 'Moje naplánované zakázky' : 'Nabídky a poptávky'}
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            {isApplicator 
              ? 'Seznam zakázek, které vám byly přiděleny k realizaci. Sledujte termíny a po dokončení vyplňte technickou evidenci.'
              : 'Kompletní evidence klientských zakázek. Tvořte cenové nabídky, sledujte stav rozpracovaných projektů a po realizaci vyplňte technickou evidenci.'
            }
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <FileText size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none text-[#FF4F00] hidden md:block">
          <TrendingUp size={150} />
        </div>
      </div>

      {!isApplicator && (
        <div className="flex justify-end">
          <Link 
            href="/admin/quotes/new" 
            className="bg-[#FF4F00] hover:bg-[#E64700] text-[#FEFEFA] px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] w-full md:w-auto"
          >
            <PlusCircle size={20} />
            Nová poptávka
          </Link>
        </div>
      )}

      {quotes.length === 0 ? (
        <div className="bg-[#FEFEFA] p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 text-center space-y-4 mt-8 max-w-4xl mx-auto">
          <div className="flex justify-center text-zinc-300 mb-2">
            <FileText size={64} />
          </div>
          <h3 className="text-xl font-bold text-[#000000]">
            {isApplicator ? 'Zatím nemáte přiřazené žádné zakázky' : 'Zatím tu nejsou žádné záznamy'}
          </h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
            {isApplicator 
              ? 'Počkejte, až vám supervizor v dispečinku naplánuje práci na další dny.'
              : 'Klikněte na tlačítko Nová poptávka, vyzkoušejte si automatické načítání firem z ARES a uložte první zakázku.'
            }
          </p>
        </div>
      ) : (
        <div className="w-full">
          
          {/* 1. MOBILNÍ KARTY */}
          <div className="block space-y-4 md:hidden w-full">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-[#FEFEFA] p-5 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-4">
                
                <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                  <div className="pr-2">
                    <div className="font-bold text-[#000000] text-lg leading-tight">{quote.customerName}</div>
                    <div className="text-sm text-zinc-500 mt-1">{quote.city}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {!isApplicator && (
                      <div className="font-extrabold text-[#000000] text-lg">{Number(quote.totalCost).toLocaleString('cs-CZ')} Kč</div>
                    )}
                    <div className="text-xs text-zinc-400 mt-1">Stav: 
                      <span className={`ml-1 font-bold ${quote.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'}`}>
                        {quote.status}
                      </span>
                    </div>
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
                    <span className="font-bold text-zinc-800">{quote.area} m² <span className="font-normal text-zinc-400">/ {quote.thickness} cm</span></span>
                  </div>
                  {quote.scheduledDate && (
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-100">
                      <span className="text-zinc-500 flex items-center gap-1"><Calendar size={14} className="text-[#FF4F00]" /> Termín:</span>
                      <span className="font-bold text-[#FF4F00]">
                        {new Date(quote.scheduledDate).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
                  {quote.status !== 'COMPLETED' && (
                    <Link 
                      href={`/admin/quotes/${quote.id}/evidence`}
                      className="w-full py-3 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-green-200 shadow-sm"
                    >
                      <ClipboardCheck size={18} />
                      Vyplnit evidenci stavby
                    </Link>
                  )}
                  {!isApplicator && (
                    <div className="flex gap-2 mt-1">
                      <Link 
                        href={`/admin/quotes/${quote.id}/edit`}
                        className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-[#000000] font-bold rounded-xl text-sm transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Upravit
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteQuote(quote.id)
                      }} className="w-full">
                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-red-100"
                        >
                          <Trash2 size={16} />
                          Smazat
                        </button>
                      </form>
                    </div>
                  )}
                </div>
                
              </div>
            ))}
          </div>

          {/* 2. DESKTOP TABULKA */}
          <div className="hidden md:block bg-[#FEFEFA] rounded-2xl shadow-sm border border-zinc-200 overflow-hidden max-w-6xl mx-auto w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#000000] text-[#FEFEFA] text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Zákazník / Město</th>
                    <th className="py-4 px-6 font-semibold">Materiál / Rozsah</th>
                    <th className="py-4 px-6 font-semibold">Stav a termín</th>
                    {!isApplicator && <th className="py-4 px-6 font-semibold">Cena</th>}
                    <th className="py-4 px-6 font-semibold text-right">Akce</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#000000] text-base">{quote.customerName}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{quote.city}</div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="bg-[#FF4F00]/10 text-[#FF4F00] font-semibold px-2.5 py-1 rounded-lg text-xs border border-[#FF4F00]/20 block w-max mb-1">
                          {quote.materialName}
                        </span>
                        <div className="text-xs text-zinc-500 font-medium">{quote.area} m² / {quote.thickness} cm</div>
                      </td>
                      
                      <td className="py-4 px-6">
                        {quote.status === 'COMPLETED' ? (
                          <span className="text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-md text-xs border border-green-200 inline-block mb-1.5">Dokončeno</span>
                        ) : (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-md text-xs border border-amber-200 inline-block mb-1.5">K realizaci</span>
                        )}
                        
                        {quote.scheduledDate ? (
                          <div className="text-xs font-bold text-[#FF4F00] flex items-center gap-1 mt-1">
                            <Calendar size={13} /> {new Date(quote.scheduledDate).toLocaleDateString('cs-CZ')}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 mt-0.5 italic">Termín neurčen</div>
                        )}
                      </td>

                      {!isApplicator && (
                        <td className="py-4 px-6 font-extrabold text-[#000000]">
                          {Number(quote.totalCost).toLocaleString('cs-CZ')} Kč
                        </td>
                      )}
                      
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {quote.status !== 'COMPLETED' && (
                          <Link 
                            href={`/admin/quotes/${quote.id}/evidence`}
                            className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-bold text-sm rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm mr-2"
                          >
                            <ClipboardCheck size={16} /> Evidence
                          </Link>
                        )}
                        {!isApplicator && (
                          <>
                            <Link 
                              href={`/admin/quotes/${quote.id}/edit`}
                              className="px-3 py-1.5 bg-zinc-100 text-[#000000] hover:bg-zinc-200 font-medium text-sm rounded-md transition-colors inline-block mr-2"
                            >
                              Upravit
                            </Link>
                            <form action={async () => {
                              'use server'
                              await deleteQuote(quote.id)
                            }} className="inline-block">
                              <button 
                                type="submit"
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-md text-sm transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={14} />
                                Smazat
                              </button>
                            </form>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}
      
    </div>
  )
}