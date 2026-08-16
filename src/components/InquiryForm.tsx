'use client'

import { useState, useTransition } from 'react'
import { fetchCompanyByIco } from '@/actions/ares'
import { Building2, Search, Loader2, Send } from 'lucide-react'

export default function InquiryForm() {
  const [ico, setIco] = useState('')
  const [name, setName] = useState('')
  const [dic, setDic] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [note, setNote] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAresLookup = () => {
    setError(null)
    setSuccessMessage(null)

    startTransition(async () => {
      const result = await fetchCompanyByIco(ico)
      if (!result.success) {
        setError(result.error || 'Chyba při načítání z ARES')
      } else if (result.data) {
        setName(result.data.name)
        setDic(result.data.dic || '')
        setStreet(result.data.street)
        setCity(result.data.city)
        setZip(result.data.zip)
        setSuccessMessage('Údaje byly úspěšně načteny z registru ARES.')
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Poptávka je připravena k uložení do databáze!')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#000000] flex items-center gap-2.5">
          <Building2 className="text-[#FF4F00]" size={26} />
          Nová poptávka / Zákazník
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Zadejte IČO firmy pro automatické vyplnění fakturačních údajů z ARES.
        </p>
      </div>

      {/* IČO + ARES Tlačítko */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#000000]">IČO (nepovinné pro fyzické osoby)</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={ico}
            onChange={(e) => setIco(e.target.value)}
            placeholder="např. 23874694"
            maxLength={8}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-white"
          />
          <button
            type="button"
            onClick={handleAresLookup}
            disabled={isPending || !ico.trim()}
            className="px-5 py-3 bg-[#FF4F00] hover:bg-[#E64700] text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Načítám...
              </>
            ) : (
              <>
                <Search size={18} />
                Načíst z ARES
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* Firemní a kontaktní údaje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-semibold text-[#000000]">Název firmy / Jméno</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="např. Firma s.r.o."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-gray-900 bg-white"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#000000]">DIČ (nepovinné)</label>
          <input
            type="text"
            value={dic}
            onChange={(e) => setDic(e.target.value)}
            placeholder="např. CZ12345678"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#000000]">PSČ</label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="586 01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-gray-900 bg-white"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-semibold text-[#000000]">Ulice a číslo popisné</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Rantířovská 123/36"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-gray-900 bg-white"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-semibold text-[#000000]">Město</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Jihlava"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* Poznámka */}
      <div className="space-y-1.5 pt-2">
        <label className="block text-sm font-semibold text-[#000000]">Poznámka k poptávce</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Zadejte detaily izolace, plochu, specifikaci materiálu..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4F00] outline-none text-gray-900 bg-white"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#000000] hover:bg-zinc-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
      >
        <Send size={18} />
        Uložit poptávku
      </button>
    </form>
  )
}