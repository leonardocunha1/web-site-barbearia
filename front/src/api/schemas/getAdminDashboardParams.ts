import type { GetAdminDashboardRange } from "./getAdminDashboardRange";

export type GetAdminDashboardParams = {
  /**
   * Período de tempo para análise
   */
  range?: GetAdminDashboardRange;
  /**
   * Data de início personalizada (obrigatória para período custom)
   */
  startDate?: string;
  /**
   * Data de término personalizada (obrigatória para período custom)
   */
  endDate?: string;
};
