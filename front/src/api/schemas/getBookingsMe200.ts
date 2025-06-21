import type { GetBookingsMe200BookingsItem } from "./getBookingsMe200BookingsItem";

export type GetBookingsMe200 = {
  bookings: GetBookingsMe200BookingsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
