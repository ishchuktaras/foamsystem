import Link from 'next/link'
import { Building2, UserCircle } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Nastavení</h1>
          <p className="text-gray-600 mt-1">
            Správa firemního profilu, předvoleb aplikace a uživatelského účtu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firemní údaje */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 text-[#3B82F6] rounded-lg">
                <Building2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#0D1B3E]">Firemní údaje</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6 flex-1">
              Fakturační údaje, adresa a kontakty, které se budou automaticky propisovat do cenových nabídek.
            </p>
            <Link
              href="/admin/settings/company"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#0D1B3E] font-semibold rounded-lg transition-colors"
            >
              Upravit údaje
            </Link>
          </div>

          {/* Osobní profil */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 text-[#3B82F6] rounded-lg">
                <UserCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#0D1B3E]">Osobní profil</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6 flex-1">
              Správa přihlašovacích údajů, změna hesla a kontaktního e-mailu pro upozornění.
            </p>
            <Link
              href="/admin/settings/profile"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#0D1B3E] font-semibold rounded-lg transition-colors"
            >
              Nastavení profilu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}