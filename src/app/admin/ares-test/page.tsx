// src/app/admin/ares-test/page.tsx

import AresSearchBox from '@/components/AresSearchBox'

export default function AresTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B3E]">Testování ARES API</h1>
        <p className="text-gray-600 mt-1">
          Ověření komunikace se státním registrem pro automatické doplňování firemních údajů.
        </p>
      </div>

      <AresSearchBox />
    </div>
  )
}