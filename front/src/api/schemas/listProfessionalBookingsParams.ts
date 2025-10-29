import type { ListProfessionalBookingsSortDirection } from "./listProfessionalBookingsSortDirection";
import type { ListProfessionalBookingsStatus } from "./listProfessionalBookingsStatus";
import type { ListProfessionalBookingsSortItem } from "./listProfessionalBookingsSortItem";

export type ListProfessionalBookingsParams = {
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
  sortDirection?: ListProfessionalBookingsSortDirection;
  startDate?: string;
  endDate?: string;
  status?: ListProfessionalBookingsStatus;
  sort?: ListProfessionalBookingsSortItem[];
};
