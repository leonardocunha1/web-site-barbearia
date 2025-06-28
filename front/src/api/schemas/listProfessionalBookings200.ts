import type { ListProfessionalBookings200BookingsItem } from "./listProfessionalBookings200BookingsItem";

/**
 * Resposta paginada de agendamentos
 */
export type ListProfessionalBookings200 = {
  bookings: ListProfessionalBookings200BookingsItem[];
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
