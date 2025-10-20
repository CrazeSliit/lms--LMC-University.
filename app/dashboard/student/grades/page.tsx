import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GraduationCap, TrendingUp, TrendingDown, Minus, Award, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'My Grades - Student Dashboard',
  description: 'View your grades and academic performance',
}

async function getStudentGrades(userId: string) {
  const grades = await prisma.grade.findMany({
    where: { studentId: userId },
    include: {
      assignment: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              teacher: {
                select: { name: true }
              }
            }
          }
        }
      },
      quiz: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              teacher: {
                select: { name: true }
              }
            }
          }
        }
      }
    },
    orderBy: { gradedAt: 'desc' }
  })

  // Get enrolled courses with grades
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: userId,
      status: 'ACTIVE'
    },
    include: {
      course: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  return { grades, enrollments }
}

export default async function StudentGradesPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const { grades } = await getStudentGrades(session.user.id)

  // Calculate overall statistics
  const totalGrades = grades.length
  const overallAverage = totalGrades > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / totalGrades)
    : 0

  // Calculate GPA (assuming 4.0 scale)
  const calculateGPA = (percentage: number) => {
    if (percentage >= 90) return 4.0
    if (percentage >= 80) return 3.0
    if (percentage >= 70) return 2.0
    if (percentage >= 60) return 1.0
    return 0.0
  }

  const gpa = totalGrades > 0
    ? (grades.reduce((sum, g) => sum + calculateGPA(g.score / g.maxScore * 100), 0) / totalGrades).toFixed(2)
    : '0.00'

  // Group grades by course
  const gradesByCourse = grades.reduce((acc, grade) => {
    const course = grade.assignment?.course || grade.quiz?.course
    if (!course) return acc

    if (!acc[course.id]) {
      acc[course.id] = {
        courseTitle: course.title,
        grades: []
      }
    }
    acc[course.id].grades.push(grade)
    return acc
  }, {} as Record<string, { courseTitle: string; grades: typeof grades }>)

  // Calculate course averages
  const courseAverages = Object.entries(gradesByCourse).map(([courseId, data]) => {
    const avg = Math.round(
      data.grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / data.grades.length
    )
    return {
      courseId,
      courseTitle: data.courseTitle,
      average: avg,
      gradeCount: data.grades.length
    }
  }).sort((a, b) => b.average - a.average)

  // Performance indicators
  const excellentGrades = grades.filter(g => (g.score / g.maxScore * 100) >= 90).length
  const passingGrades = grades.filter(g => (g.score / g.maxScore * 100) >= 60).length
  const failingGrades = grades.filter(g => (g.score / g.maxScore * 100) < 60).length

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-700 border-green-300'
    if (percentage >= 80) return 'bg-blue-100 text-blue-700 border-blue-300'
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    return 'bg-red-100 text-red-700 border-red-300'
  }

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">My Grades</h1>
        <p className="text-muted-foreground">
          Track your academic performance and progress
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Overall Average</p>
              <p className="text-3xl font-bold text-foreground">{overallAverage}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Grade: {getLetterGrade(overallAverage)}
              </p>
            </div>
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">GPA</p>
              <p className="text-3xl font-bold text-foreground">{gpa}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Out of 4.0
              </p>
            </div>
            <Award className="h-10 w-10 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Excellent (A)</p>
              <p className="text-3xl font-bold text-foreground">{excellentGrades}</p>
              <p className="text-xs text-muted-foreground mt-1">
                90% and above
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Grades</p>
              <p className="text-3xl font-bold text-foreground">{totalGrades}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {passingGrades} passing
              </p>
            </div>
            <BookOpen className="h-10 w-10 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Course Averages */}
      {courseAverages.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Course Performance</h2>
          <div className="space-y-4">
            {courseAverages.map((course) => (
              <div key={course.courseId} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{course.courseTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.gradeCount} grade{course.gradeCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getGradeColor(course.average)}`}>
                      {course.average}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Grade: {getLetterGrade(course.average)}
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      course.average >= 90 ? 'bg-green-500' :
                      course.average >= 80 ? 'bg-blue-500' :
                      course.average >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${course.average}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Grades */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">All Grades</h2>
        
        {grades.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No grades yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete and submit assignments to receive grades
            </p>
            <Link href="/dashboard/student/assignments">
              <Button>View Assignments</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {grades.map((grade) => {
              const percentage = Math.round((grade.score / grade.maxScore) * 100)
              const course = grade.assignment?.course || grade.quiz?.course
              const title = grade.assignment?.title || grade.quiz?.title || 'Unknown'
              const type = grade.assignment ? 'Assignment' : 'Quiz'

              return (
                <div
                  key={grade.id}
                  className="border border-border rounded-lg p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-foreground text-lg">{title}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium mb-2">
                        {course?.title}
                      </p>
                      {grade.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-muted-foreground font-semibold mb-1">
                            Teacher Feedback:
                          </p>
                          <p className="text-sm text-foreground italic">
                            &quot;{grade.feedback}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-6 text-right">
                      <div className={`text-3xl font-bold px-6 py-3 rounded-lg border-2 ${getGradeColor(percentage)}`}>
                        {percentage}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 font-semibold">
                        {grade.score} / {grade.maxScore} points
                      </p>
                      <p className="text-lg font-bold text-foreground mt-1">
                        Grade: {getLetterGrade(percentage)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {grade.gradedAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Performance Summary */}
      {grades.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Performance Summary</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-700 mb-1">{excellentGrades}</p>
              <p className="text-sm text-green-600 font-medium">Excellent Grades (A)</p>
              <p className="text-xs text-muted-foreground mt-1">90% and above</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <Minus className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-700 mb-1">{passingGrades}</p>
              <p className="text-sm text-blue-600 font-medium">Passing Grades</p>
              <p className="text-xs text-muted-foreground mt-1">60% and above</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <TrendingDown className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-red-700 mb-1">{failingGrades}</p>
              <p className="text-sm text-red-600 font-medium">Needs Improvement</p>
              <p className="text-xs text-muted-foreground mt-1">Below 60%</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
