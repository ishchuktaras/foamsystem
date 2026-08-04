// src/components/Sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Boxes, Calculator, FileText, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  // Definice všech položek v menu
  const navItems = [
    { name: 'Přehled', href: '/admin', icon: LayoutDashboard },
    { name: 'Správa materiálů', href: '/admin/materials', icon: Boxes },
    { name: 'Kalkulátor spotřeby', href: '/admin/calculator', icon: Calculator },
    { name: 'Nabídky a poptávky', href: '/admin/quotes', icon: FileText },
    { name: 'Nastavení', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-[#0D1B3E] text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0">
      
      {/* Hlavička / Logo */}
      <div className="p-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <span className="bg-white/10 p-1.5 rounded-lg text-sm">N</span>
          <span>Foam<span className="text-[#3B82F6]">System</span></span>
        </h2>
        <p className="text-xs text-gray-400 mt-2 font-medium">Interní systém pro izolace</p>
      </div>

      {/* Hlavní navigace */}
      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#3B82F6] text-white font-semibold shadow-md shadow-blue-900/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Uživatelský profil (Spodek panelu) */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
          <div>
            <p className="text-sm font-bold text-white">Taras Ishchuk</p>
            <p className="text-xs text-gray-400 font-medium">Admin</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
      
    </aside>
  )
}