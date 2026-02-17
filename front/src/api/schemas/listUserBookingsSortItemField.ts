/**
 * SortField
 */
export type ListUserBookingsSortItemField =
  (typeof ListUserBookingsSortItemField)[keyof typeof ListUserBookingsSortItemField];

 
export const ListUserBookingsSortItemField = {
  startDateTime: "startDateTime",
  PROFESSIONAL: "PROFESSIONAL",
  status: "status",
  totalAmount: "totalAmount",
} as const;
