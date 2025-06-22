import type { ListProfessionalBookings200BookingsItemStatus } from "./listProfessionalBookings200BookingsItemStatus";
import type { ListProfessionalBookings200BookingsItemProfissional } from "./listProfessionalBookings200BookingsItemProfissional";
import type { ListProfessionalBookings200BookingsItemUser } from "./listProfessionalBookings200BookingsItemUser";
import type { ListProfessionalBookings200BookingsItemItemsItem } from "./listProfessionalBookings200BookingsItemItemsItem";

/**
 * Booking
 */
export type ListProfessionalBookings200BookingsItem = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: ListProfessionalBookings200BookingsItemStatus;
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
  profissional: ListProfessionalBookings200BookingsItemProfissional;
  user: ListProfessionalBookings200BookingsItemUser;
  items: ListProfessionalBookings200BookingsItemItemsItem[];
};
