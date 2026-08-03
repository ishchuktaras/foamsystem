// src/app/admin/quotes/page.tsx

import Link from 'next/link'
import { PlusCircle, FileText } from 'lucide-react'

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Nabídky a poptávky</h1>
          <p className="text-gray-600 mt-1">
            Správa klientských poptávek a cenových nabídek pro izolační pěny.
          </p>
        </div>
        
        {/* Tlačítko směřující na náš nový formulář s ARES integrací */}
        <Link
          href="/admin/inquiries/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors shrink-0"
        >
          <PlusCircle size={20} />
          Nová poptávka
        </Link>
      </div>

      {/* Prázdný stav tabulky (zatím nemáme data z databáze) */}
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4 mt-8">
        <div className="flex justify-center text-gray-300 mb-2">
          <FileText size={64} />
        </div>
        <h3 className="text-xl font-semibold text-[#0D1B3E]">Zatím tu nejsou žádné záznamy</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Klikněte na tlačítko &quot;Nová poptávka&quot;, vyzkoušejte si automatické načítání firem z ARES a uložte první zakázku.
        </p>
      </div>
    </div>
  )
}