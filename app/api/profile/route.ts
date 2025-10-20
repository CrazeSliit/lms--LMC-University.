import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        phone: true,
        address: true,
        avatar: true,
        department: true,
        expertise: true,
        enrollmentYear: true,
        studentId: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            taughtCourses: true,
            submissions: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      bio,
      phone,
      address,
      avatar,
      department,
      expertise,
      enrollmentYear,
      studentId,
    } = body

    // Validate name
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Build update data based on user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, any> = {
      name: name?.trim(),
      bio: bio?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      avatar: avatar?.trim() || null,
    }

    // Add role-specific fields
    if (user.role === 'TEACHER') {
      updateData.department = department?.trim() || null
      updateData.expertise = expertise?.trim() || null
    } else if (user.role === 'STUDENT') {
      updateData.studentId = studentId?.trim() || null
      updateData.enrollmentYear = enrollmentYear?.trim() || null
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        phone: true,
        address: true,
        avatar: true,
        department: true,
        expertise: true,
        enrollmentYear: true,
        studentId: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            taughtCourses: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
