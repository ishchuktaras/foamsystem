// src/app/page.tsx

import Link from 'next/link'
import { Boxes, ShieldCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D1B3E]">
            Foam<span className="text-[#3B82F6]">System</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Interní systém pro výpočty izolačních pěn, správu materiálů a ověřování firem.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/admin/materials"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-colors"
          >
            <Boxes size={20} />
            Správa materiálů
          </Link>
          <Link
            href="/admin/ares-test"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#0D1B3E] font-medium rounded-xl transition-colors"
          >
            <ShieldCheck size={20} />
            Test ARES API
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Optimalizováno pro rychlou práci v terénu i kanceláři.
        </p>
      </div>
    </main>
  )
}