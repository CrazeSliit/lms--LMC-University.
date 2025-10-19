import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/api-middleware'
import { updateUserSchema } from '@/lib/validations/user'
import bcrypt from 'bcryptjs'

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireAdmin(request)
    if (error) return error

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        taughtCourses: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
            status: true,
          },
        },
      },
    })

    if (!user) {
      return ApiResponse.notFound('User not found')
    }

    return ApiResponse.success(user)
  } catch (error: unknown) {
    console.error('GET /api/users/[id] error:', error)
    return ApiResponse.serverError((error as Error).message)
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    const validation = updateUserSchema.safeParse(body)

    if (!validation.success) {
      return ApiResponse.validationError(validation.error.format())
    }

    const data = { ...validation.data } as Record<string, unknown>

    // Hash password if provided
    if (data.password && typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10)
    }

    // Check if email is being changed and already exists
    if (data.email && typeof data.email === 'string') {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: params.id },
        },
      })

      if (existingUser) {
        return ApiResponse.error('Email already exists', 409)
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        updatedAt: true,
      },
    })

    return ApiResponse.success(user)
  } catch (error: unknown) {
    console.error('PATCH /api/users/[id] error:', error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return ApiResponse.notFound('User not found')
    }
    return ApiResponse.serverError(error instanceof Error ? error.message : 'An error occurred')
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, session } = await requireAdmin(request)
    if (error) return error

    // Prevent deleting yourself
    if (session!.user.id === params.id) {
      return ApiResponse.error('Cannot delete your own account', 400)
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return ApiResponse.success({ message: 'User deleted successfully' })
  } catch (error: unknown) {
    console.error('DELETE /api/users/[id] error:', error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return ApiResponse.notFound('User not found')
    }
    return ApiResponse.serverError(error instanceof Error ? error.message : 'An error occurred')
  }
}
