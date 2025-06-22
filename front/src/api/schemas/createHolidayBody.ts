import type { CreateHolidayBodyServicesItem } from "./createHolidayBodyServicesItem";

/**
 * CreateBookingBody
 */
export type CreateHolidayBody = {
  professionalId: string;
  services: CreateHolidayBodyServicesItem[];
  startDateTime: string;
  /** @maxLength 500 */
  notes?: string;
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
