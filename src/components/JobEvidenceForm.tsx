// src/components/JobEvidenceForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveJobEvidence } from '@/actions/evidence'
import { Loader2, Thermometer, Cog, Package, Mountain, Wind } from 'lucide-react'

export default function JobEvidenceForm({ quoteId }: { quoteId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDifficult, setIsDifficult] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
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
    <form onSubmit={handleSubmit} className="bg-[#FEFEFA] p-8 rounded-2xl shadow-sm border border-zinc-200 space-y-8">
      
      {/* 1. Klimatické podmínky */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6">
        <h3 className="col-span-full font-bold flex items-center gap-2"><Thermometer className="text-[#FF4F00]" /> Klimatické podmínky</h3>
        <input name="ambientTemp" type="number" step="0.1" placeholder="Venkovní teplota (°C)" required className="p-3 border rounded-xl" />
        <input name="internalTemp" type="number" step="0.1" placeholder="Vnitřní teplota (°C)" required className="p-3 border rounded-xl" />
        <input name="surfaceTemp" type="number" step="0.1" placeholder="Teplota povrchu (°C)" required className="p-3 border rounded-xl" />
        <select name="surfaceType" className="col-span-full p-3 border rounded-xl" required>
          <option value="plech">Plech</option>
          <option value="drevo">Dřevo</option>
          <option value="folie">Fólie</option>
          <option value="parozabrana">Parotěsná fólie</option>
          <option value="beton">Beton</option>
          <option value="cihla">Cihla</option>
          <option value="kamen">Kámen</option>
        </select>
      </div>

      {/* 2. Reaktory a balení */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
        <h3 className="col-span-full font-bold flex items-center gap-2"><Cog className="text-[#FF4F00]" /> Reaktory a balení</h3>
        <input name="reactorStart" type="number" placeholder="Počáteční stav zdvihů" required className="p-3 border rounded-xl" />
        <input name="reactorEnd" type="number" placeholder="Konečný stav zdvihů" required className="p-3 border rounded-xl" />
        <input name="foilRolls" type="number" placeholder="Počet rolí balicí fólie" required className="p-3 border rounded-xl" />
        <input name="packingHours" type="number" step="0.1" placeholder="Hodiny balení" required className="p-3 border rounded-xl" />
      </div>

      {/* 3. Ztížené prostředí a podmínky */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer font-bold">
          <input type="checkbox" onChange={(e) => setIsDifficult(e.target.checked)} className="accent-[#FF4F00]" /> 
          Ztížené prostředí
        </label>
        {isDifficult && <textarea name="difficultEnv" placeholder="Popis prostředí..." className="w-full p-3 border rounded-xl" />}
        
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="workingAtHeights" className="accent-[#FF4F00]" /> <Mountain size={16} /> Práce ve výškách</label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ventilationUsed" className="accent-[#FF4F00]" /> <Wind size={16} /> Odvětrávací stroje</label>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#000000] text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors">
        {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Dokončit stavbu a uložit evidenci"}
      </button>
    </form>
  )
}