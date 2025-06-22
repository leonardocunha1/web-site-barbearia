import type { GetProfessionalDashboard200Professional } from "./getProfessionalDashboard200Professional";
import type { GetProfessionalDashboard200Metrics } from "./getProfessionalDashboard200Metrics";
import type { GetProfessionalDashboard200NextAppointmentsItem } from "./getProfessionalDashboard200NextAppointmentsItem";

/**
 * Dashboard
 */
export type GetProfessionalDashboard200 = {
  /** Professional */
  professional: GetProfessionalDashboard200Professional;
  /** Metrics */
  metrics: GetProfessionalDashboard200Metrics;
  /** Lista dos próximos agendamentos */
  nextAppointments: GetProfessionalDashboard200NextAppointmentsItem[];
};
