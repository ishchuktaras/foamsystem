// src/app/admin/users/page.tsx

import Link from 'next/link'
import { getAllUsers } from '@/actions/user'
import AdminUsersTable from '@/components/AdminUsersTable'
import { Users, ShieldCheck, UserPlus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UsersAdminPage() {
  const users = await getAllUsers()

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Správa pracovníků
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Kompletní administrace vašeho týmu. Spravujte přístupové údaje, přiřazujte role a udržujte si přehled o všech uživatelích systému.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <Users size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <ShieldCheck size={150} />
        </div>
      </div>

      {/* Akční panel s tlačítkem */}
      <div className="flex justify-end">
        <Link 
          href="/admin/users/new"
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
        >
          <UserPlus size={20} />
          Přidat pracovníka
        </Link>
      </div>

      {/* Tabulka pracovníků */}
      <div className="max-w-6xl mx-auto">
        <AdminUsersTable users={users} />
      </div>
      
    </div>
  )
}