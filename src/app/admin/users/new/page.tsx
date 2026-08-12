// src/app/admin/users/new/page.tsx

import UserForm from '@/components/UserForm'
import { UserPlus, Shield } from 'lucide-react'

export default function NewUserPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Přidat nového pracovníka
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Vytvořte nový přístup do systému. Přiřaďte správnou roli, která určí práva a viditelnost modulů pro tohoto člena týmu.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <UserPlus size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Shield size={150} />
        </div>
      </div>

      {/* Samotný formulář zarovnaný pro lepší čitelnost */}
      <div className="max-w-4xl mx-auto pt-4">
        <UserForm />
      </div>

    </div>
  )
}