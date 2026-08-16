// src/components/AdminUsersTable.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteUser } from '@/actions/user'

type User = {
  id: string
  name: string | null
  email: string | null
  role: string
}

const ROLE_BADGES: Record<string, { label: string, color: string }> = {
  JEDNATEL: { label: 'Jednatel', color: 'bg-[#000000] text-[#FEFEFA]' },
  SUPERVIZOR: { label: 'Supervizor', color: 'bg-zinc-800 text-white' },
  TECHNIK: { label: 'Technik', color: 'bg-[#FF4F00] text-white' },
  APLIKATOR: { label: 'Aplikátor', color: 'bg-orange-100 text-[#FF4F00]' },
  POMOCNIK: { label: 'Pomocník', color: 'bg-zinc-100 text-zinc-700' },
  ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700' },
}

export default function AdminUsersTable({ users }: { users: User[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Opravdu chcete archivovat uživatele "${name}"?`)) return

    setIsDeleting(id)
    const result = await deleteUser(id)
    
    if (!result.success) alert(result.error)
    setIsDeleting(null)
  }

  return (
    <div className="w-full">
      
      {/* 1. MOBILE VIEW */}
      <div className="block space-y-4 md:hidden">
        {users.map((user) => {
          const badge = ROLE_BADGES[user.role] || { label: user.role, color: 'bg-zinc-100' }
          
          return (
            <div key={user.id} className="bg-[#FEFEFA] p-4 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[#000000]">{user.name || 'Nepojmenovaný uživatel'}</div>
                  <div className="text-sm text-zinc-500 mt-0.5">{user.email || 'Bez e-mailu'}</div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              
              <div className="flex gap-2 justify-end mt-2 pt-3 border-t border-zinc-100">
                <button 
                  onClick={() => router.push(`/admin/users/${user.id}/edit`)} 
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-zinc-100 text-[#000000] hover:bg-zinc-200 font-medium text-sm rounded-md transition-colors"
                >
                  Upravit
                </button>
                <button 
                  onClick={() => handleDelete(user.id, user.name || 'Neznámý')} 
                  disabled={isDeleting === user.id}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-md transition-colors disabled:opacity-50"
                >
                  {isDeleting === user.id ? 'Zpracování...' : 'Smazat'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 2. DESKTOP VIEW */}
      <div className="hidden md:block bg-[#FEFEFA] rounded-xl shadow-lg border border-zinc-200 overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#000000] text-[#FEFEFA]">
                <th className="p-4 font-semibold text-sm whitespace-nowrap">Jméno a e-mail</th>
                <th className="p-4 font-semibold text-sm whitespace-nowrap">Pozice</th>
                <th className="p-4 font-semibold text-sm text-right whitespace-nowrap">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => {
                const badge = ROLE_BADGES[user.role] || { label: user.role, color: 'bg-zinc-100' }
                
                return (
                  <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#000000] whitespace-nowrap">{user.name || 'Nepojmenovaný uživatel'}</div>
                      <div className="text-sm text-zinc-500 mt-0.5 whitespace-nowrap">{user.email || 'Bez e-mailu'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${badge.color} whitespace-nowrap`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => router.push(`/admin/users/${user.id}/edit`)} className="px-3 py-1.5 bg-zinc-100 text-[#000000] hover:bg-zinc-200 font-medium text-sm rounded-md transition-colors">
                        Upravit
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name || 'Neznámý')} 
                        disabled={isDeleting === user.id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-md transition-colors disabled:opacity-50"
                      >
                        {isDeleting === user.id ? 'Mažu...' : 'Smazat'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}