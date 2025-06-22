import type { ListProfessionalBookings200BookingsItem } from "./listProfessionalBookings200BookingsItem";

/**
 * PaginatedBookingResponse
 */
export type ListProfessionalBookings200 = {
  bookings: ListProfessionalBookings200BookingsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
