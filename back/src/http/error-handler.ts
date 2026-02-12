import { ZodError } from 'zod';
import { AppError } from '@/use-cases/errors';
import { InvalidCouponError as InvalidBookingCouponError } from '@/use-cases/bookings/invalid-coupon-error';

export type ErrorResponse = {
  status: number;
  body: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

/**
 * Resolves errors into HTTP responses
 * Uses AppError base class for consistent error handling
 * 
 * @param error - Error thrown by application
 * @returns HTTP status and response body
 */
export function resolveHttpError(error: unknown): ErrorResponse {
  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        details: { issues: error.format() },
      },
    };
  }

  // App errors with statusCode
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        code: error.code,
        message: error.message,
      },
    };
  }

  // Legacy booking coupon error (should be refactored to AppError)
  if (error instanceof InvalidBookingCouponError) {
    return {
      status: 400,
      body: {
        code: 'INVALID_COUPON',
        message: error.message,
      },
    };
  }

  // Unknown errors - log and return generic message
  console.error('Unhandled error:', error);
  return {
    status: 500,
    body: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
    },
  };
}
