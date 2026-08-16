// src/app/admin/settings/profile/page.tsx

import Link from 'next/link'
import { ArrowLeft, UserCog, KeyRound } from 'lucide-react'
import ProfileSettingsForm from '@/components/ProfileSettingsForm'

export const dynamic = 'force-dynamic'

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link href="/admin/settings" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-[#FF4F00] transition-colors">
        <ArrowLeft size={16} className="mr-1" />
        Zpět na přehled nastavení
      </Link>

      {/* Prémiový Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] to-[#1a1a1a] border border-zinc-800 p-8 md:p-10 text-[#FEFEFA] shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Osobní profil
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Zde si můžeš upravit své jméno, e-mail nebo si nastavit úplně nové heslo pro přihlášení do administrace.
          </p>
        </div>
        {/* Dekorace pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none text-[#FF4F00]">
          <UserCog size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none text-[#FF4F00]">
          <KeyRound size={150} />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto pt-4">
        <ProfileSettingsForm />
      </div>
      
    </div>
  )
}