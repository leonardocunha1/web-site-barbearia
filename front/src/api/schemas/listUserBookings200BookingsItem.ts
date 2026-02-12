import type { ListUserBookings200BookingsItemStatus } from "./listUserBookings200BookingsItemStatus";
import type { ListUserBookings200BookingsItemProfessional } from "./listUserBookings200BookingsItemProfessional";
import type { ListUserBookings200BookingsItemUser } from "./listUserBookings200BookingsItemUser";
import type { ListUserBookings200BookingsItemItemsItem } from "./listUserBookings200BookingsItemItemsItem";

/**
 * Agendamento completo
 */
export type ListUserBookings200BookingsItem = {
  id: string;
  userId: string;
  startDateTime: string;
  endDateTime: string;
  status: ListUserBookings200BookingsItemStatus;
  /**
   * @maxLength 500
   * @nullable
   */
  notes?: string | null;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  totalAmount?: number | null;
  /** @nullable */
  canceledAt?: string | null;
  /** @nullable */
  confirmedAt?: string | null;
  updatedAt: string;
  createdAt: string;
  professional: ListUserBookings200BookingsItemProfessional;
  user: ListUserBookings200BookingsItemUser;
  /** @minItems 1 */
  items: ListUserBookings200BookingsItemItemsItem[];
};
