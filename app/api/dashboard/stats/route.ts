import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only allow admin to view full dashboard stats
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get total counts
    const [
      totalUsers,
      totalCourses,
      totalAssignments,
      totalEnrollments,
      totalStudents,
      totalTeachers,
      publishedCourses,
      activeEnrollments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.assignment.count(),
      prisma.enrollment.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count({ where: { status: 'ACTIVE' } })
    ])

    // Get recent enrollments (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentEnrollments = await prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get enrollment trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const enrollmentTrend = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("enrolledAt") as date, COUNT(*)::int as count
      FROM "enrollments"
      WHERE "enrolledAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("enrolledAt")
      ORDER BY date ASC
    `

    // Get top courses by enrollment
    const topCourses = await prisma.course.findMany({
      take: 5,
      include: {
        _count: {
          select: { enrollments: true }
        },
        teacher: {
          select: { name: true }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      }
    })

    // Get user growth trend (last 30 days)
    const userGrowth = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "users"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // Get recent activities (latest enrollments and assignments)
    const recentActivities = await prisma.enrollment.findMany({
      take: 10,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: {
          select: { name: true, email: true }
        },
        course: {
          select: { title: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCourses,
          totalAssignments,
          totalEnrollments,
          totalStudents,
          totalTeachers,
          publishedCourses,
          activeEnrollments,
          recentEnrollments
        },
        enrollmentTrend: enrollmentTrend.map(item => ({
          date: item.date.toISOString().split('T')[0],
          count: Number(item.count)
        })),
        userGrowth: userGrowth.map(item => ({
          date: item.date.toISOString().split('T')[0],
          count: Number(item.count)
        })),
        topCourses: topCourses.map(course => ({
          id: course.id,
          title: course.title,
          teacher: course.teacher.name,
          enrollments: course._count.enrollments,
          status: course.status
        })),
        recentActivities: recentActivities.map(activity => ({
          id: activity.id,
          studentName: activity.student.name,
          courseName: activity.course.title,
          enrolledAt: activity.enrolledAt,
          status: activity.status
        }))
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
