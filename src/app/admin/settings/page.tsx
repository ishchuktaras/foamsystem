// src/app/admin/settings/page.tsx

import Link from 'next/link'
import { Building2, UserCircle, Settings, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Nastavení systému
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Správa firemního profilu, fakturačních údajů a předvoleb vašeho uživatelského účtu.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <Settings size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Shield size={150} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firemní údaje */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-[#3B82F6] rounded-xl group-hover:scale-110 transition-transform">
                <Building2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#0D1B3E]">Firemní údaje</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">
              Fakturační údaje, adresa a kontakty, které se budou automaticky propisovat do cenových nabídek.
            </p>
            <Link
              href="/admin/settings/company"
              className="inline-flex items-center justify-center px-5 py-3 bg-gray-50 hover:bg-[#3B82F6] hover:text-white border border-gray-200 hover:border-[#3B82F6] text-[#0D1B3E] font-bold rounded-xl transition-all shadow-sm"
            >
              Upravit údaje
            </Link>
          </div>

          {/* Osobní profil */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-[#3B82F6] rounded-xl group-hover:scale-110 transition-transform">
                <UserCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#0D1B3E]">Osobní profil</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">
              Správa přihlašovacích údajů, změna hesla a kontaktního e-mailu pro upozornění.
            </p>
            <Link
              href="/admin/settings/profile"
              className="inline-flex items-center justify-center px-5 py-3 bg-gray-50 hover:bg-[#3B82F6] hover:text-white border border-gray-200 hover:border-[#3B82F6] text-[#0D1B3E] font-bold rounded-xl transition-all shadow-sm"
            >
              Nastavení profilu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}