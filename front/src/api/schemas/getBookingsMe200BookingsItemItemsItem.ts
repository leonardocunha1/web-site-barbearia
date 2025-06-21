import type { GetBookingsMe200BookingsItemItemsItemServiceProfessional } from "./getBookingsMe200BookingsItemItemsItemServiceProfessional";

export type GetBookingsMe200BookingsItemItemsItem = {
  id: string;
  /** @minimum 0 */
  duracao: number;
  /** @minimum 0 */
  preco: number;
  serviceProfessional: GetBookingsMe200BookingsItemItemsItemServiceProfessional;
};
