// src/components/QuoteForm.tsx

'use client'

import { useState } from 'react'
import { Building2, MapPin, Search, Save, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createQuote } from '@/actions/quote'

interface QuoteFormProps {
  calculatedData?: {
    materialName: string
    area: string
    thickness: string
    cost: string
  }
}

export default function QuoteForm({ calculatedData }: QuoteFormProps) {
  const router = useRouter()
  
  // Stavy formuláře
  const [ico, setIco] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  
  // Stavy pro načítání a odesílání
  const [isFetchingAres, setIsFetchingAres] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aresError, setAresError] = useState('')

  // Funkce pro stažení dat z veřejného rejstříku ARES
  const fetchAresData = async () => {
    if (!ico || ico.length < 6) {
      setAresError('Zadejte platné IČO (minimálně 6 číslic).')
      return
    }

    setIsFetchingAres(true)
    setAresError('')

    try {
      const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`)
      
      if (!response.ok) {
        throw new Error('Subjekt nenalezen. Zkontrolujte IČO.')
      }

      const data = await response.json()
      
      setCustomerName(data.obchodniJmeno || '')
      
      if (data.sidlo) {
        const adresa = []
        if (data.sidlo.nazevUlice) adresa.push(data.sidlo.nazevUlice)
        if (data.sidlo.cisloDomovni) {
           adresa.push(data.sidlo.cisloOrientacni ? `${data.sidlo.cisloDomovni}/${data.sidlo.cisloOrientacni}` : data.sidlo.cisloDomovni)
        }
        setStreet(adresa.join(' ') || data.sidlo.nazevObce || '')
        setCity(data.sidlo.nazevObce || '')
        setZip(data.sidlo.psc ? data.sidlo.psc.toString() : '')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAresError(error.message)
      } else {
        setAresError('Nepodařilo se spojit s rejstříkem ARES.')
      }
    } finally {
      setIsFetchingAres(false)
    }
  }

  // Odeslání formuláře a uložení do databáze přes Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = {
      customerName,
      ico,
      street,
      city,
      zip,
      materialName: calculatedData?.materialName || 'Nespecifikovaný materiál',
      area: calculatedData?.area || '0',
      thickness: calculatedData?.thickness || '0',
      totalCost: calculatedData?.cost || '0'
    }

    const result = await createQuote(formData)

    if (result.success) {
      router.push('/admin/quotes')
      router.refresh()
    } else {
      alert(result.error || 'Něco se pokazilo při ukládání.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in duration-500">
      
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#0D1B3E] border-b border-gray-100 pb-2">Údaje o zákazníkovi</h3>
        
        {/* ARES Vyhledávání */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">IČO (pro firemní zákazníky)</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={ico}
              onChange={(e) => setIco(e.target.value.replace(/\D/g, ''))}
              placeholder="Např. 00006947" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none text-[#0D1B3E] bg-gray-50/50 transition-colors font-medium"
            />
            <button 
              type="button"
              onClick={fetchAresData}
              disabled={isFetchingAres}
              className="px-6 py-3 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {isFetchingAres ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Načíst z ARES
            </button>
          </div>
          {aresError && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {aresError}
            </p>
          )}
        </div>

        {/* Klasická pole adresy */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Název firmy / Jméno a příjmení</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Building2 size={18} />
            </div>
            <input 
              type="text" 
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Ulice a č.p.</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <MapPin size={18} />
              </div>
              <input 
                type="text" 
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Město</label>
            <input 
              type="text" 
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>

          <div className="md:col-span-1 space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">PSČ</label>
            <input 
              type="text" 
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
        >
          Zrušit
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSubmitting ? 'Ukládám...' : 'Uložit nabídku'}
        </button>
      </div>

    </form>
  )
}