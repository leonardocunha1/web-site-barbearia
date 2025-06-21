import type { GetMeProfessionalDashboard200Professional } from "./getMeProfessionalDashboard200Professional";
import type { GetMeProfessionalDashboard200Metrics } from "./getMeProfessionalDashboard200Metrics";
import type { GetMeProfessionalDashboard200NextAppointmentsItem } from "./getMeProfessionalDashboard200NextAppointmentsItem";

export type GetMeProfessionalDashboard200 = {
  professional: GetMeProfessionalDashboard200Professional;
  metrics: GetMeProfessionalDashboard200Metrics;
  nextAppointments: GetMeProfessionalDashboard200NextAppointmentsItem[];
};
