// src/components/ProfileSettingsForm.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { updateProfile } from '@/actions/profile'

// 1. OBALOVACÍ KOMPONENTA (řeší načítání a eliminuje useEffect)
export default function ProfileSettingsForm() {
  const { data: session, status, update } = useSession()

  // Během prvotního ověřování ukážeme načítání
  if (status === 'loading') {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  // Jakmile je relace načtená, předáme data do vnitřního formuláře
  return <InnerProfileForm session={session} updateSession={update} />
}


// 2. VNITŘNÍ KOMPONENTA FORMULÁŘE (data získá už hotová přes props)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InnerProfileForm({ session, updateSession }: { session: any, updateSession: any }) {
  const router = useRouter()

  // Nyní můžeme state inicializovat přímo, bez použití useEffect!
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI stavy
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    // Ochrana před překlepy v heslu
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Zadaná hesla se neshodují.' })
      return
    }

    setIsSubmitting(true)

    // Odeslání na server
    const result = await updateProfile({
      currentEmail: session?.user?.email || '',
      name,
      email,
      password
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Profil byl úspěšně aktualizován.' })
      setPassword('')
      setConfirmPassword('')
      // Aktualizace NextAuth relace v prohlížeči, aby se hned propsalo jméno v Sidebaru
      await updateSession({ name, email })
      router.refresh()
    } else {
      setMessage({ type: 'error', text: result.error || 'Něco se pokazilo.' })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      
      {/* 1. Základní údaje */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#0D1B3E] border-b border-gray-100 pb-2">Základní údaje</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Jméno a příjmení</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Přihlašovací E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 2. Změna hesla */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#0D1B3E] border-b border-gray-100 pb-2">Změna hesla</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Nové heslo</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Potvrzení nového hesla</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">Pokud heslo nechceš měnit, ponech tato pole prázdná.</p>
      </div>

      {/* Zobrazení zpráv po odeslání */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold text-sm">{message.text}</span>
        </div>
      )}

      {/* 3. Uložení */}
      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#0D1B3E] hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? 'Ukládám...' : 'Uložit změny v profilu'}
        </button>
      </div>

    </form>
  )
}