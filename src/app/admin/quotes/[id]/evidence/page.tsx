// src/app/admin/quotes/[id]/evidence/page.tsx
import JobEvidenceForm from '@/components/JobEvidenceForm'
import { db } from '@/lib/db'

export default async function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quote = await db.quote.findUnique({ where: { id } })

  if (!quote) return <div>Nabídka nenalezena</div>

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-black">Evidence realizace: {quote.customerName}</h1>
      <JobEvidenceForm quoteId={id} />
    </div>
  )
}