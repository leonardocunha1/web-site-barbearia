import type { PostHolidaysBodyServicesItem } from "./postHolidaysBodyServicesItem";

export type PostHolidaysBody = {
  professionalId: string;
  services: PostHolidaysBodyServicesItem[];
  startDateTime: string;
  /** @maxLength 500 */
  notes?: string;
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
