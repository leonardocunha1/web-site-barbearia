import type { ListProfessionalBookingsSortOrder } from "./listProfessionalBookingsSortOrder";
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
  sortOrder?: ListProfessionalBookingsSortOrder;
  startDate?: string;
  endDate?: string;
  status?: ListProfessionalBookingsStatus;
  sort?: ListProfessionalBookingsSortItem[];
};
