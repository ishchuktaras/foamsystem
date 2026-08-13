// src/components/CompanyBadge.tsx

'use client'

import { useEffect, useState } from 'react'
import { getCompanyProfile } from '@/actions/settings'
import { Building2 } from 'lucide-react'

export default function CompanyBadge() {
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getCompanyProfile()
        // TypeScript už teď ví, že tam je pouze 'companyName'
        setCompanyName(profile?.companyName || null)
      } catch (error) {
        console.error("Chyba při načítání firemního profilu", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfile()
  }, [])

  // Načítací stav (Skeleton loading)
  if (isLoading) {
    return (
      <div className="mx-4 mb-2 px-4 py-3 bg-blue-950/20 rounded-xl border border-blue-900/30 flex items-center gap-3 animate-pulse">
        <div className="w-7 h-7 bg-blue-900/40 rounded-lg shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-2 bg-blue-900/40 rounded w-1/2"></div>
          <div className="h-3 bg-blue-900/40 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  // Pokud není vyplněno, komponenta se skryje
  if (!companyName) return null

  return (
    <div className="mx-4 mb-2 px-4 py-3 bg-blue-950/40 rounded-xl border border-blue-900/50 flex items-center gap-3">
      <div className="p-1.5 bg-blue-900/50 rounded-lg text-[#3B82F6] shrink-0">
        <Building2 size={16} />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[10px] uppercase tracking-wider text-blue-300/70 font-semibold mb-0.5">
          Aktivní subjekt
        </span>
        <span 
          className="text-sm font-bold text-white truncate w-full" 
          title={companyName}
        >
          {companyName}
        </span>
      </div>
    </div>
  )
}