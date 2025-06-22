import type { GetProfessionalDashboardRange } from "./getProfessionalDashboardRange";

export type GetProfessionalDashboardParams = {
  /**
   * Time range for analytics
   */
  range: GetProfessionalDashboardRange;
  /**
   * Custom start date (required for custom range)
   */
  startDate?: string;
  /**
   * Custom end date (required for custom range)
   */
  endDate?: string;
};
