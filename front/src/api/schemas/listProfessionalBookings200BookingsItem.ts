import type { ListProfessionalBookings200BookingsItemStatus } from "./listProfessionalBookings200BookingsItemStatus";
import type { ListProfessionalBookings200BookingsItemProfessional } from "./listProfessionalBookings200BookingsItemProfessional";
import type { ListProfessionalBookings200BookingsItemUser } from "./listProfessionalBookings200BookingsItemUser";
import type { ListProfessionalBookings200BookingsItemItemsItem } from "./listProfessionalBookings200BookingsItemItemsItem";

/**
 * Agendamento completo
 */
export type ListProfessionalBookings200BookingsItem = {
  id: string;
  userId: string;
  startDateTime: string;
  endDateTime: string;
  status: ListProfessionalBookings200BookingsItemStatus;
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
  professional: ListProfessionalBookings200BookingsItemProfessional;
  user: ListProfessionalBookings200BookingsItemUser;
  /** @minItems 1 */
  items: ListProfessionalBookings200BookingsItemItemsItem[];
};
