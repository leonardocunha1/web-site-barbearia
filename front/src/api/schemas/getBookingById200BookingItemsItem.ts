import type { GetBookingById200BookingItemsItemServiceProfessional } from "./getBookingById200BookingItemsItemServiceProfessional";

/**
 * BookingItem
 */
export type GetBookingById200BookingItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: GetBookingById200BookingItemsItemServiceProfessional;
};
