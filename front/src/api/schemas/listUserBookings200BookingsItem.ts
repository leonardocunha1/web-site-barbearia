import type { ListUserBookings200BookingsItemStatus } from "./listUserBookings200BookingsItemStatus";
import type { ListUserBookings200BookingsItemProfissional } from "./listUserBookings200BookingsItemProfissional";
import type { ListUserBookings200BookingsItemUser } from "./listUserBookings200BookingsItemUser";
import type { ListUserBookings200BookingsItemItemsItem } from "./listUserBookings200BookingsItemItemsItem";

/**
 * Booking
 */
export type ListUserBookings200BookingsItem = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: ListUserBookings200BookingsItemStatus;
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
  profissional: ListUserBookings200BookingsItemProfissional;
  user: ListUserBookings200BookingsItemUser;
  items: ListUserBookings200BookingsItemItemsItem[];
};
