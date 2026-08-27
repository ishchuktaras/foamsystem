// src/components/DeleteButton.tsx

'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

interface DeleteButtonProps {
  isDesktop?: boolean;
}

export default function DeleteButton({ isDesktop = false }: DeleteButtonProps) {
  // useFormStatus zjišťuje, jestli serverová akce ve formuláři zrovna probíhá
  const { pending } = useFormStatus()

  const mobileClass = "w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-red-100 disabled:opacity-50"
  const desktopClass = "px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-md text-sm transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"

  return (
    <button 
      type="submit"
      disabled={pending}
      onClick={(e) => {
        // Pokud uživatel NEPOTVRDÍ smazání, zastavíme odeslání formuláře
        if (!confirm('⚠️ Opravdu chcete tento záznam TRVALE SMAZAT?\n\nTuto akci již nebude možné vrátit zpět.')) {
          e.preventDefault()
        }
      }}
      className={isDesktop ? desktopClass : mobileClass}
    >
      {pending ? <Loader2 size={isDesktop ? 14 : 16} className="animate-spin" /> : <Trash2 size={isDesktop ? 14 : 16} />}
      {pending ? 'Mažu...' : 'Smazat'}
    </button>
  )
}