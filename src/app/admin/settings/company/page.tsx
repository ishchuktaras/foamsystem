import { getCompanyProfile } from '@/actions/settings'
import CompanySettingsForm from '@/components/CompanySettingsForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CompanySettingsPage() {
  const profile = await getCompanyProfile()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/admin/settings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#3B82F6] transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Zpět na přehled nastavení
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Firemní údaje</h1>
          <p className="text-gray-600 mt-1">
            Tyto informace slouží jako hlavička pro vámi generované cenové nabídky a faktury.
          </p>
        </div>
        
        <CompanySettingsForm initialData={profile} />
        
      </div>
    </div>
  )
}