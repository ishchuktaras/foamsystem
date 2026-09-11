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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    // 1. Force the root to exactly 100vw to prevent horizontal scrolling of the whole page
    <div className="flex min-h-screen bg-zinc-50 w-full max-w-[100vw] overflow-x-hidden">
      
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000] text-white z-30 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
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

      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      {/* 2. STRICT WIDTH CONSTRAINT: We explicitly calculate the width to ensure it cannot overflow */}
      <main 
        className={`flex flex-col min-h-screen pt-16 md:pt-0 transition-all duration-300 ease-in-out pl-0 ${
          isSidebarCollapsed 
            ? 'md:pl-20 md:w-[calc(100vw-80px)]' // 80px is md:w-20
            : 'md:pl-64 md:w-[calc(100vw-256px)]' // 256px is md:w-64
        } w-full max-w-full overflow-hidden`}
      >
        {/* 3. The inner container also needs to be strictly constrained */}
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full min-w-0 mx-auto overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}