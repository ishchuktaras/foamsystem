// src/app/admin/materials/new/page.tsx

import MaterialForm from '@/components/MaterialForm'
import { PackagePlus, Beaker } from 'lucide-react'

export default function NewMaterialPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Přidat nový materiál
          </h1>
          <p className="text-zinc-300/80 text-lg leading-relaxed">
            Vyplňte technické parametry nové izolační pěny. Systém ji následně zpřístupní v kalkulátoru pro výpočty spotřeby a cenových nabídek.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <PackagePlus size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Beaker size={150} />
        </div>
      </div>

      {/* Komponenta formuláře */}
      <div className="max-w-4xl mx-auto pt-4">
        <MaterialForm />
      </div>

    </div>
  )
}