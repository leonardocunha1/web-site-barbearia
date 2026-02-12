import type { ListUserBookings200BookingsItemItemsItemServiceProfessional } from "./listUserBookings200BookingsItemItemsItemServiceProfessional";

/**
 * Item de agendamento
 */
export type ListUserBookings200BookingsItemItemsItem = {
  id: string;
  /** @minimum 0 */
  duration: number;
  /** @minimum 0 */
  price: number;
  serviceProfessional: ListUserBookings200BookingsItemItemsItemServiceProfessional;
};
