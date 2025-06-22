import type { CreateBookingBodyServicesItem } from "./createBookingBodyServicesItem";

/**
 * CreateBookingBody
 */
export type CreateBookingBody = {
  professionalId: string;
  services: CreateBookingBodyServicesItem[];
  startDateTime: string;
  /** @maxLength 500 */
  notes?: string;
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
