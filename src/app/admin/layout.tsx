// src/app/admin/layout.tsx

import Sidebar from '@/components/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Vložená samostatná komponenta */}
      <Sidebar />
      
      {/* Hlavní obsahová část s odsazením o šířku sidebaru (pl-64) */}
      <main className="flex-1 pl-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  )
}