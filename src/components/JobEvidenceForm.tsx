// src/components/JobEvidenceForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveJobEvidence, type JobEvidenceInput } from '@/actions/evidence'
import { Loader2, Thermometer, Cog, Package, Mountain, Wind, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function JobEvidenceForm({ quoteId }: { quoteId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDifficult, setIsDifficult] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = Object.fromEntries(formData.entries()) as unknown as JobEvidenceInput
    
    const result = await saveJobEvidence(quoteId, data)
    if (result.success) {
      router.push('/admin/quotes')
      router.refresh()
    } else {
      alert(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    // ZMĚNA ODSAZENÍ ZDE: p-3 na mobilech, sm:p-5 na tabletech, md:p-8 na PC
    <form onSubmit={handleSubmit} className="bg-[#FEFEFA] p-3 sm:p-5 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200 space-y-8 md:space-y-10">
      
      {/* Sekce 1: Klimatické podmínky */}
      <div className="space-y-5 md:space-y-6">
        <h3 className="text-base md:text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2 flex items-center gap-2">
          <Thermometer className="text-[#FF4F00]" size={20} />
          Klimatické podmínky a povrch
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Venkovní teplota (°C)</label>
            <input name="ambientTemp" type="number" step="0.1" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50/50" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Vnitřní teplota (°C)</label>
            <input name="internalTemp" type="number" step="0.1" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50/50" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Teplota povrchu (°C)</label>
            <input name="surfaceTemp" type="number" step="0.1" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50/50" />
          </div>
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Typ povrchu</label>
            <select name="surfaceType" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-medium bg-zinc-50/50">
              <option value="">Vyberte povrch...</option>
              <option value="plech">Plech</option>
              <option value="drevo">Dřevo</option>
              <option value="folie">Fólie</option>
              <option value="parozabrana">Parotěsná fólie</option>
              <option value="beton">Beton</option>
              <option value="cihla">Cihla</option>
              <option value="kamen">Kámen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sekce 2: Technologické nastavení a balení */}
      <div className="space-y-5 md:space-y-6">
        <h3 className="text-base md:text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2 flex items-center gap-2">
          <Cog className="text-[#FF4F00]" size={20} />
          Zdvihy reaktoru a spotřeba
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Počáteční zdvihy</label>
            <input name="reactorStart" type="number" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-bold bg-zinc-50/50" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Konečné zdvihy</label>
            <input name="reactorEnd" type="number" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] font-bold bg-zinc-50/50" />
          </div>
        </div>

        <h3 className="text-base md:text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2 pt-2 md:pt-4 flex items-center gap-2">
          <Package className="text-[#FF4F00]" size={20} />
          Příprava místnosti (Balení)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Role fólie (ks)</label>
            <input name="foilRolls" type="number" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50/50" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Hodiny balení (h)</label>
            <input name="packingHours" type="number" step="0.5" required className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] bg-zinc-50/50" />
          </div>
        </div>
      </div>

      {/* Sekce 3: Provozní náročnost */}
      <div className="space-y-5 md:space-y-6">
        <h3 className="text-base md:text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2 flex items-center gap-2">
          <AlertTriangle className="text-[#FF4F00]" size={20} />
          Provozní náročnost
        </h3>
        
        <div className="space-y-3 md:space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 md:p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
            <input type="checkbox" onChange={(e) => setIsDifficult(e.target.checked)} className="w-5 h-5 accent-[#FF4F00] shrink-0" /> 
            <span className="font-bold text-sm md:text-base text-[#000000]">Stavba ve ztíženém prostředí</span>
          </label>
          
          {isDifficult && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <textarea 
                name="difficultEnv" 
                placeholder="Popište přesně ztížené podmínky..." 
                className="w-full p-3 md:p-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none text-[#000000] min-h-25 text-sm bg-zinc-50/50" 
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 md:p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <input type="checkbox" name="workingAtHeights" className="w-5 h-5 accent-[#FF4F00] shrink-0" /> 
              <Mountain size={18} className="text-zinc-500 shrink-0" />
              <span className="font-bold text-sm text-[#000000]">Práce ve výškách</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 md:p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <input type="checkbox" name="ventilationUsed" className="w-5 h-5 accent-[#FF4F00] shrink-0" /> 
              <Wind size={18} className="text-zinc-500 shrink-0" />
              <span className="font-bold text-sm text-[#000000]">Použity stroje</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 md:pt-6 border-t border-zinc-200">
        <button type="submit" disabled={isSubmitting} className="w-full py-3.5 md:py-4 bg-[#000000] hover:bg-zinc-800 text-[#FEFEFA] font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 hover:scale-[1.01] cursor-pointer text-sm md:text-base">
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} className="text-[#FF4F00]" />}
          {isSubmitting ? "Ukládám..." : "Označit za dokončené"}
        </button>
      </div>
      
    </form>
  )
}