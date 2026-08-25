// src/app/admin/page.tsx

import Link from 'next/link'
import { FileText, Boxes, ShieldCheck, TrendingUp, Calculator, ArrowRight, CheckCircle2, Users, Database, ClipboardList, PenTool, ClipboardCheck, Calendar, HardHat, Clock, Truck, Flame, CalendarDays } from 'lucide-react'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

// 1. DEFINICE TYPU PRO DISPEČINK (nahrazuje 'any')
type UpcomingDispatch = {
  id: string;
  scheduledDate: Date | null;
  customerName: string | null;
  city: string | null;
  area: string | null;
  responsibleUser: {
    name: string | null;
    email: string | null;
  } | null;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }> | { period?: string }
}) {
  const session = await auth()
  const currentUser = session?.user as { id?: string; role?: string; name?: string } | undefined
  const role = currentUser?.role ? String(currentUser.role).toUpperCase() : ''
  const userId = currentUser?.id
  const userName = currentUser?.name || 'Aplikátore'

  const isApplicator = role === 'APLIKATOR' || role === 'POMOCNIK'

  // ==========================================
  // POHLED APLIKÁTORA (Omezený dashboard s rozvrhem a časy)
  // ==========================================
  if (isApplicator && userId) {
    const params = await searchParams
    const period = params?.period || 'today'
    
    const now = new Date()
    let startDate = new Date()
    
    if (period === 'today') startDate.setHours(0, 0, 0, 0)
    else if (period === 'week') {
      const day = now.getDay() || 7
      if (day !== 1) startDate.setHours(-24 * (day - 1))
      startDate.setHours(0, 0, 0, 0)
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    const pendingQuotes = await db.quote.count({
      where: { status: { not: 'COMPLETED' }, OR: [{ responsibleUserId: userId }, { assignedUsers: { some: { id: userId } } }] }
    })
    const completedQuotesPeriod = await db.quote.count({
      where: { status: 'COMPLETED', updatedAt: { gte: startDate }, OR: [{ responsibleUserId: userId }, { assignedUsers: { some: { id: userId } } }] }
    })

    // Načtení konkrétních budoucích úkolů pro aplikátora
    const myUpcomingJobs = await db.quote.findMany({
      where: {
        status: { not: 'COMPLETED' },
        scheduledDate: { not: null },
        OR: [{ responsibleUserId: userId }, { assignedUsers: { some: { id: userId } } }]
      },
      orderBy: { scheduledDate: 'asc' }
    })

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2b5e] border border-blue-900/50 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Ahoj, {userName.split(' ')[0]}!
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Zkontroluj si svůj plán realizací a nezapomeň u dokončených staveb vyplňovat technickou evidenci.
            </p>
          </div>
          <div className="absolute right-0 top-0 -translate-y-4 translate-x-1/4 opacity-20 pointer-events-none text-blue-400">
            <HardHat size={250} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-500">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><ClipboardList size={28} /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Čeká na realizaci</p>
              <h3 className="text-3xl font-black text-[#000000]">{pendingQuotes}</h3>
            </div>
          </div>
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={28} /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Dokončeno</p>
              <h3 className="text-3xl font-black text-[#000000]">{completedQuotesPeriod}</h3>
            </div>
          </div>
        </div>

        {/* HARMONOGRAM APLIKÁTORA S ČASY */}
        <div>
          <h2 className="text-xl font-bold text-[#000000] mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-[#FF4F00]" /> Můj plán realizací
          </h2>
          
          {myUpcomingJobs.length === 0 ? (
            <div className="bg-[#FEFEFA] p-8 rounded-2xl border border-zinc-200 text-center text-zinc-500">
              Zatím nemáš na nejbližší dny naplánovanou žádnou trasu.
            </div>
          ) : (
            <div className="space-y-4">
              {myUpcomingJobs.map(job => {
                const areaNum = Number(job.area) || 0
                // Hrubý odhad: 40m2 za hodinu stříkání
                const applicationHours = Math.max(1, Math.round((areaNum / 40) * 10) / 10)
                const totalHours = 1 + 1.5 + applicationHours // 1h doprava + 1.5h příprava

                return (
                  <div key={job.id} className="bg-[#FEFEFA] rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-[#000000]">{job.customerName}</div>
                        <div className="text-sm text-zinc-500">{job.city} • {job.materialName} ({job.area} m²)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#FF4F00] font-black text-lg">
                          {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString('cs-CZ') : 'Termín neurčen'}
                        </div>
                        <div className="text-xs font-bold text-zinc-400 uppercase">Odhad: ~{totalHours} hod.</div>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Truck size={18} /></div>
                        <div>
                          <p className="font-bold text-[#000000]">Doprava & Vykládka</p>
                          <p className="text-zinc-500">cca 1 hodina</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0"><Flame size={18} /></div>
                        <div>
                          <p className="font-bold text-[#000000]">Příprava & Nahřátí</p>
                          <p className="text-zinc-500">cca 1.5 hod. (zakrytí, nahřátí materiálu)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0"><Clock size={18} /></div>
                        <div>
                          <p className="font-bold text-[#000000]">Aplikace pěny</p>
                          <p className="text-zinc-500">cca {applicationHours} hod. (podle {job.area} m²)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==========================================
  // POHLED ADMINA / SUPERVIZORA (Globální data + Přehled dispečinku)
  // ==========================================
  let materialsCount = 0, usersCount = 0, inquiriesCount = 0, ordersCount = 0, contractsCount = 0, completedCount = 0
  
  // Zde používáme nový přesný typ namísto 'any'
  let upcomingDispatches: UpcomingDispatch[] = []

  try {
    [materialsCount, usersCount, inquiriesCount, ordersCount, contractsCount, completedCount, upcomingDispatches] = await Promise.all([
      db.material.count(),
      db.user.count(),
      db.quote.count({ where: { status: 'INQUIRY' } }),
      db.quote.count({ where: { status: 'ORDER' } }),
      db.quote.count({ where: { status: 'CONTRACT' } }),
      db.quote.count({ where: { status: 'COMPLETED' } }),
      db.quote.findMany({
        where: { status: { not: 'COMPLETED' }, scheduledDate: { not: null } },
        include: { responsibleUser: true },
        orderBy: { scheduledDate: 'asc' },
        take: 5 // Ukáže 5 nejbližších
      })
    ])
  } catch (error) {
    console.error("Chyba při načítání statistik:", error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Přehled systému</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Vítejte v administraci FoamSystem. Zde máš rychlý přístup ke kalkulacím, zakázkám a kompletní správě izolačních materiálů.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]"><Boxes size={300} /></div>
      </div>

      {/* SOUHRN PŘEDANÝCH ZAKÁZEK PRO SUPERVIZORA */}
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

      {/* Rychlé statistiky */}
      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-4">Stav zakázek a procesů</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4"><div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div><div><p className="text-sm font-semibold text-zinc-500 uppercase">Poptávky</p><h3 className="text-2xl font-bold text-[#000000]">{inquiriesCount}</h3></div></div>
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4"><div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><ClipboardList size={24} /></div><div><p className="text-sm font-semibold text-zinc-500 uppercase">Objednávky</p><h3 className="text-2xl font-bold text-[#000000]">{ordersCount}</h3></div></div>
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4"><div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><PenTool size={24} /></div><div><p className="text-sm font-semibold text-zinc-500 uppercase">Smlouvy</p><h3 className="text-2xl font-bold text-[#000000]">{contractsCount}</h3></div></div>
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4"><div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div><div><p className="text-sm font-semibold text-zinc-500 uppercase">Dokončeno</p><h3 className="text-2xl font-bold text-[#000000]">{completedCount}</h3></div></div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-6">Rychlé akce</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Nová poptávka" value="Vytvořit" subtitle="s automatickým ARES" href="/admin/quotes/new" icon={<FileText size={28} className="text-[#FF4F00]" />} colorClass="bg-[#FF4F00]/10" hoverClass="group-hover:border-[#FF4F00]" />
          <DashboardCard title="Kalkulátor" value="Spočítat" subtitle="Spotřeba a cena" href="/admin/calculator" icon={<Calculator size={28} className="text-[#000000]" />} colorClass="bg-zinc-100" hoverClass="group-hover:border-[#000000]" />
          <DashboardCard title="Evidence" value="Archiv prací" subtitle="Technické parametry staveb" href="/admin/evidence" icon={<ClipboardCheck size={28} className="text-[#0D1B3E]" />} colorClass="bg-[#0D1B3E]/10" hoverClass="group-hover:border-[#0D1B3E]" />
        </div>
      </div>
    </div>
  )
}

// 2. DEFINICE TYPŮ PRO KARTU (nahrazuje 'any' ve spodní funkci)
interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
  hoverClass: string;
}

function DashboardCard({ title, value, subtitle, href, icon, colorClass, hoverClass }: DashboardCardProps) {
  return (
    <Link href={href} className={`group relative bg-[#FEFEFA] p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${hoverClass}`}>
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">{title}</h3>
          <p className="text-2xl font-bold text-[#000000] mb-1 group-hover:text-[#FF4F00] transition-colors">{value}</p>
          <p className="text-zinc-500 text-sm leading-relaxed">{subtitle}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#FF4F00] group-hover:text-[#FEFEFA] transition-colors shrink-0"><ArrowRight size={20} /></div>
      </div>
    </Link>
  )
}