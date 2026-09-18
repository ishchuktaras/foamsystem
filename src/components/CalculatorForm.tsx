// src/components/CalculatorForm.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, FileDown, FileText, ClipboardSignature, Ruler, Maximize, Loader2, AlertTriangle, Layers, Droplets, Settings } from 'lucide-react'
import jsPDF from 'jspdf'
import { parseLambda } from '@/lib/calculations'

type Material = {
  id: string;
  name: string;
  type: string;
  density: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number | null;
  lambda?: string | null; 
}

type QuoteOption = {
  id: string;
  customerName: string;
  city: string | null;
  status: string;
}

export default function CalculatorForm({ 
  materials,
  existingQuotes = []
}: { 
  materials: Material[],
  existingQuotes?: QuoteOption[] 
}) {
  const router = useRouter()
  
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '')
  const [area, setArea] = useState<number | ''>(150)
  const [thickness, setThickness] = useState<number | ''>(25)
  const [lossPercent, setLossPercent] = useState<number>(10) // Dynamická ztráta 5-15%
  
  const [targetQuoteId, setTargetQuoteId] = useState<string>('new')
  
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingDOC, setIsExportingDOC] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId)

  // Hlavní výpočetní jádro
  const result = useMemo(() => {
    if (!selectedMaterial || !area || !thickness) return null

    const thicknessM = Number(thickness) / 100
    const yieldM2PerSet = selectedMaterial.yieldPerSetM3 / thicknessM
    const pureVolumeM3 = Number(area) * thicknessM
    const lossMultiplier = 1 + (lossPercent / 100)
    const totalVolumeM3 = pureVolumeM3 * lossMultiplier
    const wastedVolumeM3 = totalVolumeM3 - pureVolumeM3

    const exactSets = totalVolumeM3 / selectedMaterial.yieldPerSetM3
    const totalSets = Math.ceil(exactSets)
    const estimatedLifts = Math.round(exactSets * 4011) // Graco A25

    const buyPricePerSet = selectedMaterial.buyPricePerSet || 0
    const exactMaterialCost = exactSets * buyPricePerSet
    const totalCost = totalSets * buyPricePerSet
    
    const lambda = parseLambda(selectedMaterial.lambda)
    const thermalResistance = lambda ? Number((thicknessM / lambda).toFixed(2)) : null

    const totalMassKg = totalVolumeM3 * selectedMaterial.density
    const kgPerM2 = Number((totalMassKg / Number(area)).toFixed(2))
    const costPerM2 = Math.round(exactMaterialCost / Number(area))

    return {
      materialName: selectedMaterial.name,
      areaSqm: Number(area),
      thicknessCm: Number(thickness),
      thicknessM,
      yieldM2PerSet,
      pureVolumeM3: Number(pureVolumeM3.toFixed(2)),
      totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
      wastedVolumeM3: Number(wastedVolumeM3.toFixed(2)),
      totalMassKg: Math.round(totalMassKg),
      kgPerM2,
      exactSets: Number(exactSets.toFixed(2)),
      totalSets,
      estimatedLifts,
      exactMaterialCost: Math.round(exactMaterialCost),
      totalCost,
      costPerM2,
      thermalResistance,
      buyPricePerSet,
      density: selectedMaterial.density,
      yieldPerSetM3: selectedMaterial.yieldPerSetM3
    }
  }, [selectedMaterial, area, thickness, lossPercent])

  const handleExportPDF = async () => {
    if (!result) return
    setIsExportingPDF(true)
    
    try {
      const doc = new jsPDF()
      const today = new Date()
      const dateStr = today.toLocaleDateString('cs-CZ')
      
      const pricePerSet = result.buyPricePerSet
      const pricePerM3 = result.yieldPerSetM3 > 0 ? pricePerSet / result.yieldPerSetM3 : 0
      const totalWeightKg = result.yieldPerSetM3 * result.density
      const pricePerKg = totalWeightKg > 0 ? pricePerSet / totalWeightKg : 0

      const loadFont = async (url: string, name: string, style: string) => {
        try {
          const res = await fetch(url)
          if (!res.ok) return 
          const blob = await res.blob()
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve((reader.result as string).split(',')[1])
            reader.readAsDataURL(blob)
          })
          doc.addFileToVFS(`${name}-${style}.ttf`, base64)
          doc.addFont(`${name}-${style}.ttf`, name, style)
        } catch (e) {
          console.warn(`Font ${url} nelze načíst.`)
        }
      }

      await loadFont('/fonts/Roboto-Regular.ttf', 'Roboto', 'normal')
      await loadFont('/fonts/Roboto-Bold.ttf', 'Roboto', 'bold')
      doc.setFont('Roboto', 'normal')

      doc.setFontSize(22)
      doc.setTextColor(0, 0, 0) 
      doc.text('Kalkulace spotřeby materiálu', 20, 20)
      
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Vygenerováno systémem Izolace RS dne: ${dateStr}`, 20, 28)

      doc.setDrawColor(255, 135, 48)
      doc.setLineWidth(0.5)
      doc.line(20, 32, 190, 32)

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.setFont("Roboto", "bold")
      
      doc.text(`Materiál: ${result.materialName}`, 20, 42)
      doc.setFont("Roboto", "normal")
      doc.text(`Zadaná plocha: ${result.areaSqm} m²`, 20, 50)
      doc.text(`Požadovaná tloušťka: ${result.thicknessCm} cm`, 20, 58)
      doc.text(`Ztráta (přestřik): ${lossPercent} %`, 20, 66)
      
      doc.text(`Jednotková cena / m³: ${Math.round(pricePerM3).toLocaleString('cs-CZ')} Kč`, 20, 78)
      doc.text(`Jednotková cena / kg: ${Math.round(pricePerKg).toLocaleString('cs-CZ')} Kč`, 20, 86)

      doc.text(`Čistý objem: ${result.pureVolumeM3} m³`, 20, 100)
      doc.text(`Objem vč. ztrát: ${result.totalVolumeM3} m³ (Odpad: ${result.wastedVolumeM3} m³)`, 20, 108)
      doc.text(`Celková hmotnost materiálu: ${result.totalMassKg} kg`, 20, 116)
      
      if (result.thermalResistance) {
        doc.setTextColor(255, 135, 48) 
        doc.text(`Dosažený tepelný odpor (R): ${result.thermalResistance} m²K/W`, 20, 124)
        doc.setTextColor(0, 0, 0)
      }

      doc.setFillColor(0, 0, 0) 
      doc.rect(20, 134, 170, 30, 'F')
      
      doc.setFontSize(13)
      doc.setTextColor(255, 255, 255)
      doc.setFont("Roboto", "bold")
      doc.text(`Potřebný počet sad: ${result.totalSets} ks (Přesně: ${result.exactSets})`, 25, 144)
      doc.text(`Celkový náklad na materiál: ${result.totalCost.toLocaleString('cs-CZ')} Kč`, 25, 154)

      doc.save(`kalkulace-${result.materialName.replace(/\s+/g, '-').toLowerCase()}-${today.getTime()}.pdf`)
    } catch (error) {
      console.error("Chyba při generování PDF:", error)
      alert("Něco se pokazilo při generování PDF.")
    } finally {
      setIsExportingPDF(false)
    }
  }

  const handleExportDOC = () => {
    setIsExportingDOC(true)
    try {
      if (!result) return
      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Kalkulace spotřeby</title></head>
        <body style="font-family: Arial, sans-serif; color: #000; line-height: 1.6;">
          <h1 style="color: #FF8730; border-bottom: 2px solid #FF8730; padding-bottom: 10px;">Kalkulace spotřeby materiálu - Izolace RS</h1>
          <p><strong>Datum:</strong> ${new Date().toLocaleDateString('cs-CZ')}</p>
          <hr/>
          <h3>Zadané parametry:</h3>
          <ul>
            <li><strong>Materiál:</strong> ${result.materialName}</li>
            <li><strong>Plocha:</strong> ${result.areaSqm} m²</li>
            <li><strong>Tloušťka:</strong> ${result.thicknessCm} cm</li>
            <li><strong>Ztráta:</strong> ${lossPercent} %</li>
          </ul>
          <h3>Výsledek kalkulace:</h3>
          <ul>
            <li><strong>Čistý objem:</strong> ${result.pureVolumeM3} m³</li>
            <li><strong>Objem vč. ztrát:</strong> ${result.totalVolumeM3} m³</li>
            <li><strong>Celková hmotnost:</strong> ${result.totalMassKg} kg</li>
            <li><strong>Potřebné sady:</strong> ${result.totalSets} ks</li>
            <li><strong>Celkový náklad na nákup materiálu:</strong> ${result.totalCost.toLocaleString('cs-CZ')} Kč</li>
          </ul>
        </body>
        </html>
      `
      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kalkulace-${result.materialName.replace(/\s+/g, '-').toLowerCase()}.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Chyba při generování DOC.')
    } finally {
      setIsExportingDOC(false)
    }
  }

  const handleAttachToInquiry = () => {
    if (!result) return
    setIsRedirecting(true)
    const params = new URLSearchParams({
      materialId: selectedMaterialId,
      materialName: result.materialName,
      area: result.areaSqm.toString(),
      thickness: result.thicknessCm.toString(),
      cost: result.exactMaterialCost.toString(),
      sets: result.totalSets.toString()
    })

    if (targetQuoteId === 'new') {
      router.push(`/admin/quotes/new?${params.toString()}`)
    } else {
      router.push(`/admin/quotes/${targetQuoteId}/edit?${params.toString()}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      
      {/* LEVÝ SLOUPEC: Vstupní parametry */}
      <div className="lg:col-span-5 bg-[#FEFEFA] p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 space-y-6">
        <h2 className="text-xl font-black text-[#000000] flex items-center gap-2 border-b border-zinc-100 pb-4">
          <Settings className="text-[#FF8730]" /> Parametry výpočtu
        </h2>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-zinc-500 uppercase">Materiál</label>
          <select 
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none bg-zinc-50 font-medium text-black"
          >
            {materials.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.yieldPerSetM3} m³ / sada)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase">Plocha (m²)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Maximize size={16} />
              </div>
              <input 
                type="number" min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                className="w-full pl-9 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] font-bold text-black outline-none bg-zinc-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase">Tloušťka (cm)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Ruler size={16} />
              </div>
              <input 
                type="number" min="1" step="1" value={thickness} onChange={(e) => setThickness(e.target.value ? Number(e.target.value) : '')}
                className="w-full pl-9 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] font-bold text-black outline-none bg-zinc-50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-zinc-500 uppercase">Předpokládaný přestřik / ztráta</label>
            <span className="font-black text-[#FF8730] text-lg">{lossPercent} %</span>
          </div>
          <input 
            type="range" min="5" max="15" step="1" value={lossPercent}
            onChange={(e) => setLossPercent(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF8730]"
          />
          <div className="flex justify-between text-xs text-zinc-400 font-medium">
            <span>5 % (Ideální)</span>
            <span>15 % (Ztížené)</span>
          </div>
        </div>
      </div>

      {/* PRAVÝ SLOUPEC: Výsledky výpočtu a Akce */}
      <div className="lg:col-span-7 space-y-4">
        
        {result ? (
          <div className="space-y-4">
            
            {/* Box 1: Technická vydatnost */}
            <div className="bg-[#000000] text-white p-6 rounded-2xl shadow-md border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">Vydatnost 1 sady ({thickness} cm)</p>
                <div className="text-3xl font-black">{Math.round(result.yieldM2PerSet)} <span className="text-xl text-[#FF8730]">m²</span></div>
                <p className="text-zinc-500 text-xs mt-1">Výpočet: {selectedMaterial?.yieldPerSetM3} m³ / {result.thicknessM} m</p>
              </div>
              <Layers size={40} className="text-zinc-800" />
            </div>

            {/* Box 2: Spotřeba a Ztráty */}
            <div className="bg-[#FEFEFA] p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="font-bold text-[#000000] border-b border-zinc-100 pb-3 mb-4 flex items-center gap-2">
                <Droplets className="text-[#FF8730]" size={18} /> Celková spotřeba materiálu
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Čistý objem</p>
                  <p className="text-2xl font-black text-[#000000]">{result.pureVolumeM3} <span className="text-base font-bold">m³</span></p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                    S přestřikem <AlertTriangle size={12} className="text-[#FF8730]" />
                  </p>
                  <p className="text-2xl font-black text-[#000000]">{result.totalVolumeM3} <span className="text-base font-bold">m³</span></p>
                  <p className="text-xs text-red-500 font-medium mt-1">+{result.wastedVolumeM3} m³ odpad</p>
                </div>
              </div>
            </div>

            {/* Box 3: Logistika a Predikce stroje */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FF8730]/10 p-6 rounded-2xl border border-[#FF8730]/20">
                <p className="text-[#FF8730] text-xs font-bold uppercase mb-2">Potřebné sady k naložení</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#000000]">{result.totalSets}</span>
                  <span className="text-zinc-600 font-medium">ks</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Přesně: {result.exactSets} sad</p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Predikce Graco A25</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#000000]">{result.estimatedLifts.toLocaleString('cs-CZ')}</span>
                  <span className="text-zinc-600 font-medium">zdvihů</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Při {lossPercent}% ztrátě a tloušťce {thickness} cm</p>
              </div>
            </div>

            {/* AKCE A EXPORTY */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 mt-4">
              <h4 className="text-[#000000] font-extrabold mb-4 text-sm uppercase tracking-wide">Obchodní zpracování</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <button onClick={handleExportPDF} disabled={isExportingPDF} className="flex flex-col border border-zinc-200 rounded-xl p-4 hover:border-[#FF8730] transition-all group text-left cursor-pointer items-center text-center">
                  {isExportingPDF ? <Loader2 size={24} className="animate-spin text-[#FF8730] mb-2" /> : <FileDown size={24} className="text-[#FF8730] mb-2" />} 
                  <span className="font-bold text-sm text-[#000000] group-hover:text-[#FF8730]">Uložit PDF</span>
                </button>

                <button onClick={handleExportDOC} disabled={isExportingDOC} className="flex flex-col border border-zinc-200 rounded-xl p-4 hover:border-[#FF8730] transition-all group text-left cursor-pointer items-center text-center">
                  {isExportingDOC ? <Loader2 size={24} className="animate-spin text-[#FF8730] mb-2" /> : <FileText size={24} className="text-[#FF8730] mb-2" />} 
                  <span className="font-bold text-sm text-[#000000] group-hover:text-[#FF8730]">Uložit DOC</span>
                </button>

                {/* Vložení do nabídky */}
                <div className="flex flex-col border border-[#FF8730]/30 bg-[#FF8730]/5 rounded-xl p-4 transition-all">
                  <div className="flex items-center justify-center gap-2 font-bold text-[#000000] mb-3 text-sm">
                    <ClipboardSignature size={18} className="text-[#FF8730]" /> Vložit do nabídky
                  </div>
                  
                  <select 
                    value={targetQuoteId}
                    onChange={e => setTargetQuoteId(e.target.value)}
                    className="w-full p-2 mb-2 bg-white border border-[#FF8730]/20 rounded-lg text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#FF8730]"
                  >
                    <option value="new">➕ Nová nabídka</option>
                    {existingQuotes.map(q => (
                      <option key={q.id} value={q.id} className="truncate">
                        📁 {q.customerName}
                      </option>
                    ))}
                  </select>

                  <button 
                    onClick={handleAttachToInquiry} 
                    disabled={isRedirecting}
                    className="w-full py-2 bg-[#FF8730] hover:bg-[#E67020] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-auto"
                  >
                    {isRedirecting ? <Loader2 size={14} className="animate-spin" /> : 'Pokračovat'}
                  </button>
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="h-full bg-[#FEFEFA] border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 text-zinc-400 min-h-[400px]">
            <Calculator size={48} className="mb-4 opacity-50" />
            <p className="font-medium text-sm text-center">Vyplňte parametry zakázky vlevo<br/>pro okamžitý výpočet spotřeby.</p>
          </div>
        )}

      </div>
    </div>
  )
}