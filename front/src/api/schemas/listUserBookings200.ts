import type { ListUserBookings200BookingsItem } from "./listUserBookings200BookingsItem";

/**
 * Resposta paginada de agendamentos
 */
export type ListUserBookings200 = {
  bookings: ListUserBookings200BookingsItem[];
  /** @minimum 0 */
  total: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  page: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  limit: number;
  /** @minimum 0 */
  totalPages: number;
};
