/**
 * API Client for frontend to backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}

// User API
export const userAPI = {
  getAll: (params?: Record<string, string>) =>
    fetchAPI('/users', { params }),
  
  getById: (id: string) =>
    fetchAPI(`/users/${id}`),
  
  create: (data: Record<string, unknown>) =>
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchAPI(`/users/${id}`, { method: 'DELETE' }),
}

// Course API
export const courseAPI = {
  getAll: (params?: Record<string, string>) =>
    fetchAPI('/courses', { params }),
  
  getById: (id: string) =>
    fetchAPI(`/courses/${id}`),
  
  create: (data: Record<string, unknown>) =>
    fetchAPI('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchAPI(`/courses/${id}`, { method: 'DELETE' }),
}

// Lesson API
export const lessonAPI = {
  getByCourse: (courseId: string) =>
    fetchAPI('/lessons', { params: { courseId } }),
  
  getById: (id: string) =>
    fetchAPI(`/lessons/${id}`),
  
  create: (data: Record<string, unknown>) =>
    fetchAPI('/lessons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/lessons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchAPI(`/lessons/${id}`, { method: 'DELETE' }),
}

// Assignment API
export const assignmentAPI = {
  getByCourse: (courseId: string) =>
    fetchAPI('/assignments', { params: { courseId } }),
  
  getById: (id: string) =>
    fetchAPI(`/assignments/${id}`),
  
  create: (data: Record<string, unknown>) =>
    fetchAPI('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/assignments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchAPI(`/assignments/${id}`, { method: 'DELETE' }),
}

// Enrollment API
export const enrollmentAPI = {
  getMyEnrollments: () =>
    fetchAPI('/enrollments'),
  
  enroll: (courseId: string) =>
    fetchAPI('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),
}

// Grades API
export const gradeAPI = {
  getGrades: (studentId?: string) =>
    fetchAPI('/grades', {
      params: studentId ? { studentId } : undefined,
    }),
}
