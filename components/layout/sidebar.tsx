'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  Users,
  Settings,
  ClipboardList,
} from 'lucide-react'
import { Session } from 'next-auth'

interface SidebarProps {
  session: Session
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Courses',
    href: '/dashboard/courses',
    icon: BookOpen,
  },
  {
    name: 'Lessons',
    href: '/dashboard/lessons',
    icon: FileText,
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    name: 'Assignments',
    href: '/dashboard/assignments',
    icon: ClipboardList,
  },
  {
    name: 'Grades',
    href: '/dashboard/grades',
    icon: GraduationCap,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: Settings,
  },
]

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname()
  const userRole = session.user.role

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  return (
    <aside className="flex w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          LMS Platform
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-gray-50 p-3 text-xs">
          <p className="font-semibold text-gray-900">{session.user.name}</p>
          <p className="text-gray-600">{session.user.email}</p>
          <p className="mt-1 text-gray-500">Role: {session.user.role}</p>
        </div>
      </div>
    </aside>
  )
}
