import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth, requireTeacherOrAdmin } from '@/lib/api-middleware'
import { createLessonSchema } from '@/lib/validations/lesson'

// GET /api/lessons - Get all lessons
export async function GET(request: NextRequest) {
  try {
    const { error } = await withAuth(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return ApiResponse.error('courseId is required', 400)
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        order: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return ApiResponse.success({ lessons })
  } catch (error) {
    console.error('GET /api/lessons error:', error)
    return ApiResponse.serverError()
  }
}

// POST /api/lessons - Create new lesson
export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const body = await request.json()
    const validation = createLessonSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const { title, content, order, courseId } = validation.data

    // Verify course exists and user has permission
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return ApiResponse.notFound('Course not found')
    }

    if (session!.user.role === 'TEACHER' && course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only create lessons for your own courses')
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        order,
        courseId,
      },
    })

    return ApiResponse.success(lesson, 201)
  } catch (error) {
    console.error('POST /api/lessons error:', error)
    return ApiResponse.serverError()
  }
}
