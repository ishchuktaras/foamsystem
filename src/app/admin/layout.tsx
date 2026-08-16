
// src/app/admin/layout.tsx

'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Mobilní horní lišta (zobrazená jen na malých obrazovkách) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000] text-white z-30 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          <span className="bg-white/10 p-1 rounded text-xs font-bold">N</span>
          <span className="font-extrabold text-lg">Foam<span className="text-[#FF4F00]">System</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
          aria-label="Otevřít menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar komponenta */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Hlavní obsahová část */}
      <main className="flex-1 pl-0 md:pl-64 pt-16 md:pt-0 flex flex-col min-h-screen">
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}