import type { GetProfessionalDashboardRange } from "./getProfessionalDashboardRange";

export type GetProfessionalDashboardParams = {
  /**
   * Período de tempo para análise
   */
  range: GetProfessionalDashboardRange;
  /**
   * Data de início personalizada (obrigatória para período custom)
   */
  startDate?: string;
  /**
   * Data de término personalizada (obrigatória para período custom)
   */
  endDate?: string;
};
