import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookOpen, Clock, Star, TrendingUp, Play, FileText, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'My Courses - LMS',
  description: 'View and manage your enrolled courses',
}

async function getStudentCoursesData(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { 
      studentId: userId,
      status: 'ACTIVE'
    },
    include: {
      course: {
        include: {
          teacher: {
            select: { 
              id: true, 
              name: true, 
              email: true, 
              avatar: true
            }
          },
          lessons: {
            select: { 
              id: true, 
              title: true,
              order: true 
            },
            orderBy: { order: 'asc' }
          },
          assignments: {
            select: { 
              id: true,
              title: true,
              dueDate: true,
              maxScore: true,
              submissions: {
                where: { studentId: userId },
                select: { id: true, submittedAt: true }
              },
              grades: {
                where: { studentId: userId },
                select: { score: true, maxScore: true }
              }
            },
            orderBy: { dueDate: 'asc' }
          },
          enrollments: {
            select: { id: true }
          }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  return enrollments
}

export default async function MyCoursesPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const enrollments = await getStudentCoursesData(session.user.id)

  // Calculate statistics
  const totalCourses = enrollments.length
  const totalLessons = enrollments.reduce((sum, e) => sum + e.course.lessons.length, 0)
  const totalAssignments = enrollments.reduce((sum, e) => sum + e.course.assignments.length, 0)
  const completedAssignments = enrollments.reduce(
    (sum, e) => sum + e.course.assignments.filter((a: { submissions: string | unknown[] }) => a.submissions.length > 0).length, 
    0
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>
        <Link href="/stcourses">
          <Button size="lg" className="gap-2">
            <BookOpen className="h-5 w-5" />
            Browse More Courses
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Enrolled Courses</p>
              <p className="text-4xl font-bold text-blue-900">{totalCourses}</p>
            </div>
            <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Total Lessons</p>
              <p className="text-4xl font-bold text-purple-900">{totalLessons}</p>
            </div>
            <div className="h-14 w-14 bg-purple-500 rounded-xl flex items-center justify-center">
              <Play className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 mb-1">Assignments</p>
              <p className="text-4xl font-bold text-orange-900">{completedAssignments}/{totalAssignments}</p>
            </div>
            <div className="h-14 w-14 bg-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Progress</p>
              <p className="text-4xl font-bold text-green-900">
                {totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0}%
              </p>
            </div>
            <div className="h-14 w-14 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      {enrollments.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-32 w-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">No Courses Yet</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start your learning journey today! Explore our course catalog and enroll in courses that match your interests.
            </p>
            <Link href="/stcourses">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Explore Courses
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Active Courses ({enrollments.length})
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const course = enrollment.course
              const totalCourseAssignments = course.assignments.length
              const completedCourseAssignments = course.assignments.filter((a: { submissions: string | unknown[] }) => a.submissions.length > 0).length
              const pendingAssignments = course.assignments.filter((a: { submissions: string | unknown[]; dueDate: Date }) => 
                a.submissions.length === 0 && a.dueDate > new Date()
              )
              const overdueAssignments = course.assignments.filter((a: { submissions: string | unknown[]; dueDate: Date }) => 
                a.submissions.length === 0 && a.dueDate <= new Date()
              )
              
              const progress = totalCourseAssignments > 0 
                ? Math.round((completedCourseAssignments / totalCourseAssignments) * 100) 
                : 0

              // Calculate average grade for this course
              const gradedAssignments = course.assignments.filter((a: { grades: string | unknown[] }) => a.grades.length > 0)
              const averageGrade = gradedAssignments.length > 0
                ? Math.round(
                    gradedAssignments.reduce((sum: number, a: { grades: { score: number; maxScore: number }[] }) => {
                      const grade = a.grades[0]
                      return sum + (grade.score / grade.maxScore * 100)
                    }, 0) / gradedAssignments.length
                  )
                : null

              return (
                <Card 
                  key={enrollment.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2"
                >
                  {/* Course Header with Gradient */}
                  <div className="h-40 bg-gradient-to-br from-primary/90 via-purple-600 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-20 w-20 text-white/30 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                        ACTIVE
                      </span>
                    </div>

                    {/* Enrollment Count */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {course.enrollments.length} students
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 space-y-4">
                    {/* Course Title */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Teacher Info */}
                    <div className="flex items-center gap-3 py-3 border-y border-border">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {course.teacher.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{course.teacher.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Instructor
                        </p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Overall Progress</span>
                        <span className="font-bold text-foreground">{progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            progress >= 80 ? 'bg-green-500' :
                            progress >= 50 ? 'bg-blue-500' :
                            progress >= 25 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Play className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Lessons</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{course.lessons.length}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-700">Tasks</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {completedCourseAssignments}/{totalCourseAssignments}
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    {overdueAssignments.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm font-semibold text-red-700">
                          {overdueAssignments.length} overdue assignment{overdueAssignments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    {pendingAssignments.length > 0 && !overdueAssignments.length && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <p className="text-sm font-semibold text-orange-700">
                          {pendingAssignments.length} pending assignment{pendingAssignments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    {/* Average Grade */}
                    {averageGrade !== null && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Average Grade</span>
                        </div>
                        <span className="text-2xl font-bold text-green-900">{averageGrade}%</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                        <Play className="h-4 w-4" />
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {enrollments.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/50">
          <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard/student/assignments">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4" size="lg">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold">View Assignments</p>
                  <p className="text-xs text-muted-foreground">Check pending tasks</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/student/grades">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4" size="lg">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Check Grades</p>
                  <p className="text-xs text-muted-foreground">View your performance</p>
                </div>
              </Button>
            </Link>
            <Link href="/stcourses">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4" size="lg">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Browse Courses</p>
                  <p className="text-xs text-muted-foreground">Explore more options</p>
                </div>
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
