// src/app/admin/quotes/page.tsx

import Link from 'next/link'
import { FileText, TrendingUp, PlusCircle } from 'lucide-react'

export default function QuotesPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Nabídky a poptávky
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Kompletní evidence klientských zakázek. Tvořte cenové nabídky, sledujte stav rozpracovaných projektů a automaticky stahujte firemní údaje pomocí integrace ARES.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <FileText size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <TrendingUp size={150} />
        </div>
      </div>

      {/* Akční panel s tlačítkem */}
      <div className="flex justify-end">
         {/* OPRAVA: Změněn odkaz na správnou adresu /admin/quotes/new */}
         <Link 
            href="/admin/quotes/new" 
            className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
         >
            <PlusCircle size={20} />
            Nová poptávka
         </Link>
      </div>

      {/* Prázdný stav tabulky */}
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4 mt-8 max-w-4xl mx-auto">
        <div className="flex justify-center text-gray-300 mb-2">
          <FileText size={64} />
        </div>
        <h3 className="text-xl font-bold text-[#0D1B3E]">Zatím tu nejsou žádné záznamy</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Klikněte na tlačítko &quot;Nová poptávka&quot;, vyzkoušejte si automatické načítání firem z ARES a uložte první zakázku.
        </p>
      </div>
      
    </div>
  )
}