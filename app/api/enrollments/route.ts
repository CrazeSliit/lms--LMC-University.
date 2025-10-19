import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth } from '@/lib/api-middleware'
import { z } from 'zod'

const enrollSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
})

// GET /api/enrollments - Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const { error, session } = await withAuth(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { studentId: session!.user.id }
    if (status) where.status = status

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true },
            },
            _count: {
              select: { lessons: true, assignments: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return ApiResponse.success({ enrollments })
  } catch (error) {
    console.error('GET /api/enrollments error:', error)
    return ApiResponse.serverError()
  }
}

// POST /api/enrollments - Enroll in course
export async function POST(request: NextRequest) {
  try {
    const { error, session } = await withAuth(request)
    if (error) return error

    const body = await request.json()
    const validation = enrollSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const { courseId } = validation.data

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return ApiResponse.notFound('Course not found')
    }

    if (course.status !== 'PUBLISHED') {
      return ApiResponse.error('Course is not available for enrollment', 400)
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session!.user.id,
          courseId,
        },
      },
    })

    if (existing) {
      return ApiResponse.error('Already enrolled in this course', 409)
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: session!.user.id,
        courseId,
        status: 'ACTIVE',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session!.user.id,
        message: `You have successfully enrolled in "${course.title}"`,
        type: 'ENROLLMENT',
      },
    })

    return ApiResponse.success(enrollment, 201)
  } catch (error) {
    console.error('POST /api/enrollments error:', error)
    return ApiResponse.serverError()
  }
}
