import type { ListUserBookingsSortDirection } from "./listUserBookingsSortDirection";
import type { ListUserBookingsStatus } from "./listUserBookingsStatus";
import type { ListUserBookingsSortItem } from "./listUserBookingsSortItem";

export type ListUserBookingsParams = {
  /**
   * Número da página atual (começa em 1)
   * @minimum 0
   * @exclusiveMinimum
   */
  page?: number;
  /**
   * Quantidade de itens por página (máximo 100)
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit?: number;
  /**
   * Campo para ordenação (opcional)
   */
  sortBy?: string;
  /**
   * Direção da ordenação: asc (crescente) ou desc (decrescente)
   */
  sortDirection?: ListUserBookingsSortDirection;
  startDate?: string;
  endDate?: string;
  status?: ListUserBookingsStatus;
  sort?: ListUserBookingsSortItem[];
};
