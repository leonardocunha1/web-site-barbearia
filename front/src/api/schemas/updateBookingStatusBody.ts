import type { UpdateBookingStatusBodyStatus } from "./updateBookingStatusBodyStatus";

/**
 * UpdateBookingStatusBody
 */
export type UpdateBookingStatusBody = {
  status: UpdateBookingStatusBodyStatus;
  /** @maxLength 255 */
  reason?: string;
};
