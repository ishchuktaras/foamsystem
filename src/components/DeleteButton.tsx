// src/components/DeleteButton.tsx

'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { useFormStatus } from 'react-dom'

interface DeleteButtonProps {
  isDesktop?: boolean;
}

export default function DeleteButton({ isDesktop = false }: DeleteButtonProps) {
  // useFormStatus zjišťuje, jestli serverová akce ve formuláři zrovna probíhá
  const { pending } = useFormStatus()
  
  // Stav pro zobrazení/skrytí našeho vlastního varovacího okna
  const [isOpen, setIsOpen] = useState(false)

  const mobileClass = "w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-red-100 disabled:opacity-50"
  const desktopClass = "px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-md text-sm transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"

  return (
    <>
      {/* 
        Tlačítko, které otevírá okno. 
        DŮLEŽITÉ: Má type="button", aby rovnou neodeslalo formulář! 
      */}
      <button 
        type="button"
        disabled={pending}
        onClick={() => setIsOpen(true)}
        className={isDesktop ? desktopClass : mobileClass}
      >
        {pending ? <Loader2 size={isDesktop ? 14 : 16} className="animate-spin" /> : <Trash2 size={isDesktop ? 14 : 16} />}
        {pending ? 'Mažu...' : 'Smazat'}
      </button>

      {/* VLASTNÍ VAROVACÍ OKNO (MODAL) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-[#FEFEFA] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200">
            
            {/* Hlavička okna */}
            <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center border-b border-red-100">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-red-200">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-[#000000]">Trvalé smazání záznamu</h3>
            </div>
            
            {/* Tělo okna s textem */}
            <div className="p-6 text-center text-zinc-600">
              <p className="text-base">Opravdu chcete tento záznam <strong>trvale smazat</strong>?</p>
              <p className="mt-2 text-sm">Tuto akci již nebude možné vrátit zpět a veškerá související data budou smazána.</p>
            </div>

            {/* Tlačítka dole */}
            <div className="p-6 pt-0 flex gap-3">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={pending}
                className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Zrušit
              </button>
              
              {/* 
                Tlačítko, které SKUTEČNĚ ODEŠLE formulář k vymazání.
                Má type="submit".
              */}
              <button 
                type="submit"
                disabled={pending}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {pending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                Smazat navždy
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}