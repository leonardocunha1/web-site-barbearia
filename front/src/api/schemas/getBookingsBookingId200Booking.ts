import type { GetBookingsBookingId200BookingStatus } from "./getBookingsBookingId200BookingStatus";
import type { GetBookingsBookingId200BookingProfissional } from "./getBookingsBookingId200BookingProfissional";
import type { GetBookingsBookingId200BookingUser } from "./getBookingsBookingId200BookingUser";
import type { GetBookingsBookingId200BookingItemsItem } from "./getBookingsBookingId200BookingItemsItem";

export type GetBookingsBookingId200Booking = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: GetBookingsBookingId200BookingStatus;
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
  profissional: GetBookingsBookingId200BookingProfissional;
  user: GetBookingsBookingId200BookingUser;
  items: GetBookingsBookingId200BookingItemsItem[];
};
