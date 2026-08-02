// src/app/admin/layout.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Boxes, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Definice položek v menu
  const navigation = [
    { name: 'Přehled', href: '/admin', icon: LayoutDashboard },
    { name: 'Správa materiálů', href: '/admin/materials', icon: Boxes },
    { name: 'Nabídky a poptávky', href: '/admin/quotes', icon: FileText },
    { name: 'Nastavení', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* MOBILNÍ LIŠTA (zobrazí se jen na malých obrazovkách) */}
      <div className="md:hidden bg-[#0D1B3E] text-white flex items-center justify-between p-4 shadow-md z-20">
        <div className="font-bold text-lg tracking-wide">
          Foam<span className="text-[#3B82F6]">System</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Otevřít menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILNÍ ROZBALOVACÍ MENU (Drawer) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D1B3E] text-white border-t border-white/10 px-4 py-4 space-y-2 z-20 shadow-xl">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-[#3B82F6] text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </div>
      )}

      {/* DESKTOP SIDEBAR (stálý boční panel pro větší obrazovky) */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0D1B3E] text-white shadow-2xl shrink-0">
        {/* Hlavička sidebaru */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-extrabold tracking-wide">
            Foam<span className="text-[#3B82F6]">System</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Interní systém pro izolace</p>
        </div>

        {/* Navigační odkazy */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Patička sidebaru - uživatel / odhlášení */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl">
            <div className="text-xs">
              <p className="font-semibold text-white">Taras Ishchuk</p>
              <p className="text-gray-400">Admin</p>
            </div>
            <Link 
              href="/" 
              title="Zpět na web"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>

      {/* HLAVNÍ OBSAHOVÁ ČÁST (zde se vykreslují jednotlivé stránky) */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}