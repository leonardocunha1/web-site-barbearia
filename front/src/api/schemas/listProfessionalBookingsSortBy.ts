export type ListProfessionalBookingsSortBy =
  (typeof ListProfessionalBookingsSortBy)[keyof typeof ListProfessionalBookingsSortBy];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListProfessionalBookingsSortBy = {
  startDateTime: "startDateTime",
  totalAmount: "totalAmount",
} as const;
