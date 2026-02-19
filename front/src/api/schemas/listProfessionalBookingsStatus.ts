export type ListProfessionalBookingsStatus =
  (typeof ListProfessionalBookingsStatus)[keyof typeof ListProfessionalBookingsStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
} as const;
