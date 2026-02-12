/**
 * Status do agendamento
 */
export type GetProfessionalDashboard200NextAppointmentsItemStatus =
  (typeof GetProfessionalDashboard200NextAppointmentsItemStatus)[keyof typeof GetProfessionalDashboard200NextAppointmentsItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetProfessionalDashboard200NextAppointmentsItemStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
} as const;
