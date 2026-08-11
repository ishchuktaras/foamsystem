'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

export default function ProfileSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Zde později přidáme logiku pro uložení přes Server Action a NextAuth
    setTimeout(() => {
      setIsLoading(false)
      alert('Zatím jen ukázka designu! Pro reálné uložení napojíme NextAuth.')
    }, 1000)
  }

  // Společné třídy pro inputy, stejné jako u firemních údajů
  const inputClassName = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] placeholder-gray-400 bg-white"

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
      
      {/* Základní údaje */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0D1B3E]">Základní údaje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0D1B3E]">Jméno a příjmení</label>
            <input type="text" name="name" placeholder="Např. Taras Ishchuk" className={inputClassName} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0D1B3E]">Přihlašovací E-mail</label>
            <input type="email" name="email" placeholder="Např. taras@webnamiru.site" className={inputClassName} />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Změna hesla */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0D1B3E]">Změna hesla</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0D1B3E]">Nové heslo</label>
            <input type="password" name="newPassword" placeholder="••••••••" className={inputClassName} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#0D1B3E]">Potvrzení nového hesla</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" className={inputClassName} />
          </div>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Pokud heslo nechceš měnit, ponech tato pole prázdná.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isLoading} className="px-6 py-3 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-70">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Uložit změny v profilu
        </button>
      </div>
    </form>
  )
}