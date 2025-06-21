import type { GetBookingsProfessional200BookingsItemItemsItemServiceProfessional } from "./getBookingsProfessional200BookingsItemItemsItemServiceProfessional";

export type GetBookingsProfessional200BookingsItemItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: GetBookingsProfessional200BookingsItemItemsItemServiceProfessional;
};
