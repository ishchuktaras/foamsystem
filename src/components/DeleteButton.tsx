// src/components/DeleteButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'

interface DeleteButtonProps {
  isDesktop?: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  confirmText?: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
}

export default function DeleteButton({ 
  isDesktop = false,
  title = "Trvalé smazání záznamu",
  message = "Opravdu chcete tento záznam trvale smazat? Tuto akci již nebude možné vrátit zpět.",
  buttonText = "Smazat",
  confirmText = "Smazat navždy",
  onDelete
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Funkce, která přímo zavolá serverovou akci a odchytí výsledek
  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await onDelete()
        if (result && !result.success) {
          alert(result.error || "Došlo k chybě při mazání záznamu. (Možná k nabídce existuje připojená evidence)")
        } else {
          setIsOpen(false)
        }
      } catch (e) {
        alert("Neočekávaná chyba při komunikaci se serverem.")
      }
    })
  }

  const mobileClass = "w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-red-100 disabled:opacity-50"
  const desktopClass = "px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-md text-sm transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"

  return (
    <>
      <button 
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen(true)}
        className={isDesktop ? desktopClass : mobileClass}
      >
        {isPending ? <Loader2 size={isDesktop ? 14 : 16} className="animate-spin" /> : <Trash2 size={isDesktop ? 14 : 16} />}
        {isPending ? 'Pracuji...' : buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 whitespace-normal">
          <div className="bg-[#FEFEFA] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200">
            
            <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center border-b border-red-100">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-red-200 shrink-0">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-[#000000]">{title}</h3>
            </div>
            
            <div className="p-6 text-center text-zinc-600">
              <p className="text-base">{message}</p>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Zrušit
              </button>
              
              {/* TLAČÍTKO UŽ NENÍ TYPE="SUBMIT", VOLÁ AKCI PŘÍMO PŘES ONCLICK */}
              <button 
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                {confirmText}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}