import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { withAuth, requireTeacherOrAdmin } from '@/lib/api-middleware'
import { updateAssignmentSchema } from '@/lib/validations/assignment'

// GET /api/assignments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await withAuth(request)
    if (error) return error

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            teacherId: true,
          },
        },
        submissions: {
          where: session!.user.role === 'STUDENT' ? { studentId: session!.user.id } : undefined,
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!assignment) {
      return ApiResponse.notFound('Assignment not found')
    }

    return ApiResponse.success(assignment)
  } catch (error) {
    console.error('GET /api/assignments/[id] error:', error)
    return ApiResponse.serverError()
  }
}

// PATCH /api/assignments/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { course: true },
    })

    if (!assignment) {
      return ApiResponse.notFound('Assignment not found')
    }

    if (session!.user.role === 'TEACHER' && assignment.course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden()
    }

    const body = await request.json()
    const validation = updateAssignmentSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const data = { ...validation.data }
    if (data.dueDate) {
      Object.assign(data, { dueDate: new Date(data.dueDate) })
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: params.id },
      data,
    })

    return ApiResponse.success(updatedAssignment)
  } catch (error) {
    console.error('PATCH /api/assignments/[id] error:', error)
    return ApiResponse.serverError()
  }
}

// DELETE /api/assignments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireTeacherOrAdmin(request)
    if (error) return error

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { course: true },
    })

    if (!assignment) {
      return ApiResponse.notFound('Assignment not found')
    }

    if (session!.user.role === 'TEACHER' && assignment.course.teacherId !== session!.user.id) {
      return ApiResponse.forbidden()
    }

    await prisma.assignment.delete({
      where: { id: params.id },
    })

    return ApiResponse.success({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/assignments/[id] error:', error)
    return ApiResponse.serverError()
  }
}
