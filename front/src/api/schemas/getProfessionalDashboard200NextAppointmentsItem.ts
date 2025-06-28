import type { GetProfessionalDashboard200NextAppointmentsItemStatus } from "./getProfessionalDashboard200NextAppointmentsItemStatus";

/**
 * Próximo agendamento
 */
export type GetProfessionalDashboard200NextAppointmentsItem = {
  /** ID do agendamento */
  id: string;
  /** Data e hora do agendamento no formato ISO */
  date: string;
  /**
   * Nome do cliente
   * @minLength 2
   */
  clientName: string;
  /**
   * Serviço agendado
   * @minLength 3
   */
  service: string;
  /** Status do agendamento */
  status: GetProfessionalDashboard200NextAppointmentsItemStatus;
};
