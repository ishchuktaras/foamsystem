//src/app/admin/users/page.tsx

import Link from 'next/link'
import { getAllUsers } from '@/actions/user'
import AdminUsersTable from '@/components/AdminUsersTable'

export const dynamic = 'force-dynamic'

export default async function UsersAdminPage() {
  const users = await getAllUsers()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0D1B3E]">Správa pracovníků</h1>
            <p className="text-gray-600 mt-1">
              Správa přístupů a rolí pro členy vašeho týmu.
            </p>
          </div>
          
          <Link 
            href="/admin/users/new"
            className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors w-full sm:w-auto text-center inline-block"
          >
            + Přidat pracovníka
          </Link>
        </div>

        <AdminUsersTable users={users} />
        
      </div>
    </div>
  )
}