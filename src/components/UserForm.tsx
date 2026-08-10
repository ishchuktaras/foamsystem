'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, updateUser } from '@/actions/user'

export default function UserForm({ userId, initialData }: { userId?: string, initialData?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'APLIKATOR'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = userId 
      ? await updateUser(userId, formData)
      : await createUser(formData)

    if (!result.success) {
      setError(result.error || 'Nastala chyba při ukládání.')
      setIsLoading(false)
      return
    }

    router.push('/admin/users')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Jméno a příjmení</label>
          <input
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E]"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">E-mail (Přihlašovací jméno)</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E]"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Pracovní pozice (Role)</label>
          <select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E] font-medium"
          >
            <option value="JEDNATEL">Jednatel</option>
            <option value="SUPERVIZOR">Supervizor</option>
            <option value="TECHNIK">Technik</option>
            <option value="APLIKATOR">Aplikátor</option>
            <option value="POMOCNIK">Pomocník aplikátora</option>
            <option value="ADMIN">Systémový administrátor</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            {userId ? 'Nové heslo (nevyplňujte, pokud nechcete měnit)' : 'Heslo'}
          </label>
          <input
            name="password"
            type="password"
            required={!userId}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none text-[#0D1B3E]"
          />
        </div>
      </div>

      {error && <div className="mt-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      <div className="mt-8 flex gap-4 justify-end">
        <button type="button" onClick={() => router.push('/admin/users')} className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
          Zrušit
        </button>
        <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70">
          {isLoading ? 'Ukládám...' : 'Uložit pracovníka'}
        </button>
      </div>
    </form>
  )
}