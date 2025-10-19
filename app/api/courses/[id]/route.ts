import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth, requireTeacherOrAdmin } from '@/lib/api-middleware'
import { updateCourseSchema } from '@/lib/validations/course'

// GET /api/courses/[id] - Get course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await withAuth(request)
    if (error) return error

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            createdAt: true,
          },
        },
        assignments: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxScore: true,
          },
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            timeLimit: true,
          },
        },
        enrollments: {
          where: { studentId: session!.user.id },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    })

    if (!course) {
      return ApiResponse.notFound('Course not found')
    }

    // Students can only see published courses
    if (session!.user.role === 'STUDENT' && course.status !== 'PUBLISHED') {
      return ApiResponse.forbidden('Course not available')
    }

    return ApiResponse.success(course)
  } catch (error: any) {
    console.error('GET /api/courses/[id] error:', error)
    return ApiResponse.serverError(error.message)
  }
}

// PATCH /api/courses/[id] - Update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course) {
      return ApiResponse.notFound('Course not found')
    }

    // Teachers can only update their own courses
    if (session!.user.role === 'TEACHER' && course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only update your own courses')
    }

    const body = await request.json()
    const validation = updateCourseSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return ApiResponse.success(updatedCourse)
  } catch (error: any) {
    console.error('PATCH /api/courses/[id] error:', error)
    return ApiResponse.serverError(error.message)
  }
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course) {
      return ApiResponse.notFound('Course not found')
    }

    // Teachers can only delete their own courses
    if (session!.user.role === 'TEACHER' && course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only delete your own courses')
    }

    await prisma.course.delete({
      where: { id: params.id },
    })

    return ApiResponse.success({ message: 'Course deleted successfully' })
  } catch (error: any) {
    console.error('DELETE /api/courses/[id] error:', error)
    return ApiResponse.serverError(error.message)
  }
}
