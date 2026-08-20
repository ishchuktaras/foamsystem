'use client'

import { useSession } from 'next-auth/react'
import { User } from 'lucide-react'

export default function CompanyBadge() {
  const { data: session, status } = useSession()

  // Načítací stav
  if (status === "loading") {
    return (
      <div className="mx-4 mb-2 px-4 py-3 bg-[#111111] rounded-xl border border-zinc-900 flex items-center gap-3 animate-pulse">
        <div className="w-7 h-7 bg-zinc-800 rounded-lg shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
          <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  const currentUser = session?.user as { name?: string | null; email?: string | null } | undefined
  const userName = currentUser?.name || currentUser?.email || 'Neznámý uživatel'

  return (
    <div className="mx-4 mb-2 px-4 py-3 bg-[#111111] rounded-xl border border-zinc-800 flex items-center gap-3">
      <div className="p-1.5 bg-[#FF4F00]/10 rounded-lg text-[#FF4F00] shrink-0">
        <User size={16} />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-0.5">
          Přihlášen jako
        </span>
        <span 
          className="text-sm font-bold text-[#FEFEFA] truncate w-full" 
          title={userName}
        >
          {userName}
        </span>
      </div>
    </div>
  )
}