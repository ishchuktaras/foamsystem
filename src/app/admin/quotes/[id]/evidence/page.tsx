// src/app/admin/quotes/[id]/evidence/page.tsx

import JobEvidenceForm from '@/components/JobEvidenceForm'
import { db } from '@/lib/db'
import { ClipboardCheck } from 'lucide-react'

export default async function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quote = await db.quote.findUnique({ where: { id } })

  if (!quote) return <div className="p-8 text-zinc-500">Nabídka nenalezena</div>

  return (
    <div className="space-y-4 md:space-y-6 p-2 sm:p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-r from-[#000000] to-[#1a1a1a] p-5 sm:p-8 md:p-10 text-[#FEFEFA] shadow-xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 md:mb-3">
            Evidence realizace
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            Vyplnění technických parametrů a spotřeby pro zákazníka: <strong className="text-white">{quote.customerName}</strong>.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <ClipboardCheck size={300} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-4 md:mt-8">
        <JobEvidenceForm quoteId={id} />
      </div>
    </div>
  )
}