import { NextResponse } from 'next/server'

export class ApiResponse {
  static success(data: unknown, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    )
  }

  static error(message: string, status = 400, errors?: Record<string, unknown>) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        ...(errors && { errors }),
      },
      { status }
    )
  }

  static unauthorized(message = 'Unauthorized access') {
    return this.error(message, 401)
  }

  static forbidden(message = 'Forbidden - insufficient permissions') {
    return this.error(message, 403)
  }

  static notFound(message = 'Resource not found') {
    return this.error(message, 404)
  }

  static validationError(errors: Record<string, unknown>) {
    return this.error('Validation failed', 422, errors)
  }

  static serverError(message = 'Internal server error') {
    return this.error(message, 500)
  }
}
