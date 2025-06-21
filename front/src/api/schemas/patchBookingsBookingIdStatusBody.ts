import type { PatchBookingsBookingIdStatusBodyStatus } from "./patchBookingsBookingIdStatusBodyStatus";

export type PatchBookingsBookingIdStatusBody = {
  status: PatchBookingsBookingIdStatusBodyStatus;
  /** @maxLength 255 */
  reason?: string;
};
