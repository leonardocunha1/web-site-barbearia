/**
 * SortField
 */
export type ListProfessionalBookingsSortItemField =
  (typeof ListProfessionalBookingsSortItemField)[keyof typeof ListProfessionalBookingsSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsSortItemField = {
  startDateTime: "startDateTime",
  PROFESSIONAL: "PROFESSIONAL",
  status: "status",
  totalAmount: "totalAmount",
} as const;
