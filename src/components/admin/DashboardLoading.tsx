// src/components/admin/DashboardLoading.tsx
import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 space-y-4">
      <Loader2 size={48} className="animate-spin text-[#FF4F00]" />
      <p className="font-bold tracking-wider uppercase text-sm">Načítám data ze serveru...</p>
    </div>
  )
}