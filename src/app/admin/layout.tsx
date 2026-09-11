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
  // 1. Nový stav pro sbalení sidebaru
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Mobilní horní lišta (zobrazená jen na malých obrazovkách) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000] text-white z-30 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          {/* Aktualizované logo i pro mobilní zobrazení */}
          <span className="text-xl font-extrabold text-white">IZOLACE</span>
          <span className="bg-[#FF4F00] px-2 py-1 rounded-lg text-sm font-black text-white tracking-wider">RS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Otevřít menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 2. Sidebar komponenta - předáváme jí stav sbalení */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      {/* 3. Hlavní obsahová část - DYNAMICKÝ PADDING podle stavu sidebaru */}
      <main 
        className={`flex-1 flex flex-col min-h-screen pt-16 md:pt-0 transition-all duration-300 ease-in-out pl-0 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}