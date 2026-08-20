// src/app/admin/page.tsx

import Link from 'next/link'
import { FileText, Boxes, ShieldCheck, TrendingUp, Calculator, ArrowRight, CheckCircle2, Users, Database, ClipboardList, PenTool, ClipboardCheck, Calendar, HardHat } from 'lucide-react'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

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
  // POHLED APLIKÁTORA (Omezený dashboard)
  // ==========================================
  if (isApplicator && userId) {
    const params = await searchParams
    const period = params?.period || 'today'
    
    // Výpočet počátečního data podle vybraného filtru
    const now = new Date()
    let startDate = new Date()
    
    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0)
    } else if (period === 'week') {
      const day = now.getDay() || 7
      if (day !== 1) startDate.setHours(-24 * (day - 1))
      startDate.setHours(0, 0, 0, 0)
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // 1. Kolik má aktivních (nedokončených) zakázek CELKEM
    const pendingQuotes = await db.quote.count({
      where: {
        status: { not: 'COMPLETED' },
        OR: [
          { responsibleUserId: userId },
          { assignedUsers: { some: { id: userId } } }
        ]
      }
    })

    // 2. Kolik zakázek dokončil ve vybraném období
    const completedQuotesPeriod = await db.quote.count({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: startDate },
        OR: [
          { responsibleUserId: userId },
          { assignedUsers: { some: { id: userId } } }
        ]
      }
    })

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Uvítací Banner Aplikátora (sjednocený styl s ostatními bannery) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Ahoj, {userName.split(' ')[0]}!
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Zde je tvůj osobní přehled. Zkontroluj si naplánované zakázky a nezapomeň u dokončených staveb včas vyplňovat technickou evidenci.
            </p>
          </div>
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
            <HardHat size={300} />
          </div>
        </div>

        {/* Filtr období */}
        <div className="flex items-center gap-2 bg-[#FEFEFA] p-2 rounded-xl border border-zinc-200 w-max shadow-sm">
          <Link 
            href="/admin?period=today"
            scroll={false} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === 'today' ? 'bg-[#FF4F00] text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            Dnes
          </Link>
          <Link 
            href="/admin?period=week"
            scroll={false} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === 'week' ? 'bg-[#FF4F00] text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            Tento týden
          </Link>
          <Link 
            href="/admin?period=month"
            scroll={false} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === 'month' ? 'bg-[#FF4F00] text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            Tento měsíc
          </Link>
        </div>

        {/* Metriky Aplikátora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-500">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <ClipboardList size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Čeká na realizaci</p>
              <h3 className="text-3xl font-black text-[#000000]">{pendingQuotes}</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Dokončeno (vybrané období)</p>
              <h3 className="text-3xl font-black text-[#000000]">{completedQuotesPeriod}</h3>
            </div>
          </div>
        </div>

        {/* Rychlé akce Aplikátora */}
        <div>
          <h2 className="text-xl font-bold text-[#000000] mb-4">Kam dál?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Moje zakázky"
              value="Seznam staveb"
              subtitle="Přiřazené práce k realizaci"
              href="/admin/quotes"
              icon={<TrendingUp size={28} className="text-[#FF4F00]" />}
              colorClass="bg-[#FF4F00]/10"
              hoverClass="group-hover:border-[#FF4F00]"
            />
            <DashboardCard
              title="Evidence"
              value="Odevzdat práci"
              subtitle="Vyplnit technické parametry"
              href="/admin/evidence"
              icon={<ClipboardCheck size={28} className="text-green-600" />}
              colorClass="bg-green-50"
              hoverClass="group-hover:border-green-500"
            />
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // POHLED ADMINA / SUPERVIZORA (Globální data)
  // ==========================================
  let materialsCount = 0
  let usersCount = 0
  let inquiriesCount = 0
  let ordersCount = 0
  let contractsCount = 0
  let completedCount = 0

  try {
    [materialsCount, usersCount, inquiriesCount, ordersCount, contractsCount, completedCount] = await Promise.all([
      db.material.count(),
      db.user.count(),
      db.quote.count({ where: { status: 'INQUIRY' } }),
      db.quote.count({ where: { status: 'ORDER' } }),
      db.quote.count({ where: { status: 'CONTRACT' } }),
      db.quote.count({ where: { status: 'COMPLETED' } }),
    ])
  } catch (error) {
    console.error("Chyba při načítání statistik z databáze:", error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Uvítací Banner Admina */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Přehled systému
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Vítejte v administraci FoamSystem. Zde máš rychlý přístup ke kalkulacím, zakázkám a kompletní správě izolačních materiálů.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <Boxes size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none text-[#FF4F00]">
          <Calculator size={150} />
        </div>
      </div>

      {/* 2. Stav zakázek (Business KPI) */}
      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-4">Stav zakázek a procesů</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-blue-500 transition-colors">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Poptávky</p>
              <h3 className="text-2xl font-bold text-[#000000]">{inquiriesCount}</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-amber-500 transition-colors">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Objednávky</p>
              <h3 className="text-2xl font-bold text-[#000000]">{ordersCount}</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-purple-500 transition-colors">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <PenTool size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Smlouvy</p>
              <h3 className="text-2xl font-bold text-[#000000]">{contractsCount}</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-emerald-500 transition-colors">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Dokončeno</p>
              <h3 className="text-2xl font-bold text-[#000000]">{completedCount}</h3>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Systémové metriky */}
      <div>
        <h2 className="text-xl font-bold text-[#000000] mb-4">Systémové metriky</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-[#FF4F00] transition-colors">
            <div className="p-4 bg-[#FF4F00]/10 text-[#FF4F00] rounded-xl">
              <Boxes size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Evidované materiály</p>
              <h3 className="text-2xl font-bold text-[#000000]">{materialsCount}</h3>
            </div>
          </div>
          
          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-emerald-500 transition-colors">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Aktivní pracovníci</p>
              <h3 className="text-2xl font-bold text-[#000000]">{usersCount}</h3>
            </div>
          </div>

          <div className="bg-[#FEFEFA] p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-purple-500 transition-colors">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <Database size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Stav databáze</p>
              <h3 className="text-2xl font-bold text-emerald-600 text-lg mt-1">Připojeno</h3>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Hlavní rozcestník - Rychlé akce */}
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
            hoverClass="group-hover:border-purple-500"
          />

        </div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
  hoverClass: string;
}

function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  href, 
  icon,
  colorClass,
  hoverClass
}: DashboardCardProps) {
  return (
    <Link 
      href={href} 
      className={`group relative bg-[#FEFEFA] p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${hoverClass}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">
            {title}
          </h3>
          <p className="text-2xl font-bold text-[#000000] mb-1 group-hover:text-[#FF4F00] transition-colors">
            {value}
          </p>
          <p className="text-zinc-500 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#FF4F00] group-hover:text-[#FEFEFA] transition-colors shrink-0">
          <ArrowRight size={20} />
        </div>
      </div>
    </Link>
  )
}