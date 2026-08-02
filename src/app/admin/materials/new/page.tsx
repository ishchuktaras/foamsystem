// src/app/admin/materials/new/page.tsx

import MaterialForm from '@/components/MaterialForm'

export default function NewMaterialPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Hlavička */}
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Přidat nový materiál</h1>
          <p className="text-gray-600 mt-1">
            Vyplňte parametry nové izolační pěny pro výpočty.
          </p>
        </div>

        {/* Komponenta formuláře */}
        <MaterialForm />

      </div>
    </div>
  )
}