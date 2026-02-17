/**
 * Status do agendamento
 */
export type GetProfessionalDashboard200NextAppointmentsItemStatus =
  (typeof GetProfessionalDashboard200NextAppointmentsItemStatus)[keyof typeof GetProfessionalDashboard200NextAppointmentsItemStatus];

 
export const GetProfessionalDashboard200NextAppointmentsItemStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
} as const;
