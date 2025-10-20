import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ClipboardList, Clock, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'My Assignments - Student Dashboard',
  description: 'View and manage your assignments',
}

async function getStudentAssignments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { 
      studentId: userId,
      status: 'ACTIVE'
    },
    select: { courseId: true }
  })

  const courseIds = enrollments.map(e => e.courseId)

  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: { in: courseIds }
    },
    include: {
      course: {
        select: { 
          id: true,
          title: true,
          teacher: {
            select: { name: true }
          }
        }
      },
      submissions: {
        where: { studentId: userId },
        select: {
          id: true,
          submittedAt: true,
          content: true
        }
      },
      grades: {
        where: { studentId: userId },
        select: {
          score: true,
          maxScore: true,
          feedback: true,
          gradedAt: true
        }
      }
    },
    orderBy: { dueDate: 'asc' }
  })

  return assignments
}

export default async function StudentAssignmentsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const assignments = await getStudentAssignments(session.user.id)

  const now = new Date()
  const pendingAssignments = assignments.filter(a => 
    a.submissions.length === 0 && a.dueDate > now
  )
  const overdueAssignments = assignments.filter(a => 
    a.submissions.length === 0 && a.dueDate <= now
  )
  const submittedAssignments = assignments.filter(a => 
    a.submissions.length > 0 && a.grades.length === 0
  )
  const gradedAssignments = assignments.filter(a => 
    a.grades.length > 0
  )

  const getDaysUntilDue = (dueDate: Date) => {
    return Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">My Assignments</h1>
        <p className="text-muted-foreground">
          Track and manage all your course assignments
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground">{pendingAssignments.length}</p>
            </div>
            <Clock className="h-10 w-10 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Overdue</p>
              <p className="text-3xl font-bold text-foreground">{overdueAssignments.length}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Submitted</p>
              <p className="text-3xl font-bold text-foreground">{submittedAssignments.length}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Graded</p>
              <p className="text-3xl font-bold text-foreground">{gradedAssignments.length}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Overdue Assignments */}
      {overdueAssignments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            Overdue Assignments
          </h2>
          <div className="space-y-4">
            {overdueAssignments.map((assignment) => (
              <Card key={assignment.id} className="p-6 border-l-4 border-l-red-500 bg-red-50/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {assignment.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{assignment.course.title}</span>
                      <span>•</span>
                      <span>{assignment.course.teacher.name}</span>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-red-600 font-bold text-sm mb-2">
                      OVERDUE
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      Due: {assignment.dueDate.toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="destructive">
                      Submit Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-orange-500" />
            Pending Assignments
          </h2>
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate)
              const isUrgent = daysUntilDue <= 2

              return (
                <Card key={assignment.id} className={`p-6 ${isUrgent ? 'border-l-4 border-l-orange-500 bg-orange-50/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{assignment.title}</h3>
                        {isUrgent && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{assignment.course.title}</span>
                        <span>•</span>
                        <span>{assignment.course.teacher.name}</span>
                        <span>•</span>
                        <span>Max Score: {assignment.maxScore} pts</span>
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={isUrgent ? 'text-orange-600 font-bold' : 'text-muted-foreground'}>
                          {daysUntilDue === 0 ? 'Due today' : 
                           daysUntilDue === 1 ? 'Due tomorrow' : 
                           `Due in ${daysUntilDue} days`}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-4">
                        {assignment.dueDate.toLocaleDateString()}
                      </div>
                      <Button size="sm">
                        Start Assignment
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Submitted Assignments */}
      {submittedAssignments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            Submitted (Awaiting Grade)
          </h2>
          <div className="space-y-4">
            {submittedAssignments.map((assignment) => (
              <Card key={assignment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {assignment.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{assignment.course.title}</span>
                      <span>•</span>
                      <span>{assignment.course.teacher.name}</span>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
                      SUBMITTED
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {assignment.submissions[0]?.submittedAt.toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="outline">
                      View Submission
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Graded Assignments */}
      {gradedAssignments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Graded Assignments
          </h2>
          <div className="space-y-4">
            {gradedAssignments.map((assignment) => {
              const grade = assignment.grades[0]
              const percentage = Math.round((grade.score / grade.maxScore) * 100)
              const gradeColor = 
                percentage >= 90 ? 'bg-green-100 text-green-700' :
                percentage >= 80 ? 'bg-blue-100 text-blue-700' :
                percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'

              return (
                <Card key={assignment.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="font-medium">{assignment.course.title}</span>
                        <span>•</span>
                        <span>{assignment.course.teacher.name}</span>
                      </div>
                      {grade.feedback && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-muted-foreground font-medium mb-1">Teacher Feedback:</p>
                          <p className="text-sm text-foreground italic">&quot;{grade.feedback}&quot;</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-6 text-right">
                      <div className={`text-3xl font-bold ${gradeColor} px-6 py-3 rounded-lg mb-2`}>
                        {percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        {grade.score} / {grade.maxScore} points
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Graded: {grade.gradedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <Card className="p-12 text-center">
          <ClipboardList className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No assignments yet</h2>
          <p className="text-muted-foreground mb-6">
            Enroll in courses to see assignments
          </p>
          <Link href="/stcourses">
            <Button size="lg">Browse Courses</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
