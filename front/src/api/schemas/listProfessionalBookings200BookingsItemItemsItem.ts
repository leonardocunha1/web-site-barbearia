import type { ListProfessionalBookings200BookingsItemItemsItemServiceProfessional } from "./listProfessionalBookings200BookingsItemItemsItemServiceProfessional";

/**
 * Item de agendamento
 */
export type ListProfessionalBookings200BookingsItemItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: ListProfessionalBookings200BookingsItemItemsItemServiceProfessional;
};
