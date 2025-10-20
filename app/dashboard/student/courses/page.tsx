import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookOpen, Clock, Star, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'My Courses - Student Dashboard',
  description: 'View all enrolled courses',
}

async function getStudentCourses(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: userId },
    include: {
      course: {
        include: {
          teacher: {
            select: { id: true, name: true, email: true, avatar: true }
          },
          lessons: {
            select: { id: true, title: true }
          },
          assignments: {
            select: { 
              id: true,
              title: true,
              dueDate: true,
              submissions: {
                where: { studentId: userId },
                select: { id: true }
              }
            }
          }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  return enrollments
}

export default async function StudentCoursesPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const enrollments = await getStudentCourses(session.user.id)

  const activeCourses = enrollments.filter(e => e.status === 'ACTIVE')
  const completedCourses = enrollments.filter(e => e.status === 'COMPLETED')
  const droppedCourses = enrollments.filter(e => e.status === 'DROPPED')

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          Manage and track all your enrolled courses
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Courses</p>
              <p className="text-3xl font-bold text-foreground">{activeCourses.length}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-foreground">{completedCourses.length}</p>
            </div>
            <Star className="h-10 w-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Dropped</p>
              <p className="text-3xl font-bold text-foreground">{droppedCourses.length}</p>
            </div>
            <XCircle className="h-10 w-10 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Active Courses</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((enrollment) => {
              const course = enrollment.course
              const totalAssignments = course.assignments.length
              const completedAssignments = course.assignments.filter(a => a.submissions.length > 0).length
              const progress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0

              return (
                <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-32 bg-gradient-to-br from-primary/20 via-purple-100/50 to-blue-100/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/30" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {course.teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{course.teacher.name}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{completedAssignments}/{totalAssignments} done</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" size="sm">
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

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Completed Courses</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((enrollment) => {
              const course = enrollment.course

              return (
                <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-all opacity-90">
                  <div className="h-32 bg-gradient-to-br from-green-100 to-emerald-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star className="h-16 w-16 text-green-500/30" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {course.teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{course.teacher.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>100% done</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" size="sm">
                      Review Course
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeCourses.length === 0 && completedCourses.length === 0 && droppedCourses.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No courses yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your learning journey by enrolling in a course
          </p>
          <Link href="/stcourses">
            <Button size="lg">Browse Courses</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
