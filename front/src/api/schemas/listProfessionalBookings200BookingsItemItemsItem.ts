import type { ListProfessionalBookings200BookingsItemItemsItemServiceProfessional } from "./listProfessionalBookings200BookingsItemItemsItemServiceProfessional";

/**
 * Item de agendamento
 */
export type ListProfessionalBookings200BookingsItemItemsItem = {
  id: string;
  /** @minimum 0 */
  duration: number;
  /** @minimum 0 */
  price: number;
  serviceProfessional: ListProfessionalBookings200BookingsItemItemsItemServiceProfessional;
};
