import type { GetBookingById200BookingItemsItemServiceProfessional } from "./getBookingById200BookingItemsItemServiceProfessional";

/**
 * Item de agendamento
 */
export type GetBookingById200BookingItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: GetBookingById200BookingItemsItemServiceProfessional;
};
