import type { GetBookingById200BookingStatus } from "./getBookingById200BookingStatus";
import type { GetBookingById200BookingProfessional } from "./getBookingById200BookingProfessional";
import type { GetBookingById200BookingUser } from "./getBookingById200BookingUser";
import type { GetBookingById200BookingItemsItem } from "./getBookingById200BookingItemsItem";

/**
 * Agendamento completo
 */
export type GetBookingById200Booking = {
  id: string;
  userId: string;
  startDateTime: string;
  endDateTime: string;
  status: GetBookingById200BookingStatus;
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
  professional: GetBookingById200BookingProfessional;
  user: GetBookingById200BookingUser;
  /** @minItems 1 */
  items: GetBookingById200BookingItemsItem[];
};
