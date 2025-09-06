export class AppError extends Error {
  public readonly status: number
  public readonly code?: string
  public readonly isOperational: boolean

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message)
    
    this.status = status
    this.code = code
    this.isOperational = isOperational
    
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message: string, code?: string) {
    return new AppError(message, 400, code)
  }

  static unauthorized(message: string = 'Unauthorized', code?: string) {
    return new AppError(message, 401, code)
  }

  static forbidden(message: string = 'Forbidden', code?: string) {
    return new AppError(message, 403, code)
  }

  static notFound(message: string = 'Not found', code?: string) {
    return new AppError(message, 404, code)
  }

  static validationError(message: string, code?: string) {
    return new AppError(message, 422, code || 'VALIDATION_ERROR')
  }

  static apiError(message: string, code?: string) {
    return new AppError(message, 502, code || 'API_ERROR')
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      stack: this.stack
    }
  }
}