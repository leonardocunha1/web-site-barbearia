import { Holiday } from '@prisma/client';
import type { DeleteHolidayParams } from '@/schemas/holidays';

/**
 * Use-case types for holidays.
 * Note: CreateHolidayUseCaseRequest uses Date (not string) because the controller
 * converts the string from HTTP validation to a Date object for internal processing.
 */

export interface CreateHolidayUseCaseRequest {
  professionalId: string;
  date: Date;
  reason: string;
}

/**
 * Reuses schema validation type and extends with professional ID for authorization
 */
export interface DeleteHolidayUseCaseRequest extends DeleteHolidayParams {
  professionalId: string;
}

export interface ListHolidaysUseCaseRequest {
  professionalId: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated response following flat format pattern
 * Standard format: { [itemsKey]: T[], total, page, limit, totalPages }
 */
export interface ListHolidaysUseCaseResponse {
  holidays: Holiday[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
