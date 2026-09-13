// src/app/admin/quotes/[id]/evidence/page.tsx

import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import JobExecutionForm from '@/components/applicator/JobExecutionForm'

export default async function EvidencePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Ošetření parametrů pro Next.js 15
  const resolvedParams = await params
  const { id } = resolvedParams

  // Z databáze vytáhneme jen ta data, která aplikátor na stavbě reálně potřebuje
  const quote = await db.quote.findUnique({ 
    where: { id },
    select: {
      id: true,
      customerName: true,
      street: true,
      city: true,
      zip: true,
      materialName: true,
      applicatorNotes: true,
    }
  })

  if (!quote) return notFound()

  return (
    // Odstranili jsme zbytečné desktopové okraje a bannery, 
    // aby se formulář choval jako nativní mobilní aplikace
    <div className="w-full min-h-screen bg-zinc-200/50 -m-4 sm:-m-8">
      <JobExecutionForm quote={quote} />
    </div>
  )
}