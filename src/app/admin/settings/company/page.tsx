// src/app/admin/settings/company/page.tsx

import { getCompanyProfile } from '@/actions/settings'
import CompanySettingsForm from '@/components/CompanySettingsForm'
import Link from 'next/link'
import { ArrowLeft, Building2, Stamp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CompanySettingsPage() {
  const profile = await getCompanyProfile()

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link href="/admin/settings" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#3B82F6] transition-colors">
        <ArrowLeft size={16} className="mr-1" />
        Zpět na přehled nastavení
      </Link>

      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Firemní údaje
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Tyto informace slouží jako hlavička pro vámi generované cenové nabídky, dokumenty a faktury.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <Building2 size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Stamp size={150} />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto pt-4">
        <CompanySettingsForm initialData={profile} />
      </div>
      
    </div>
  )
}