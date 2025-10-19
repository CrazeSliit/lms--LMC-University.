import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth } from '@/lib/api-middleware'

// GET /api/grades - Get grades
export async function GET(request: NextRequest) {
  try {
    const { error, session } = await withAuth(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId') || session!.user.id

    // Students can only see their own grades
    if (session!.user.role === 'STUDENT' && studentId !== session!.user.id) {
      return ApiResponse.forbidden('You can only view your own grades')
    }

    const grades = await prisma.grade.findMany({
      where: { studentId },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { gradedAt: 'desc' },
    })

    // Calculate statistics
    const stats = grades.reduce(
      (acc, grade) => {
        const percentage = (grade.score / grade.maxScore) * 100
        acc.totalGrades++
        acc.averagePercentage += percentage
        if (grade.assignmentId) acc.assignmentGrades++
        if (grade.quizId) acc.quizGrades++
        return acc
      },
      { totalGrades: 0, averagePercentage: 0, assignmentGrades: 0, quizGrades: 0 }
    )

    if (stats.totalGrades > 0) {
      stats.averagePercentage = stats.averagePercentage / stats.totalGrades
    }

    return ApiResponse.success({ grades, stats })
  } catch (error) {
    console.error('GET /api/grades error:', error)
    return ApiResponse.serverError()
  }
}
