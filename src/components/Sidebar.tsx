// src/components/Sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Boxes, Calculator, FileText, Settings, LogOut, X, Users } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

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
  
  // Bezpečné volání hooku, které nespadne, když je kontext undefined
  const sessionHook = useSession()
  const session = sessionHook?.data

  const navItems = [
    { name: 'Přehled', href: '/admin', icon: LayoutDashboard },
    { name: 'Pracovníci', href: '/admin/users', icon: Users },
    { name: 'Správa materiálů', href: '/admin/materials', icon: Boxes },
    { name: 'Kalkulátor spotřeby', href: '/admin/calculator', icon: Calculator },
    { name: 'Nabídky a poptávky', href: '/admin/quotes', icon: FileText },
    { name: 'Nastavení', href: '/admin/settings', icon: Settings },
  ]

  const currentUser = session?.user as { name?: string | null; role?: string | null } | undefined
  const userName = currentUser?.name || 'Taras Ishchuk'
  const userRole = currentUser?.role ? ROLE_LABELS[currentUser.role] || currentUser.role : 'Admin'

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`
        w-64 bg-[#0D1B3E] text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <span className="bg-white/10 p-1.5 rounded-lg text-sm">N</span>
              <span>Foam<span className="text-[#3B82F6]">System</span></span>
            </h2>
            <p className="text-xs text-gray-400 mt-2 font-medium">Interní systém pro izolace</p>
          </div>
          <button 
            onClick={() => setIsOpen?.(false)}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
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

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
            <div className="overflow-hidden pr-2">
              <p className="text-sm font-bold text-white truncate">{userName}</p>
              <p className="text-xs text-gray-400 font-medium">{userRole}</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Odhlásit se"
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg cursor-pointer shrink-0"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
      </aside>
    </>
  )
}