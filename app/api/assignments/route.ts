import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth, requireTeacherOrAdmin } from '@/lib/api-middleware'
import { createAssignmentSchema } from '@/lib/validations/assignment'

// GET /api/assignments
export async function GET(request: NextRequest) {
  try {
    const { error } = await withAuth(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return ApiResponse.error('courseId is required', 400)
    }

    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return ApiResponse.success({ assignments })
  } catch (error) {
    console.error('GET /api/assignments error:', error)
    return ApiResponse.serverError()
  }
}

// POST /api/assignments
export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const body = await request.json()
    const validation = createAssignmentSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const { title, description, dueDate, maxScore, courseId } = validation.data

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return ApiResponse.notFound('Course not found')
    }

    if (session!.user.role === 'TEACHER' && course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only create assignments for your own courses')
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        maxScore,
        courseId,
      },
    })

    return ApiResponse.success(assignment, 201)
  } catch (error) {
    console.error('POST /api/assignments error:', error)
    return ApiResponse.serverError()
  }
}
