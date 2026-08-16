// src/app/admin/users/[id]/edit/page.tsx

import { getUserById } from '@/actions/user'
import UserForm from '@/components/UserForm'
import { UserCog, Fingerprint } from 'lucide-react'

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  
  if (!resolvedParams.id) {
    return (
      <div className="p-8 text-red-600 font-bold bg-red-50 rounded-xl m-8 border border-red-200">
        Chyba: Nepodařilo se přečíst ID z URL.
      </div>
    )
  }
  
  const user = await getUserById(resolvedParams.id)
  
  if (!user) {
    return (
      <div className="p-8 text-red-600 font-bold bg-red-50 rounded-xl m-8 border border-red-200">
        Chyba 404: Pracovník s tímto ID neexistuje.
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Úprava pracovníka
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Změňte údaje nebo upravte úroveň oprávnění pro uživatele <strong className="text-[#FEFEFA] bg-zinc-800 px-2 py-0.5 rounded mx-1">{user.name || user.email || 'Nepojmenovaný uživatel'}</strong>.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <UserCog size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none text-[#FF4F00]">
          <Fingerprint size={150} />
        </div>
      </div>

      {/* Samotný formulář */}
      <div className="max-w-4xl mx-auto pt-4">
        <UserForm 
          userId={user.id} 
          initialData={user} 
        />
      </div>

    </div>
  )
}