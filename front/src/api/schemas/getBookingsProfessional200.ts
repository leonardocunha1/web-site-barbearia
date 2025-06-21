import type { GetBookingsProfessional200BookingsItem } from "./getBookingsProfessional200BookingsItem";

export type GetBookingsProfessional200 = {
  bookings: GetBookingsProfessional200BookingsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
