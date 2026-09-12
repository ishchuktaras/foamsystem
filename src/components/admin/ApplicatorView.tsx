// src/components/admin/ApplicatorView.tsx
import { Calendar, HardHat, ClipboardList, CheckCircle2, Truck, Flame, Clock } from 'lucide-react'
import { db } from '@/lib/db'

interface ApplicatorViewProps {
  userId: string;
  userName: string;
  searchParams: Promise<{ period?: string }> | { period?: string };
}

export default async function ApplicatorView({ 
  userId, 
  userName, 
  searchParams 
}: ApplicatorViewProps) {
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

  const [pendingQuotes, completedQuotesPeriod, myUpcomingJobs] = await Promise.all([
    db.quote.count({
      where: { status: { not: 'COMPLETED' }, OR: [{ responsibleUserId: userId }, { assignedUsers: { some: { id: userId } } }] }
    }),
    db.quote.count({
      where: { status: 'COMPLETED', updatedAt: { gte: startDate }, OR: [{ responsibleUserId: userId }, { assignedUsers: { some: { id: userId } } }] }
    }),
    db.quote.findMany({
      where: {
        status: { not: 'COMPLETED' },
        scheduledDate: { not: null },
        OR: [{ responsibleUserId: userId }, { assignedUsers: { some: { id: userId } } }]
      },
      orderBy: { scheduledDate: 'asc' }
    })
  ])

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
              const applicationHours = Math.max(1, Math.round((areaNum / 40) * 10) / 10)
              const totalHours = 1 + 1.5 + applicationHours

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
                        <p className="text-zinc-500">cca 1.5 hod.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0"><Clock size={18} /></div>
                      <div>
                        <p className="font-bold text-[#000000]">Aplikace pěny</p>
                        <p className="text-zinc-500">cca {applicationHours} hod.</p>
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