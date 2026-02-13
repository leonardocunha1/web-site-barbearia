import type { PreviewBookingPriceBodyServicesItem } from "./previewBookingPriceBodyServicesItem";

/**
 * Dados para prévia de preço do agendamento
 */
export type PreviewBookingPriceBody = {
  professionalId: string;
  /** @minItems 1 */
  services: PreviewBookingPriceBodyServicesItem[];
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
