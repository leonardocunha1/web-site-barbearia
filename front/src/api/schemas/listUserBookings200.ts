import type { ListUserBookings200BookingsItem } from "./listUserBookings200BookingsItem";

/**
 * PaginatedBookingResponse
 */
export type ListUserBookings200 = {
  bookings: ListUserBookings200BookingsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
