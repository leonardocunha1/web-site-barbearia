import type { GetBookingsProfessionalStatus } from "./getBookingsProfessionalStatus";
import type { GetBookingsProfessionalSortItem } from "./getBookingsProfessionalSortItem";

export type GetBookingsProfessionalParams = {
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
  status?: GetBookingsProfessionalStatus;
  sort?: GetBookingsProfessionalSortItem[];
};
