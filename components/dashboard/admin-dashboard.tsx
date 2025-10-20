'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  BookOpen, 
  FileText, 
  UserCheck, 
  TrendingUp, 
  Plus,
  Activity,
  GraduationCap,
  Calendar
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Link from 'next/link'

interface DashboardStats {
  overview: {
    totalUsers: number
    totalCourses: number
    totalAssignments: number
    totalEnrollments: number
    totalStudents: number
    totalTeachers: number
    publishedCourses: number
    activeEnrollments: number
    recentEnrollments: number
  }
  enrollmentTrend: Array<{ date: string; count: number }>
  userGrowth: Array<{ date: string; count: number }>
  topCourses: Array<{
    id: string
    title: string
    teacher: string
    enrollments: number
    status: string
  }>
  recentActivities: Array<{
    id: string
    studentName: string
    courseName: string
    enrolledAt: Date
    status: string
  }>
}

const COLORS = ['#1e9df1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Failed to load dashboard statistics</p>
      </div>
    )
  }

  const userDistribution = [
    { name: 'Students', value: stats.overview.totalStudents },
    { name: 'Teachers', value: stats.overview.totalTeachers },
    { name: 'Admins', value: stats.overview.totalUsers - stats.overview.totalStudents - stats.overview.totalTeachers }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your learning management system</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/users/new">
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
          <Link href="/dashboard/courses/new">
            <Button className="rounded-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overview.totalStudents} students, {stats.overview.totalTeachers} teachers
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.overview.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overview.publishedCourses} published
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollments
            </CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.overview.totalEnrollments}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{stats.overview.recentEnrollments} this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assignments
            </CardTitle>
            <FileText className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.overview.totalAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollment Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Enrollment Trend (Last 30 Days)
            </CardTitle>
            <CardDescription>Daily enrollment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#1e9df1" 
                  strokeWidth={2}
                  name="Enrollments"
                  dot={{ fill: '#1e9df1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Distribution
            </CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: Record<string, unknown>) => `${entry.name}: ${((entry.percent as number) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Top Courses by Enrollment
            </CardTitle>
            <CardDescription>Most popular courses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topCourses} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  width={150}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#8b5cf6" name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.studentName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      Enrolled in {activity.courseName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.enrolledAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs text-muted-foreground">View all users</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/courses">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <BookOpen className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Manage Courses</div>
                  <div className="text-xs text-muted-foreground">View all courses</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/enrollments">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <UserCheck className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Enrollments</div>
                  <div className="text-xs text-muted-foreground">Manage enrollments</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/assignments">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Assignments</div>
                  <div className="text-xs text-muted-foreground">View assignments</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
