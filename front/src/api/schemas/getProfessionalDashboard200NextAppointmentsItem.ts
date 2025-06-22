import type { GetProfessionalDashboard200NextAppointmentsItemStatus } from "./getProfessionalDashboard200NextAppointmentsItemStatus";

/**
 * NextAppointment
 */
export type GetProfessionalDashboard200NextAppointmentsItem = {
  /** ID do agendamento */
  id: string;
  /** Data e hora do agendamento no formato ISO */
  date: string;
  /** Nome do cliente */
  clientName: string;
  /** Serviço agendado */
  service: string;
  /** Status do agendamento */
  status: GetProfessionalDashboard200NextAppointmentsItemStatus;
};
