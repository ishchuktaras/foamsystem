// src/components/CompanySettingsForm.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCompanyProfile } from '@/actions/settings'
import { Save, Loader2 } from 'lucide-react'

// Přesně definovaný typ místo zakázaného "any"
type ProfileData = {
  companyName?: string | null;
  ico?: string | null;
  dic?: string | null;
  street?: string | null;
  city?: string | null;
  zip?: string | null;
  bankAccount?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

export default function CompanySettingsForm({ initialData }: { initialData: ProfileData | null }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    ico: initialData?.ico || '',
    dic: initialData?.dic || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    zip: initialData?.zip || '',
    bankAccount: initialData?.bankAccount || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const result = await updateCompanyProfile(formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Údaje byly úspěšně uloženy.' })
      router.refresh()
    } else {
      setMessage({ type: 'error', text: result.error || 'Něco se pokazilo.' })
    }
    setIsLoading(false)
  }

  // Společné třídy pro všechny inputy, aby byly krásně čitelné
  const inputClassName = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder:text-gray-400 bg-white"

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
      
      {/* Základní údaje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">Název subjektu / Firmy</label>
          <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="např. Technická firma s.r.o." className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">IČO</label>
          <input name="ico" value={formData.ico} onChange={handleChange} placeholder="např. 23874694" className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">DIČ</label>
          <input name="dic" value={formData.dic} onChange={handleChange} placeholder="např. CZ12345678" className={inputClassName} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Adresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">Ulice a číslo popisné</label>
          <input name="street" value={formData.street} onChange={handleChange} placeholder="např. Městská 123" className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">Město</label>
          <input name="city" value={formData.city} onChange={handleChange} placeholder="např. Praha" className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">PSČ</label>
          <input name="zip" value={formData.zip} onChange={handleChange} placeholder="např. 123 45" className={inputClassName} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Kontakty a Banka */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">E-mail</label>
          <input name="email" value={formData.email} onChange={handleChange} placeholder="např. info@firma.cz" className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">Telefon</label>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="např. +420 123 456 789" className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">Webové stránky</label>
          <input name="website" value={formData.website} onChange={handleChange} placeholder="např. www.firma.cz" className={inputClassName} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#0D1B3E]">Bankovní účet (IBAN / Číslo)</label>
          <input name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="např. 123456789/0100" className={inputClassName} />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isLoading} className="px-6 py-3 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-70">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Uložit firemní údaje
        </button>
      </div>
    </form>
  )
}