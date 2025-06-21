import type { GetBookingsMeStatus } from "./getBookingsMeStatus";
import type { GetBookingsMeSortItem } from "./getBookingsMeSortItem";

export type GetBookingsMeParams = {
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
  startDate?: string;
  endDate?: string;
  status?: GetBookingsMeStatus;
  sort?: GetBookingsMeSortItem[];
};
