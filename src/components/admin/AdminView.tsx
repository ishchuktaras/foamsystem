// src/components/admin/AdminView.tsx
import { FileText, Boxes, ShieldCheck, TrendingUp, Calculator, CheckCircle2, Users, Database, ClipboardList, PenTool, ClipboardCheck, CalendarDays, Wallet, ArrowUpRight, ArrowDownRight, Briefcase, Truck } from 'lucide-react'
import { db } from '@/lib/db'
import { UpcomingDispatch, QuoteItem } from '@/types/dashboard'
import DashboardCard from './DashboardCard'

export default async function AdminView() {
  let materialsCount = 0, usersCount = 0, inquiriesCount = 0, ordersCount = 0, contractsCount = 0, completedCount = 0, dispatchedCount = 0
  let allQuotes: QuoteItem[] = []
  let upcomingDispatches: UpcomingDispatch[] = []

  try {
    const results = await Promise.all([
      db.material.count(),
      db.user.count(),
      db.quote.count({ where: { status: 'INQUIRY' } }),
      db.quote.count({ where: { status: 'ORDER' } }),
      db.quote.count({ where: { status: 'CONTRACT' } }),
      db.quote.count({ where: { status: 'COMPLETED' } }),
      db.quote.count({ where: { scheduledDate: { not: null }, status: { not: 'COMPLETED' } } }),
      db.quote.findMany().catch(() => []),
      db.quote.findMany({
        where: { status: { not: 'COMPLETED' }, scheduledDate: { not: null } },
        include: { responsibleUser: true },
        orderBy: { scheduledDate: 'asc' },
        take: 5 
      })
    ])

    materialsCount = results[0]
    usersCount = results[1]
    inquiriesCount = results[2]
    ordersCount = results[3]
    contractsCount = results[4]
    completedCount = results[5]
    dispatchedCount = results[6]
    allQuotes = results[7] as QuoteItem[]
    upcomingDispatches = results[8] as unknown as UpcomingDispatch[]
  } catch (error) {
    console.error("Chyba při načítání statistik:", error)
  }

  const totalEarnings = allQuotes
    .filter(q => q.status === 'COMPLETED' || q.status === 'ORDER' || q.status === 'CONTRACT')
    .reduce((acc, q) => acc + (Number(q.totalCost) || Number(q.price) || 0), 0)

  const totalExpenses = allQuotes
    .filter(q => q.status === 'COMPLETED' || q.status === 'ORDER' || q.status === 'CONTRACT')
    .reduce((acc, q) => acc + (q.cost || 0), 0)

  const netProfit = totalEarnings - totalExpenses

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Analýza Work & Cash Flow</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Přehledný byznysový kokpit: sledujte stav zakázek předaných aplikátorům, dokončené stavby, celkové výdaje na materiál a čistý výdělek firmy.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]"><Boxes size={300} /></div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-4 flex items-center gap-2">
          <Wallet size={24} className="text-[#FF4F00]" /> Cash Flow & Finanční přehled
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><ArrowUpRight size={28} /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Celkový výdělek (Obrat)</p>
              <h3 className="text-2xl md:text-3xl font-black text-[#000000]">{totalEarnings.toLocaleString('cs-CZ')} Kč</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
            <div className="p-4 bg-red-50 text-red-600 rounded-xl"><ArrowDownRight size={28} /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Odhadované výdaje (Materiál)</p>
              <h3 className="text-2xl md:text-3xl font-black text-[#000000]">{totalExpenses.toLocaleString('cs-CZ')} Kč</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-[#FF4F00]">
            <div className="p-4 bg-[#FF4F00]/10 text-[#FF4F00] rounded-xl"><Wallet size={28} /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Čistý zisk (Marže)</p>
              <h3 className="text-2xl md:text-3xl font-black text-[#FF4F00]">{netProfit.toLocaleString('cs-CZ')} Kč</h3>
            </div>
          </div>

        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-4 flex items-center gap-2">
          <Briefcase size={24} className="text-[#FF4F00]" /> Provozní stav zakázek (Workflow)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={22} /></div>
            <div><p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Poptávky</p><h3 className="text-2xl font-bold text-[#000000]">{inquiriesCount}</h3></div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ClipboardList size={22} /></div>
            <div><p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Objednávky</p><h3 className="text-2xl font-bold text-[#000000]">{ordersCount}</h3></div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><PenTool size={22} /></div>
            <div><p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Smlouvy</p><h3 className="text-2xl font-bold text-[#000000]">{contractsCount}</h3></div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-600">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl"><Truck size={22} /></div>
            <div><p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Předáno aplikátorům</p><h3 className="text-2xl font-bold text-[#000000]">{dispatchedCount}</h3></div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={22} /></div>
            <div><p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dokončené stavby</p><h3 className="text-2xl font-bold text-[#000000]">{completedCount}</h3></div>
          </div>

        </div>
      </div>

      {upcomingDispatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#000000] mb-4 flex items-center gap-2">
            <CalendarDays size={24} className="text-[#FF4F00]" /> Nejbližší naplánované realizace
          </h2>
          <div className="bg-[#FEFEFA] rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-xs">
                    <th className="px-6 py-3 font-semibold">Datum realizace</th>
                    <th className="px-6 py-3 font-semibold">Zákazník a lokalita</th>
                    <th className="px-6 py-3 font-semibold">Přiřazený aplikátor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {upcomingDispatches.map(quote => (
                    <tr key={quote.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 font-bold text-[#FF4F00]">
                        {quote.scheduledDate ? new Date(quote.scheduledDate).toLocaleDateString('cs-CZ') : ''}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#000000] block">{quote.customerName}</span>
                        <span className="text-xs text-zinc-500">{quote.city} • {quote.area} m²</span>
                      </td>
                      <td className="px-6 py-4">
                        {quote.responsibleUser ? (
                          <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 w-max">
                            <Users size={12}/> {quote.responsibleUser.name || quote.responsibleUser.email}
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-bold italic">Nepřiřazeno!</span>
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

      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-4">Systémové metriky</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-[#FF4F00] transition-colors">
            <div className="p-4 bg-[#FF4F00]/10 text-[#FF4F00] rounded-xl"><Boxes size={24} /></div>
            <div><p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Evidované materiály</p><h3 className="text-2xl font-bold text-[#000000]">{materialsCount}</h3></div>
          </div>
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-emerald-500 transition-colors">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={24} /></div>
            <div><p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Aktivní pracovníci</p><h3 className="text-2xl font-bold text-[#000000]">{usersCount}</h3></div>
          </div>
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-purple-500 transition-colors">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Database size={24} /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Stav databáze</p>
              <h3 className="text-lg font-bold text-emerald-600 mt-1">Připojeno</h3>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-6">Rychlé akce</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Nová poptávka"
            value="Vytvořit"
            subtitle="s automatickým ARES"
            href="/admin/quotes/new"
            icon={<FileText size={28} className="text-[#FF4F00]" />}
            colorClass="bg-[#FF4F00]/10"
            hoverClass="group-hover:border-[#FF4F00]"
          />
          <DashboardCard
            title="Kalkulátor"
            value="Spočítat"
            subtitle="Spotřeba a cena"
            href="/admin/calculator"
            icon={<Calculator size={28} className="text-[#000000]" />}
            colorClass="bg-zinc-100"
            hoverClass="group-hover:border-[#000000]"
          />
          <DashboardCard
            title="Evidence"
            value="Archiv prací"
            subtitle="Technické parametry staveb"
            href="/admin/evidence"
            icon={<ClipboardCheck size={28} className="text-[#0D1B3E]" />}
            colorClass="bg-[#0D1B3E]/10"
            hoverClass="group-hover:border-[#0D1B3E]"
          />
          <DashboardCard
            title="Materiály"
            value="Správa pěn"
            subtitle="Úprava cen a parametrů"
            href="/admin/materials"
            icon={<Boxes size={28} className="text-amber-600" />}
            colorClass="bg-amber-50"
            hoverClass="group-hover:border-amber-500"
          />
          <DashboardCard
            title="Nabídky"
            value="Seznam"
            subtitle="Historie a stav poptávek"
            href="/admin/quotes"
            icon={<TrendingUp size={28} className="text-emerald-600" />}
            colorClass="bg-emerald-50"
            hoverClass="group-hover:border-emerald-500"
          />
          <DashboardCard
            title="Systém"
            value="ARES Test"
            subtitle="Ověření spojení s API"
            href="/admin/ares-test"
            icon={<ShieldCheck size={28} className="text-purple-600" />}
            colorClass="bg-purple-50"
            hoverClass="group-hover:border-purple-600"
          />
        </div>
      </div>
    </div>
  )
}