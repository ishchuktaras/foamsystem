// src/app/admin/users/page.tsx

import Link from 'next/link'
import { Users, UserPlus, Archive, CheckCircle2 } from 'lucide-react'
import AdminUsersTable from '@/components/AdminUsersTable'
import { getAllUsers } from '@/actions/user'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }> | { archived?: string }
}) {
  const params = await searchParams
  const isArchivedView = params?.archived === 'true'

  const session = await auth()
  const currentUserRole = session?.user?.role as string | undefined

  const users = await getAllUsers(isArchivedView)

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] p-8 md:p-10 text-[#FEFEFA] shadow-xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {isArchivedView ? 'Archiv pracovníků' : 'Správa pracovníků'}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {isArchivedView 
              ? 'Zde vidíte všechny bývalé nebo deaktivované zaměstnance. Můžete je kdykoliv obnovit.'
              : 'Kompletní administrace vašeho týmu. Spravujte přístupové údaje, přiřazujte role a udržujte si přehled.'}
          </p>
        </div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          {isArchivedView ? <Archive size={300} /> : <Users size={300} />}
        </div>
      </div>

      {/* Ovládací panel s Taby */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FEFEFA] p-2 rounded-xl border border-zinc-200 shadow-sm max-w-5xl mx-auto">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <Link 
            href="/admin/users"
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${!isArchivedView ? 'bg-[#FF4F00] text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <CheckCircle2 size={18} />
            Aktivní
          </Link>
          <Link 
            href="/admin/users?archived=true"
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${isArchivedView ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <Archive size={18} />
            Archiv
          </Link>
        </div>

        {!isArchivedView && (
          <Link 
            href="/admin/users/new" 
            className="w-full sm:w-auto px-6 py-2.5 bg-[#000000] hover:bg-zinc-800 text-[#FEFEFA] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={18} />
            Přidat pracovníka
          </Link>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        <AdminUsersTable users={users} isArchivedView={isArchivedView} currentUserRole={currentUserRole} />
      </div>
    </div>
  )
}