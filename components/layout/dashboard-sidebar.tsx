'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  UserCheck, 
  BarChart3,
  GraduationCap,
  ClipboardList,
  Bell,
  Settings,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardSidebarProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/users', icon: Users, label: 'Users' },
    { href: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
    { href: '/dashboard/enrollments', icon: UserCheck, label: 'Enrollments' },
    { href: '/dashboard/assignments', icon: FileText, label: 'Assignments' },
    { href: '/dashboard/grades', icon: BarChart3, label: 'Grades' },
  ]

  const teacherLinks = [
    { href: '/dashboard/teacher', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/courses', icon: BookOpen, label: 'My Courses' },
    { href: '/dashboard/assignments', icon: FileText, label: 'Assignments' },
    { href: '/dashboard/grades', icon: BarChart3, label: 'Grades' },
    { href: '/dashboard/students', icon: GraduationCap, label: 'Students' },
  ]

  const studentLinks = [
    { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/my-courses', icon: BookOpen, label: 'My Courses' },
    { href: '/dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
    { href: '/dashboard/grades', icon: BarChart3, label: 'My Grades' },
  ]

  const links = role === 'ADMIN' ? adminLinks : role === 'TEACHER' ? teacherLinks : studentLinks

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-20 border-b border-border flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
            <img src="/Logo/LOG.png" alt="LMC University Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">LMC University</div>
            <div className="text-xs text-muted-foreground">{role.charAt(0) + role.slice(1).toLowerCase()} Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Links */}
      <div className="border-t border-border p-4 space-y-1">
        <Link
          href="/dashboard/profile"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
            pathname === '/dashboard/profile'
              ? 'bg-primary text-white shadow-md'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <User className="h-5 w-5" />
          Profile
        </Link>
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
        >
          <Bell className="h-5 w-5" />
          Notifications
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
