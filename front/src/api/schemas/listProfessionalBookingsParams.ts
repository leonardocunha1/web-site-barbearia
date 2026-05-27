import type { ListProfessionalBookingsSortBy } from "./listProfessionalBookingsSortBy";
import type { ListProfessionalBookingsSortDirection } from "./listProfessionalBookingsSortDirection";
import type { ListProfessionalBookingsStatus } from "./listProfessionalBookingsStatus";
import type { ListProfessionalBookingsSortItem } from "./listProfessionalBookingsSortItem";

export type ListProfessionalBookingsParams = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  page?: number;
  /**
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit?: number;
  /**
   * Campo para ordenação
   */
  sortBy?: ListProfessionalBookingsSortBy;
  /**
   * Direção da ordenação
   */
  sortDirection?: ListProfessionalBookingsSortDirection;
  startDate?: string;
  endDate?: string;
  status?: ListProfessionalBookingsStatus;
  sort?: ListProfessionalBookingsSortItem[];
};
