import type { GetBookingById200BookingStatus } from "./getBookingById200BookingStatus";
import type { GetBookingById200BookingProfissional } from "./getBookingById200BookingProfissional";
import type { GetBookingById200BookingUser } from "./getBookingById200BookingUser";
import type { GetBookingById200BookingItemsItem } from "./getBookingById200BookingItemsItem";

/**
 * Booking
 */
export type GetBookingById200Booking = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: GetBookingById200BookingStatus;
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
  profissional: GetBookingById200BookingProfissional;
  user: GetBookingById200BookingUser;
  items: GetBookingById200BookingItemsItem[];
};
