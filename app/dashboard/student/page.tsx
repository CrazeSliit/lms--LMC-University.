import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookOpen, ClipboardList, GraduationCap, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Student Dashboard - LMS',
  description: 'Student dashboard with courses, assignments, and grades',
}

async function getStudentDashboardData(userId: string) {
  const [enrollments, assignments, grades] = await Promise.all([
    // Get enrolled courses
    prisma.enrollment.findMany({
      where: { 
        studentId: userId,
        status: 'ACTIVE'
      },
      include: {
        course: {
          include: {
            teacher: {
              select: { name: true, avatar: true }
            },
            _count: {
              select: { lessons: true }
            }
          }
        }
      },
      take: 6,
      orderBy: { enrolledAt: 'desc' }
    }),
    // Get pending assignments
    prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              studentId: userId,
              status: 'ACTIVE'
            }
          }
        },
        dueDate: {
          gte: new Date()
        }
      },
      include: {
        course: {
          select: { title: true }
        },
        submissions: {
          where: { studentId: userId }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 5
    }),
    // Get recent grades
    prisma.grade.findMany({
      where: { studentId: userId },
      include: {
        assignment: {
          include: {
            course: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: { gradedAt: 'desc' },
      take: 5
    })
  ])

  // Calculate statistics
  const totalCourses = enrollments.length
  const pendingAssignments = assignments.filter(a => a.submissions.length === 0).length
  const averageGrade = grades.length > 0
    ? Math.round((grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length))
    : 0

  return {
    enrollments,
    assignments,
    grades,
    stats: {
      totalCourses,
      pendingAssignments,
      averageGrade,
      totalGrades: grades.length
    }
  }
}

export default async function StudentDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const dashboardData = await getStudentDashboardData(session.user.id)
  const { enrollments, assignments, grades, stats } = dashboardData

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {session.user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your courses today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalCourses}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Tasks</p>
              <p className="text-3xl font-bold text-foreground">{stats.pendingAssignments}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Average Grade</p>
              <p className="text-3xl font-bold text-foreground">{stats.averageGrade}%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Grades</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalGrades}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* My Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              My Courses
            </h2>
            <Link href="/dashboard/student/courses">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground mb-4">You&apos;re not enrolled in any courses yet</p>
              <Link href="/stcourses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{enrollment.course.title}</h3>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {enrollment.course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {enrollment.course.teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{enrollment.course.teacher.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {enrollment.course._count.lessons} lessons
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Assignments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              Pending Assignments
            </h2>
            <Link href="/dashboard/student/assignments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {assignments.filter(a => a.submissions.length === 0).length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No pending assignments</p>
              <p className="text-sm text-muted-foreground mt-2">Great job staying on top of your work! 🎉</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments
                .filter(a => a.submissions.length === 0)
                .map((assignment) => {
                  const daysUntilDue = Math.ceil(
                    (assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  const isUrgent = daysUntilDue <= 2

                  return (
                    <div
                      key={assignment.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                        isUrgent ? 'border-orange-300 bg-orange-50/50' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">{assignment.course.title}</p>
                        </div>
                        {isUrgent && (
                          <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={isUrgent ? 'text-orange-600 font-medium' : 'text-muted-foreground'}>
                            Due {daysUntilDue === 0 ? 'today' : daysUntilDue === 1 ? 'tomorrow' : `in ${daysUntilDue} days`}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Max: {assignment.maxScore} pts
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </Card>

        {/* Recent Grades */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Recent Grades
            </h2>
            <Link href="/dashboard/student/grades">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {grades.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No grades yet</p>
              <p className="text-sm text-muted-foreground mt-2">Complete assignments to receive grades</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grades.map((grade) => {
                const percentage = Math.round((grade.score / grade.maxScore) * 100)
                const gradeColor = 
                  percentage >= 90 ? 'text-green-600 bg-green-100' :
                  percentage >= 80 ? 'text-blue-600 bg-blue-100' :
                  percentage >= 70 ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'

                return (
                  <div
                    key={grade.id}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {grade.assignment?.title || 'Graded Work'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {grade.assignment?.course.title || 'Course'}
                        </p>
                        {grade.feedback && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            &quot;{grade.feedback}&quot;
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${gradeColor} px-4 py-2 rounded-lg`}>
                            {percentage}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {grade.score} / {grade.maxScore}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/stcourses">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Browse Courses
            </Button>
          </Link>
          <Link href="/dashboard/student/assignments">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <ClipboardList className="h-5 w-5 mr-2" />
              View Assignments
            </Button>
          </Link>
          <Link href="/dashboard/student/grades">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <GraduationCap className="h-5 w-5 mr-2" />
              Check Grades
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
