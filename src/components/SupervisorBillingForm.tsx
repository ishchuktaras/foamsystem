// src/components/SupervisorBillingForm.tsx
'use client'

import { useState } from 'react'
import { saveBillingData } from '@/actions/evidence'
import { Calculator, Save, AlertTriangle } from 'lucide-react'

// Přesná definice dat z databáze místo "any"
interface EvidenceData {
  id: string
  machineCoefficient?: number | null
  pricePerKg?: number | null
  packingPriceRate?: number | null
  heightsSurcharge?: number | null
  difficultEnvSurcharge?: number | null
  reactorStart: number
  reactorEnd: number
  packingHours: number
  workingAtHeights: boolean
  difficultEnv?: string | null
  finalInvoiceTotal?: number | null
}

interface QuoteData {
  area: string
  thickness: string
}

export default function SupervisorBillingForm({ 
  evidence, 
  quote 
}: { 
  evidence: EvidenceData
  quote: QuoteData 
}) {
  // Inicializace stavů
  const [machineCoefficient, setMachineCoefficient] = useState(evidence.machineCoefficient || 0.1119)
  const [pricePerKg, setPricePerKg] = useState(evidence.pricePerKg || 0)
  const [packingPriceRate, setPackingPriceRate] = useState(evidence.packingPriceRate || 0)
  const [heightsSurcharge, setHeightsSurcharge] = useState(evidence.heightsSurcharge || 0)
  const [difficultEnvSurcharge, setDifficultEnvSurcharge] = useState(evidence.difficultEnvSurcharge || 0)
  
  const [isSaving, setIsSaving] = useState(false)

  // Automatické výpočty
  const totalLifts = evidence.reactorEnd - evidence.reactorStart
  const totalKg = totalLifts * machineCoefficient
  const materialPrice = totalKg * pricePerKg
  const packingPrice = (evidence.packingHours || 0) * packingPriceRate
  
  // Realita vs. Očekávání (ztráta)
  const area = parseFloat(quote.area) || 0
  const thicknessMeters = (parseFloat(quote.thickness) || 0) / 100 // cm na metry
  const volumeM3 = area * thicknessMeters
  const realDensity = volumeM3 > 0 ? (totalKg / volumeM3) : 0
  const expectedDensity = 10 // Tabulková hustota měkké pěny (kg/m3)
  const materialLossPercent = expectedDensity > 0 ? ((realDensity - expectedDensity) / expectedDensity) * 100 : 0

  const finalTotal = materialPrice + packingPrice + heightsSurcharge + difficultEnvSurcharge

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveBillingData(evidence.id, {
      pricePerKg,
      machineCoefficient,
      packingPriceRate,
      heightsSurcharge,
      difficultEnvSurcharge,
      finalInvoiceTotal: finalTotal
    })
    setIsSaving(false)
    if (!result.success) alert(result.error)
    else alert('Vyúčtování úspěšně uloženo.')
  }

  return (
    // ZMĚNA ODSAZENÍ ZDE: p-3 na mobilech, sm:p-6 na tabletech
    <div className="mt-6 pt-6 border-t border-zinc-200 bg-zinc-50 rounded-xl p-3 sm:p-6 md:p-6">
      <h4 className="text-lg font-black text-[#000000] mb-4 flex items-center gap-2">
        <Calculator className="text-[#FF4F00]" /> Vyúčtování (Supervizor)
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* LEVÝ SLOUPEC - Vstupy */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Koeficient stroje (kg/zdvih)</label>
            <input type="number" step="0.0001" value={machineCoefficient} onChange={(e) => setMachineCoefficient(Number(e.target.value))} className="w-full p-2 border border-zinc-300 rounded-lg mt-1 font-bold outline-none focus:ring-2 focus:ring-[#FF4F00]" />
            <p className="text-xs text-zinc-400 mt-1">Stroj udělal {totalLifts} zdvihů = {totalKg.toFixed(1)} kg.</p>
          </div>
          
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Cena za 1 kg materiálu (Kč)</label>
            <input type="number" value={pricePerKg} onChange={(e) => setPricePerKg(Number(e.target.value))} className="w-full p-2 border border-zinc-300 rounded-lg mt-1 font-bold outline-none focus:ring-2 focus:ring-[#FF4F00]" />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Sazba za balení (Kč/h)</label>
            <input type="number" value={packingPriceRate} onChange={(e) => setPackingPriceRate(Number(e.target.value))} className="w-full p-2 border border-zinc-300 rounded-lg mt-1 font-bold outline-none focus:ring-2 focus:ring-[#FF4F00]" />
            <p className="text-xs text-zinc-400 mt-1">Balení {evidence.packingHours || 0} h.</p>
          </div>

          {evidence.workingAtHeights && (
            <div>
              <label className="text-xs font-bold text-red-500 uppercase">Příplatek - Výšky (Kč)</label>
              <input type="number" value={heightsSurcharge} onChange={(e) => setHeightsSurcharge(Number(e.target.value))} className="w-full p-2 border border-red-300 rounded-lg mt-1 font-bold bg-red-50 outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          )}

          {evidence.difficultEnv && (
            <div>
              <label className="text-xs font-bold text-amber-500 uppercase">Příplatek - Ztížené prostř. (Kč)</label>
              <input type="number" value={difficultEnvSurcharge} onChange={(e) => setDifficultEnvSurcharge(Number(e.target.value))} className="w-full p-2 border border-amber-300 rounded-lg mt-1 font-bold bg-amber-50 outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          )}
        </div>

        {/* PRAVÝ SLOUPEC - Výsledky */}
        <div className="bg-[#000000] text-[#FEFEFA] p-4 sm:p-6 rounded-xl shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2 text-xs sm:text-sm">
              <span className="text-zinc-400">Materiál ({totalKg.toFixed(1)} kg)</span>
              <span className="font-bold">{materialPrice.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2 text-xs sm:text-sm">
              <span className="text-zinc-400">Balení a příprava</span>
              <span className="font-bold">{packingPrice.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2 mb-4 text-xs sm:text-sm">
              <span className="text-zinc-400">Příplatky (Výšky, Prostředí)</span>
              <span className="font-bold">{(heightsSurcharge + difficultEnvSurcharge).toLocaleString('cs-CZ')} Kč</span>
            </div>

            <div className="bg-zinc-900 p-3 sm:p-4 rounded-lg border border-zinc-800 mb-6">
              <div className="text-[10px] sm:text-xs text-zinc-500 uppercase font-bold mb-1">Technologická analýza</div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Skutečná hustota:</span>
                <strong className="text-[#FF4F00]">{realDensity.toFixed(2)} kg/m³</strong>
              </div>
              <div className="flex justify-between text-xs sm:text-sm mt-1">
                <span>Ztráta / Prořez:</span>
                <strong className={materialLossPercent > 15 ? 'text-red-500' : 'text-green-500'}>
                  {materialLossPercent > 0 ? '+' : ''}{materialLossPercent.toFixed(1)} %
                </strong>
              </div>
              {materialLossPercent > 20 && (
                <div className="text-[10px] sm:text-xs text-red-400 mt-2 flex items-start gap-1 leading-tight">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                  Pozor: Ztráta je nestandardně vysoká.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs sm:text-sm text-zinc-400 uppercase font-bold">Celkem k fakturaci</div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF4F00] mb-4 truncate">
              {finalTotal.toLocaleString('cs-CZ')} Kč
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 bg-[#FEFEFA] text-[#000000] hover:bg-zinc-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <Save size={16} />
              <span className="truncate">{isSaving ? 'Ukládám...' : (evidence.finalInvoiceTotal ? 'Aktualizovat' : 'Uložit a uzamknout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}