// src/app/admin/users/new/page.tsx

import UserForm from '@/components/UserForm'

export default function NewUserPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B3E]">Přidat nového pracovníka</h1>
          <p className="text-gray-600 mt-1">
            Vytvořte nový přístup do systému a přiřaďte správnou roli.
          </p>
        </div>

        <UserForm />

      </div>
    </div>
  )
}
