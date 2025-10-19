import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth, requireTeacherOrAdmin } from '@/lib/api-middleware'
import { updateLessonSchema } from '@/lib/validations/lesson'

// GET /api/lessons/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await withAuth(request)
    if (error) return error

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            teacherId: true,
          },
        },
      },
    })

    if (!lesson) {
      return ApiResponse.notFound('Lesson not found')
    }

    return ApiResponse.success(lesson)
  } catch (error) {
    console.error('GET /api/lessons/[id] error:', error)
    return ApiResponse.serverError()
  }
}

// PATCH /api/lessons/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: { course: true },
    })

    if (!lesson) {
      return ApiResponse.notFound('Lesson not found')
    }

    if (session!.user.role === 'TEACHER' && lesson.course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only update lessons for your own courses')
    }

    const body = await request.json()
    const validation = updateLessonSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: validation.data,
    })

    return ApiResponse.success(updatedLesson)
  } catch (error) {
    console.error('PATCH /api/lessons/[id] error:', error)
    return ApiResponse.serverError()
  }
}

// DELETE /api/lessons/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: { course: true },
    })

    if (!lesson) {
      return ApiResponse.notFound('Lesson not found')
    }

    if (session!.user.role === 'TEACHER' && lesson.course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only delete lessons for your own courses')
    }

    await prisma.lesson.delete({
      where: { id: params.id },
    })

    return ApiResponse.success({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/lessons/[id] error:', error)
    return ApiResponse.serverError()
  }
}
