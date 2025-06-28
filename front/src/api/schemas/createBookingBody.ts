import type { CreateBookingBodyServicesItem } from "./createBookingBodyServicesItem";

/**
 * Dados para criação de agendamento
 */
export type CreateBookingBody = {
  professionalId: string;
  /** @minItems 1 */
  services: CreateBookingBodyServicesItem[];
  startDateTime: string;
  /** @maxLength 500 */
  notes?: string;
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
