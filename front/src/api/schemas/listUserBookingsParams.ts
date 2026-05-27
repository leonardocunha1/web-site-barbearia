import type { ListUserBookingsSortBy } from "./listUserBookingsSortBy";
import type { ListUserBookingsSortDirection } from "./listUserBookingsSortDirection";
import type { ListUserBookingsStatus } from "./listUserBookingsStatus";
import type { ListUserBookingsSortItem } from "./listUserBookingsSortItem";

export type ListUserBookingsParams = {
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
  sortBy?: ListUserBookingsSortBy;
  /**
   * Direção da ordenação
   */
  sortDirection?: ListUserBookingsSortDirection;
  startDate?: string;
  endDate?: string;
  status?: ListUserBookingsStatus;
  sort?: ListUserBookingsSortItem[];
};
