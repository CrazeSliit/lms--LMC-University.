import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <DashboardSidebar role={session.user.role as 'ADMIN' | 'TEACHER' | 'STUDENT'} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={{ ...session.user, role: session.user.role as 'ADMIN' | 'TEACHER' | 'STUDENT' }} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
