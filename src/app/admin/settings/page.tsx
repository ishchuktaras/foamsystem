// src/app/admin/settings/page.tsx

import { Building, User, Bell } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B3E]">Nastavení</h1>
        <p className="text-gray-600 mt-1">
          Správa firemního profilu, předvoleb aplikace a uživatelského účtu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Firemní údaje */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building className="text-[#3B82F6]" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-[#0D1B3E]">Firemní údaje</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Zde si v budoucnu nastavíš své fakturační údaje (IČO, adresa), které se budou automaticky propisovat do cenových nabídek.
            </p>
          </div>
          <button className="w-fit px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0D1B3E] font-medium rounded-lg transition-colors">
            Upravit údaje
          </button>
        </div>

        {/* Osobní nastavení */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="text-[#3B82F6]" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-[#0D1B3E]">Osobní profil</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Správa přihlašovacích údajů, změna hesla a kontaktního e-mailu pro upozornění.
            </p>
          </div>
          <button className="w-fit px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0D1B3E] font-medium rounded-lg transition-colors">
            Nastavení profilu
          </button>
        </div>
      </div>
    </div>
  )
}