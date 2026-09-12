// src/app/admin/page.tsx
import { Suspense } from 'react'
import { auth } from '@/auth'
import ApplicatorView from '@/components/admin/ApplicatorView'
import AdminView from '@/components/admin/AdminView'
import DashboardLoading from '@/components/admin/DashboardLoading'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }> | { period?: string }
}) {
  const session = await auth()
  const currentUser = session?.user as { id?: string; role?: string; name?: string } | undefined
  const role = currentUser?.role ? String(currentUser.role).toUpperCase() : ''
  const userId = currentUser?.id
  const userName = currentUser?.name || 'Aplikátore'
  const isApplicator = role === 'APLIKATOR' || role === 'POMOCNIK'

  return (
    <Suspense fallback={<DashboardLoading />}>
      {isApplicator && userId ? (
        <ApplicatorView userId={userId} userName={userName} searchParams={searchParams} />
      ) : (
        <AdminView />
      )}
    </Suspense>
  )
}