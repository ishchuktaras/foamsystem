// src/app/admin/materials/page.tsx

import Link from 'next/link'
import { getAllMaterialsAdmin } from '@/actions/material'
import AdminMaterialsTable from '@/components/AdminMaterialsTable'
import { Boxes, FlaskConical, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MaterialsAdminPage() {
  const materials = await getAllMaterialsAdmin()

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Správa materiálů
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Centrální databáze izolačních pěn. Přidávejte nové systémy, upravujte jejich parametry, hustotu a nákupní ceny pro vždy přesné kalkulace.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <Boxes size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <FlaskConical size={150} />
        </div>
      </div>

      {/* Akční panel s tlačítkem */}
      <div className="flex justify-end">
        <Link 
          href="/admin/materials/new"
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
        >
          <Plus size={20} />
          Přidat nový materiál
        </Link>
      </div>

      {/* Samotná tabulka naplněná daty ze serveru */}
      <div className="max-w-6xl mx-auto pt-2">
        <AdminMaterialsTable initialMaterials={materials} />
      </div>
      
    </div>
  )
}