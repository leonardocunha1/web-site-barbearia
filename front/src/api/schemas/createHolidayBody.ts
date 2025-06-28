import type { CreateHolidayBodyServicesItem } from "./createHolidayBodyServicesItem";

/**
 * Dados para criação de agendamento
 */
export type CreateHolidayBody = {
  professionalId: string;
  /** @minItems 1 */
  services: CreateHolidayBodyServicesItem[];
  startDateTime: string;
  /** @maxLength 500 */
  notes?: string;
  useBonusPoints?: boolean;
  /** @maxLength 50 */
  couponCode?: string;
};
