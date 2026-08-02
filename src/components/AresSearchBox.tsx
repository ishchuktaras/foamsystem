// src/components/AresSearchBox.tsx

'use client'

import { useState, useTransition } from 'react'
import { fetchCompanyByIco, AresCompanyData } from '@/actions/ares'
import { Building2, Search, Loader2 } from 'lucide-react'

export default function AresSearchBox() {
  const [ico, setIco] = useState('')
  const [companyData, setCompanyData] = useState<AresCompanyData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCompanyData(null)

    startTransition(async () => {
      const result = await fetchCompanyByIco(ico)
      if (!result.success) {
        setError(result.error || 'Neznámá chyba')
      } else if (result.data) {
        setCompanyData(result.data)
      }
    })
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-xl">
      <h2 className="text-xl font-bold text-[#0D1B3E] mb-2 flex items-center gap-2.5">
        <Building2 className="text-[#3B82F6]" size={24} />
        Ověření firmy přes ARES
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Zadejte 8místné IČO pro automatické stažení údajů z registru.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={ico}
          onChange={(e) => setIco(e.target.value)}
          placeholder="např. 23874694"
          maxLength={8}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium bg-white placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isPending || !ico.trim()}
          className="px-6 py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Hledám...
            </>
          ) : (
            <>
              <Search size={18} />
              Načíst
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {companyData && (
        <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 text-sm">
          <h3 className="font-bold text-[#0D1B3E] border-b border-gray-200 pb-2 text-base">
            Nalezený subjekt:
          </h3>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            <p><strong className="text-gray-500 w-24 inline-block">Název:</strong> <span className="font-semibold text-gray-900">{companyData.name}</span></p>
            <p><strong className="text-gray-500 w-24 inline-block">IČO:</strong> <span className="font-medium text-gray-800">{companyData.ico}</span></p>
            {companyData.dic && (
              <p><strong className="text-gray-500 w-24 inline-block">DIČ:</strong> <span className="font-medium text-gray-800">{companyData.dic}</span></p>
            )}
            <p><strong className="text-gray-500 w-24 inline-block">Adresa:</strong> <span className="font-medium text-gray-800">{companyData.street}, {companyData.zip} {companyData.city}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}