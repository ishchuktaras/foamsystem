'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteUser } from '@/actions/user'

// 1. Přesná definice toho, co nám chodí z databáze
type User = {
  id: string
  name: string | null
  email: string | null
  role: string
}

// Vizuální mapa pro tvé firemní role
const ROLE_BADGES: Record<string, { label: string, color: string }> = {
  JEDNATEL: { label: 'Jednatel', color: 'bg-purple-100 text-purple-700' },
  SUPERVIZOR: { label: 'Supervizor', color: 'bg-indigo-100 text-indigo-700' },
  TECHNIK: { label: 'Technik', color: 'bg-blue-100 text-blue-700' },
  APLIKATOR: { label: 'Aplikátor', color: 'bg-teal-100 text-teal-700' },
  POMOCNIK: { label: 'Pomocník', color: 'bg-gray-100 text-gray-700' },
  ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700' },
}

// 2. Nahrazení any[] za User[]
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
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-[#0D1B3E] text-white">
            <th className="p-4 font-semibold text-sm">Jméno a e-mail</th>
            <th className="p-4 font-semibold text-sm">Pozice</th>
            <th className="p-4 font-semibold text-sm text-right">Akce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => {
            const badge = ROLE_BADGES[user.role] || { label: user.role, color: 'bg-gray-100' }
            
            return (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[#0D1B3E]">{user.name || 'Nepojmenovaný uživatel'}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{user.email || 'Bez e-mailu'}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${badge.color}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => router.push(`/admin/users/${user.id}/edit`)} className="px-3 py-1.5 bg-gray-100 text-[#0D1B3E] hover:bg-gray-200 font-medium text-sm rounded-md transition-colors">
                    Upravit
                  </button>
                  <button 
                    // 3. Pojistka pro null name
                    onClick={() => handleDelete(user.id, user.name || 'Neznámý')} 
                    disabled={isDeleting === user.id}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-md transition-colors disabled:opacity-50"
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}