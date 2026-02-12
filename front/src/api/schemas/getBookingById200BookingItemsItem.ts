import type { GetBookingById200BookingItemsItemServiceProfessional } from "./getBookingById200BookingItemsItemServiceProfessional";

/**
 * Item de agendamento
 */
export type GetBookingById200BookingItemsItem = {
  id: string;
  /** @minimum 0 */
  duration: number;
  /** @minimum 0 */
  price: number;
  serviceProfessional: GetBookingById200BookingItemsItemServiceProfessional;
};
