import { auth } from '@/lib/auth'
import { ApiResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function withAuth(request: NextRequest) {
  const session = await auth()
  
  if (!session || !session.user) {
    return { error: ApiResponse.unauthorized(), session: null }
  }
  
  return { error: null, session }
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const { error, session } = await withAuth(request)
  
  if (error) return { error, session: null }
  
  if (!allowedRoles.includes(session!.user.role)) {
    return { 
      error: ApiResponse.forbidden('You do not have permission to access this resource'), 
      session: null 
    }
  }
  
  return { error: null, session }
}

export async function requireAdmin(request: NextRequest) {
  return requireRole(request, ['ADMIN'])
}

export async function requireTeacherOrAdmin(request: NextRequest) {
  return requireRole(request, ['ADMIN', 'TEACHER'])
}
