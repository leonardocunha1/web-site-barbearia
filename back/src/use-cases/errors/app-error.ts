/**
 * Base class for application errors with HTTP status codes.
 * All domain errors should extend this class.
 *
 * @example
 * ```typescript
 * export class UserNotFoundError extends AppError {
 *   constructor() {
 *     super('Usuário não encontrado', 404);
 *   }
 * }
 * ```
 */
export abstract class AppError extends Error {
  /**
   * HTTP status code associated with this error
   */
  public readonly statusCode: number;

  /**
   * Error code for client-side identification
   */
  public readonly code: string;

  /**
   * Creates a new AppError instance
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code (default: 400)
   * @param code - Error code (default: derived from class name)
   */
  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || this.constructor.name;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * HTTP 400 - Bad Request errors
 */
export abstract class BadRequestError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

/**
 * HTTP 401 - Unauthorized errors
 */
export abstract class UnauthorizedError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 401, code);
  }
}

/**
 * HTTP 403 - Forbidden errors
 */
export abstract class ForbiddenError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 403, code);
  }
}

/**
 * HTTP 404 - Not Found errors
 */
export abstract class NotFoundError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 404, code);
  }
}

/**
 * HTTP 409 - Conflict errors
 */
export abstract class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 409, code);
  }
}

/**
 * HTTP 422 - Unprocessable Entity errors
 */
export abstract class UnprocessableEntityError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 422, code);
  }
}
