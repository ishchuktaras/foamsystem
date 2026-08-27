// src/app/admin/quotes/[id]/edit/page.tsx

import { FileSignature, Stamp } from 'lucide-react'
import QuoteForm from '@/components/QuoteForm'
import { db } from '@/lib/db'
import { getCompanyProfile } from '@/actions/settings'
import { redirect } from 'next/navigation'

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  const quote = await db.quote.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!quote) {
    redirect('/admin/quotes')
  }

  const materials = await db.material.findMany({
    where: { isArchived: false },
    orderBy: { name: 'asc' }
  })
  const companyProfile = await getCompanyProfile()

  const selectedMaterial = materials.find(m => m.name === quote.materialName)

  const initialData = {
    id: quote.id,
    materialId: selectedMaterial?.id || materials[0]?.id || '',
    area: quote.area,
    thickness: quote.thickness,
    customerName: quote.customerName,
    ico: quote.ico || '',
    street: quote.street || '',
    city: quote.city || '',
    zip: quote.zip || '',
    totalCost: quote.totalCost
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 sm:p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-r from-[#000000] to-[#1a1a1a] p-5 sm:p-8 md:p-10 text-[#FEFEFA] shadow-xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 md:mb-3">
            Úprava nabídky
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
            Aktualizujte údaje o zákazníkovi, změňte parametry zakázky nebo upravte obchodní marži pro zákazníka: <strong className="text-white">{quote.customerName}</strong>.
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <FileSignature size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none text-[#FF4F00] hidden md:block">
          <Stamp size={150} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-4 md:mt-8">
        <QuoteForm 
          materials={materials} 
          companyProfile={companyProfile}
          initialData={initialData} 
        />
      </div>
    </div>
  )
}