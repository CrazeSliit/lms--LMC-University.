import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users } from 'lucide-react'

export default async function CoursesPage() {
  const session = await auth()
  const userRole = session?.user.role

  // Fetch courses based on user role
  const courses = await prisma.course.findMany({
    where: userRole === 'STUDENT' 
      ? { status: 'PUBLISHED' }
      : userRole === 'TEACHER'
      ? { teacherId: session?.user.id }
      : {}, // Admin sees all courses
    include: {
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Courses
          </h2>
          <p className="text-gray-600">
            {userRole === 'STUDENT' 
              ? 'Browse and enroll in courses'
              : userRole === 'TEACHER'
              ? 'Manage your courses'
              : 'Manage all courses'}
          </p>
        </div>
        {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
          <Link href="/dashboard/courses/new">
            <Button>Create Course</Button>
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-semibold text-gray-900">No courses yet</p>
            <p className="text-gray-600">
              {userRole === 'STUDENT' 
                ? 'No courses available at the moment'
                : 'Create your first course to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800'
                      : course.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <CardDescription className="line-clamp-3">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{course.teacher.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course._count.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course._count.enrollments} students</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button variant="outline" className="w-full">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
