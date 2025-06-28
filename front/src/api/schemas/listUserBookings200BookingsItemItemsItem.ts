import type { ListUserBookings200BookingsItemItemsItemServiceProfessional } from "./listUserBookings200BookingsItemItemsItemServiceProfessional";

/**
 * Item de agendamento
 */
export type ListUserBookings200BookingsItemItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: ListUserBookings200BookingsItemItemsItemServiceProfessional;
};
