// src/components/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Boxes, Calculator, FileText, Settings, LogOut, X, Users, ClipboardCheck, CalendarDays, Scan, ChevronLeft, ChevronRight } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import CompanyBadge from './CompanyBadge'

interface SidebarProps {
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

const ROLE_LABELS: Record<string, string> = {
  JEDNATEL: 'Jednatel',
  SUPERVIZOR: 'Supervizor',
  TECHNIK: 'Technik',
  APLIKATOR: 'Aplikátor',
  POMOCNIK: 'Pomocník',
  ADMIN: 'Admin',
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  
  // Stav pro sbalení sidebaru na ikony (pouze na desktopu)
  const [isCollapsed, setIsCollapsed] = useState(false) 
  
  const sessionHook = useSession()
  const session = sessionHook?.data
  const status = sessionHook?.status || "loading"

  const currentUser = session?.user as { name?: string | null; email?: string | null; role?: string | null } | undefined
  const userName = currentUser?.name || currentUser?.email || 'Nepojmenovaný uživatel'
  const roleKey = currentUser?.role ? String(currentUser.role).toUpperCase() : 'APLIKATOR'
  const userRole = ROLE_LABELS[roleKey] || 'Pracovník'

  const allNavItems = [
    { name: 'Přehled', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN', 'JEDNATEL', 'SUPERVIZOR', 'TECHNIK', 'APLIKATOR'] },
    { name: 'Dispečink', href: '/admin/dispatch', icon: CalendarDays, roles: ['ADMIN', 'JEDNATEL', 'SUPERVIZOR'] },
    { name: 'Pracovníci', href: '/admin/users', icon: Users, roles: ['ADMIN', 'JEDNATEL', 'SUPERVIZOR'] },
    { name: 'Správa materiálů', href: '/admin/materials', icon: Boxes, roles: ['ADMIN', 'JEDNATEL', 'TECHNIK'] },
    { name: 'Kalkulátor spotřeby', href: '/admin/calculator', icon: Calculator, roles: ['ADMIN', 'JEDNATEL', 'TECHNIK', 'SUPERVIZOR'] },
    { name: 'Nabídky a poptávky', href: '/admin/quotes', icon: FileText, roles: ['ADMIN', 'JEDNATEL', 'SUPERVIZOR', 'TECHNIK', 'APLIKATOR'] },
    { name: 'Evidence práce', href: '/admin/evidence', icon: ClipboardCheck, roles: ['ADMIN', 'JEDNATEL', 'SUPERVIZOR', 'APLIKATOR'] },
    { name: 'Chytré měření', href: '/admin/mereni', icon: Scan, roles: ['ADMIN', 'JEDNATEL', 'SUPERVIZOR', 'TECHNIK', 'APLIKATOR'] },
    { name: 'Nastavení', href: '/admin/settings', icon: Settings, roles: ['ADMIN', 'JEDNATEL'] },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(roleKey))

  return (
    <>
      {/* Tmavé pozadí pro mobilní overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`
        bg-[#000000] text-[#FEFEFA] flex flex-col fixed left-0 top-0 bottom-0 z-50 
        transition-all duration-300 ease-in-out border-r border-zinc-900 
        h-[100dvh] /* Zásadní pro mobily - přizpůsobí se výšce včetně lišt prohlížeče */
        ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${!isOpen && isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        
        {/* HLAVIČKA A LOGO */}
        <div className={`p-6 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex flex-col ${isCollapsed ? 'items-center' : 'items-start'}`}>
            <div className="flex items-center gap-2">
              {!isCollapsed && <span className="text-xl font-extrabold text-white">IZOLACE</span>}
              <span className="bg-[#FF4F00] px-2 py-1 rounded-lg text-sm font-black text-white tracking-wider">RS</span>
            </div>
            {!isCollapsed && <p className="text-xs text-zinc-500 mt-2 font-medium tracking-wide">INTERNÍ SYSTÉM</p>}
          </div>
          
          <button 
            onClick={() => setIsOpen?.(false)}
            className="md:hidden text-zinc-500 hover:text-[#FF4F00] p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Přepínač velikosti sidebaru (viditelný jen na PC) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-10 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-900 rounded-full p-1 z-50 cursor-pointer shadow-md transition-colors"
          title={isCollapsed ? "Rozbalit panel" : "Sbalit panel"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {!isCollapsed && <div className="px-6 pb-2 shrink-0"><CompanyBadge /></div>}

        {/* NAVIGACE (Obaleno v overflow-y-auto, aby vnitřek roloval a patička zůstala dole) */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-4 [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen?.(false)}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#FF4F00] text-[#FEFEFA] font-bold shadow-lg shadow-[#FF4F00]/20' 
                    : 'text-zinc-400 hover:text-[#FEFEFA] hover:bg-white/5 font-medium'
                }`}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-[#FEFEFA]' : 'text-zinc-500'}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* UŽIVATEL A ODHLÁŠENÍ (Fixováno dole pomocí shrink-0) */}
        <div className="p-4 border-t border-zinc-900 shrink-0">
          {isCollapsed ? (
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              title={`Odhlásit se (${userName})`}
              className="w-full flex justify-center text-zinc-500 hover:text-[#FF4F00] transition-colors p-3 bg-[#111111] hover:bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#111111] border border-zinc-800 p-3 rounded-xl">
              <div className="overflow-hidden pr-2">
                <p className="text-sm font-bold text-[#FEFEFA] truncate" title={userName}>
                  {status === "loading" ? "Načítání..." : userName}
                </p>
                <p className="text-xs text-[#FF4F00] font-bold">
                  {status === "loading" ? "Ověřování" : userRole}
                </p>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                title="Odhlásit se"
                className="text-zinc-500 hover:text-[#FF4F00] hover:bg-zinc-900 transition-colors p-2.5 rounded-lg cursor-pointer shrink-0"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
        
      </aside>
    </>
  )
}