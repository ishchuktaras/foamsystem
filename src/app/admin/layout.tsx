// src/app/admin/layout.tsx
'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo' 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-zinc-50 w-full overflow-hidden">
      
      {/* Mobilní navigace (Tmavé pozadí -> text-white) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000] text-white z-30 flex items-center justify-between px-4 shadow-md">
        <Link href="/admin" className="flex items-center text-white active:scale-95 transition-transform">
          <Logo className="h-8 w-auto" />
        </Link>
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
      
      <main 
        className={`flex-1 min-w-0 w-full flex flex-col min-h-screen pt-16 md:pt-0 transition-all duration-300 ease-in-out pl-0 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto flex flex-col">
          
          {/* Obsah */}
          <div className="flex-1">
            {children}
          </div>

          {/* Patička administrace */}
          <footer className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-xs md:text-sm gap-4 pb-4 shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="text-zinc-400">
                <Logo className="h-5 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              </div>
              <span className="text-center sm:text-left">
                &copy; {new Date().getFullYear()} IZOLACE RS. Všechna práva vyhrazena.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="opacity-70">Verze 1.0</span>
              <a href="#" className="hover:text-[#FF4F00] transition-colors font-medium">Podpora IT</a>
            </div>
          </footer>
          
        </div>
      </main>
    </div>
  )
}