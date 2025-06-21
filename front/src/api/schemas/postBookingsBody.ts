import type { PostBookingsBodyServicesItem } from "./postBookingsBodyServicesItem";

export type PostBookingsBody = {
  professionalId: string;
  services: PostBookingsBodyServicesItem[];
  startDateTime: string;
  /** @maxLength 500 */
  notes?: string;
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
