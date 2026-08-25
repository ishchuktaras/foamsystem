// src/components/DispatchForm.tsx

'use client'

import { useState } from 'react'
import { UserCheck, Loader2 } from 'lucide-react'
import { updateDispatchAssignment } from '@/actions/dispatch'

// Přesná definice typů (aby si TypeScript nestěžoval)
interface Applicator {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

interface DispatchFormProps {
  quoteId: string;
  defaultDate: string;
  defaultUserId: string;
  applicators: Applicator[];
  isMobile: boolean;
}

export default function DispatchForm({ quoteId, defaultDate, defaultUserId, applicators, isMobile }: DispatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await updateDispatchAssignment(formData)
    
    setIsSubmitting(false)
    
    if (result?.error) {
      alert('CHYBA: ' + result.error)
    }
  }

  // --- MOBILNÍ ROZLOŽENÍ ---
  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="quoteId" value={quoteId} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Datum realizace</label>
          <input 
            type="date" 
            name="scheduledDate" 
            defaultValue={defaultDate}
            className="w-full bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF4F00] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hlavní aplikátor</label>
          <select 
            name="responsibleUserId"
            defaultValue={defaultUserId}
            className="w-full bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF4F00] transition-colors"
          >
            <option value="">-- Nepřiřazeno --</option>
            {applicators.map((user) => (
              <option key={user.id} value={user.id}>{user.name || user.email}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 bg-[#FF4F00] hover:bg-[#E64700] text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />} 
          {isSubmitting ? 'Ukládám...' : 'Uložit plán'}
        </button>
      </form>
    )
  }

  // --- DESKTOP ROZLOŽENÍ ---
  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-end gap-2">
      <input type="hidden" name="quoteId" value={quoteId} />
      
      <input 
        type="date" 
        name="scheduledDate" 
        defaultValue={defaultDate}
        className="bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF4F00] transition-colors"
      />

      <select 
        name="responsibleUserId"
        defaultValue={defaultUserId}
        className="bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF4F00] transition-colors max-w-[180px]"
      >
        <option value="">-- Nepřiřazeno --</option>
        {applicators.map((user) => (
          <option key={user.id} value={user.id}>{user.name || user.email}</option>
        ))}
      </select>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="bg-[#FF4F00] hover:bg-[#E64700] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />} 
        Uložit
      </button>
    </form>
  )
}