import type { GetBookingsProfessional200BookingsItemStatus } from "./getBookingsProfessional200BookingsItemStatus";
import type { GetBookingsProfessional200BookingsItemProfissional } from "./getBookingsProfessional200BookingsItemProfissional";
import type { GetBookingsProfessional200BookingsItemUser } from "./getBookingsProfessional200BookingsItemUser";
import type { GetBookingsProfessional200BookingsItemItemsItem } from "./getBookingsProfessional200BookingsItemItemsItem";

export type GetBookingsProfessional200BookingsItem = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: GetBookingsProfessional200BookingsItemStatus;
  /** @nullable */
  observacoes?: string | null;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  valorFinal?: number | null;
  /** @nullable */
  canceledAt?: string | null;
  /** @nullable */
  confirmedAt?: string | null;
  updatedAt: string;
  createdAt: string;
  profissional: GetBookingsProfessional200BookingsItemProfissional;
  user: GetBookingsProfessional200BookingsItemUser;
  items: GetBookingsProfessional200BookingsItemItemsItem[];
};
