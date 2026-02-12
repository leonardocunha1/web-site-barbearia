/**
 * SortField
 */
export type ListUserBookingsSortItemField =
  (typeof ListUserBookingsSortItemField)[keyof typeof ListUserBookingsSortItemField];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListUserBookingsSortItemField = {
  startDateTime: "startDateTime",
  PROFESSIONAL: "PROFESSIONAL",
  status: "status",
  totalAmount: "totalAmount",
} as const;
