// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, MessageCircle, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo' 
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setErrorMessage('Nesprávný e-mail nebo heslo.')
        setIsLoading(false)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      console.error('Chyba při přihlášení:', error)
      setErrorMessage('Došlo k neočekávané chybě připojení.')
      setIsLoading(false)
    }
  }

  // WhatsApp zpráva s aktualizovaným názvem systému
  const whatsappMessage = encodeURIComponent(
    'Dobrý den, nemám přístupové údaje do systému Izolace RS (interní systém), nebo mám jiný problém s přístupem. Prosím o technickou podporu.'
  )
  const whatsappUrl = `https://wa.me/420777596216?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FEFEFA] border border-zinc-200 rounded-3xl shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-3 flex flex-col items-center justify-center">
          {/* ZMĚNĚNO: Použití komponenty Logo místo čistého textu */}
          <Logo className="h-10 w-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-500">Přihlášení do interní administrace</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold p-3.5 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-[#000000] focus:ring-2 focus:ring-[#FF4F00] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Heslo</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 pr-12 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-[#000000] focus:ring-2 focus:ring-[#FF4F00] outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#FF4F00] hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Přihlásit se'}
          </button>
        </form>

        <div className="border-t border-zinc-100 pt-6 space-y-4 text-center">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Nemáte přístupové údaje uživatele nebo máte jiný problém s přístupem?
          </p>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
          >
            <MessageCircle size={18} className="text-emerald-600" />
            Neváhejte se obrátit na technickou podporu
          </a>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5">
            Taras Ishchuk - OSVČ <MessageCircle size={12} className="text-emerald-500" />
          </span>
        </div>

      </div>
    </div>
  )
}