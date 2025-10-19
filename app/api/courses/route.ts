import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth, requireTeacherOrAdmin } from '@/lib/api-middleware'
import { createCourseSchema } from '@/lib/validations/course'

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { error, session } = await withAuth(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const teacherId = searchParams.get('teacherId')

    const skip = (page - 1) * limit

    const where: any = {}
    
    // Students only see published courses
    if (session!.user.role === 'STUDENT') {
      where.status = 'PUBLISHED'
    } else if (status) {
      where.status = status
    }

    // Teachers only see their own courses
    if (session!.user.role === 'TEACHER') {
      where.teacherId = session!.user.id
    } else if (teacherId) {
      where.teacherId = teacherId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              assignments: true,
              quizzes: true,
              enrollments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ])

    return ApiResponse.success({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('GET /api/courses error:', error)
    return ApiResponse.serverError(error.message)
  }
}

// POST /api/courses - Create new course (Teacher/Admin only)
export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const body = await request.json()
    const validation = createCourseSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const { title, description, teacherId, status } = validation.data

    // Teachers can only create courses for themselves
    if (session!.user.role === 'TEACHER' && teacherId !== session!.user.id) {
      return ApiResponse.forbidden('You can only create courses for yourself')
    }

    // Verify teacher exists
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
    })

    if (!teacher) {
      return ApiResponse.error('Teacher not found', 404)
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherId,
        status,
      },
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

    return ApiResponse.success(course, 201)
  } catch (error: any) {
    console.error('POST /api/courses error:', error)
    return ApiResponse.serverError(error.message)
  }
}
