// src/components/Sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Boxes, Calculator, FileText, Settings, LogOut, X, Users, ClipboardCheck } from 'lucide-react'
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
  
  const sessionHook = useSession()
  const session = sessionHook?.data
  const status = sessionHook?.status || "loading"

  const currentUser = session?.user as { name?: string | null; email?: string | null; role?: string | null } | undefined
  const userName = currentUser?.name || currentUser?.email || 'Nepojmenovaný uživatel'
  const roleKey = currentUser?.role ? String(currentUser.role).toUpperCase() : ''
  const userRole = roleKey && ROLE_LABELS[roleKey] ? ROLE_LABELS[roleKey] : 'Pracovník'

  const navItems = [
    { name: 'Přehled', href: '/admin', icon: LayoutDashboard },
    { name: 'Pracovníci', href: '/admin/users', icon: Users },
    { name: 'Správa materiálů', href: '/admin/materials', icon: Boxes },
    { name: 'Kalkulátor spotřeby', href: '/admin/calculator', icon: Calculator },
    { name: 'Nabídky a poptávky', href: '/admin/quotes', icon: FileText },
    { name: 'Evidence práce', href: '/admin/evidence', icon: ClipboardCheck }, // Přidána nová položka evidence
    { name: 'Nastavení', href: '/admin/settings', icon: Settings },
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* ABSOLUTNÍ ČERNÁ POZADÍ SIDEBARU */}
      <aside className={`
        w-64 bg-[#000000] text-[#FEFEFA] flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-50 
        transition-transform duration-300 ease-in-out border-r border-zinc-900
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <span className="bg-[#FF4F00] p-1.5 rounded-lg text-sm text-white">N</span>
              <span>Foam<span className="text-[#FF4F00]">System</span></span>
            </h2>
            <p className="text-xs text-zinc-500 mt-2 font-medium tracking-wide">INTERNÍ SYSTÉM</p>
          </div>
          <button 
            onClick={() => setIsOpen?.(false)}
            className="md:hidden text-zinc-500 hover:text-[#FF4F00] p-1"
          >
            <X size={20} />
          </button>
        </div>

        <CompanyBadge />

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen?.(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#FF4F00] text-[#FEFEFA] font-bold shadow-lg shadow-[#FF4F00]/20' 
                    : 'text-zinc-400 hover:text-[#FEFEFA] hover:bg-white/5 font-medium'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#FEFEFA]' : 'text-zinc-500'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900">
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
              className="text-zinc-500 hover:text-[#FF4F00] transition-colors p-1.5 hover:bg-black rounded-lg cursor-pointer shrink-0"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
      </aside>
    </>
  )
}