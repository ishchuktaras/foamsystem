// src/app/admin/users/%5Bid%5D/edit/page.tsx

import { getUserById } from '@/actions/user'
import UserForm from '@/components/UserForm'

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  
  if (!resolvedParams.id) {
    return (
      <div className="p-8 text-red-600 font-bold">
        Chyba: Nepodařilo se přečíst ID z URL.
      </div>
    )
  }
  
  const user = await getUserById(resolvedParams.id)
  
  if (!user) {
    return (
      <div className="p-8 text-red-600 font-bold">
        Chyba 404: Pracovník s tímto ID neexistuje.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Úprava pracovníka</h1>
          <p className="text-gray-600 mt-1">
            Změňte údaje nebo roli pro <strong className="text-[#3B82F6]">{user.name || 'tohoto uživatele'}</strong>.
          </p>
        </div>

        <UserForm 
          userId={user.id} 
          initialData={user} 
        />
      </div>
    </div>
  )
}