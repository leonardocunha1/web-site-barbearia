import type { GetProfessionalDashboard200Professional } from "./getProfessionalDashboard200Professional";
import type { GetProfessionalDashboard200Metrics } from "./getProfessionalDashboard200Metrics";
import type { GetProfessionalDashboard200NextAppointmentsItem } from "./getProfessionalDashboard200NextAppointmentsItem";

/**
 * Dados completos do dashboard
 */
export type GetProfessionalDashboard200 = {
  /** Dados do profissional */
  professional: GetProfessionalDashboard200Professional;
  /** Métricas do dashboard */
  metrics: GetProfessionalDashboard200Metrics;
  /**
   * Lista dos próximos agendamentos
   * @maxItems 10
   */
  nextAppointments: GetProfessionalDashboard200NextAppointmentsItem[];
};
