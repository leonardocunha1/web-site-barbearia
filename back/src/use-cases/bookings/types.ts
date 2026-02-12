import { Status } from '@prisma/client';
import { BookingDTO } from '@/dtos/booking-dto';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { UpdateBookingStatusBody } from '@/schemas/bookings';

/**
 * Use-case request types - these extend HTTP schema types but use Date objects
 * instead of strings for internal business logic processing.
 */

export interface ListProfessionalBookingsUseCaseRequest {
  professionalId: string;
  page?: number;
  limit?: number;
  sort?: SortBookingSchema[];
  filters?: {
    status?: Status;
    startDate?: Date;
    endDate?: Date;
  };
}

/**
 * Paginated response following flat format pattern
 * Standard format: { [itemsKey]: T[], total, page, limit, totalPages }
 */
export interface ListProfessionalBookingsUseCaseResponse {
  bookings: BookingDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListBookingsUseCaseRequest {
  userId: string;
  page?: number;
  limit?: number;
  sort?: SortBookingSchema[];
  filters?: {
    status?: Status;
    startDate?: Date;
    endDate?: Date;
  };
}

/**
 * Paginated response following flat format pattern
 * Standard format: { [itemsKey]: T[], total, page, limit, totalPages }
 */
export interface ListBookingsUseCaseResponse {
  bookings: BookingDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Reuse schema type and extend with use-case specific fields
export interface UpdateBookingStatusUseCaseRequest extends UpdateBookingStatusBody {
  bookingId: string;
  professionalId: string;
}

export interface UpdateBookingStatusUseCaseResponse {
  booking: {
    id: string;
    status: Status;
    startDateTime: Date;
    endDateTime: Date;
    notes?: string;
  };
}
