import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - LMS',
  description: 'Administrator dashboard with analytics and statistics',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Redirect based on role
  if (session.user.role === 'STUDENT') {
    redirect('/dashboard/student')
  } else if (session.user.role === 'TEACHER') {
    redirect('/dashboard/teacher')
  }

  return <AdminDashboard />
}
