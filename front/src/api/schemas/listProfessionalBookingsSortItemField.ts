/**
 * SortField
 */
export type ListProfessionalBookingsSortItemField =
  (typeof ListProfessionalBookingsSortItemField)[keyof typeof ListProfessionalBookingsSortItemField];

 
export const ListProfessionalBookingsSortItemField = {
  startDateTime: "startDateTime",
  PROFESSIONAL: "PROFESSIONAL",
  status: "status",
  totalAmount: "totalAmount",
} as const;
