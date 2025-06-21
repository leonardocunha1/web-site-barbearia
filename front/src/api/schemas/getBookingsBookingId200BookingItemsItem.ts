import type { GetBookingsBookingId200BookingItemsItemServiceProfessional } from "./getBookingsBookingId200BookingItemsItemServiceProfessional";

export type GetBookingsBookingId200BookingItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: GetBookingsBookingId200BookingItemsItemServiceProfessional;
};
