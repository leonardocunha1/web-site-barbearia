import type { UpdateBookingStatusBodyStatus } from "./updateBookingStatusBodyStatus";

/**
 * Dados para atualização de status de agendamento
 */
export type UpdateBookingStatusBody = {
  status: UpdateBookingStatusBodyStatus;
  /** @maxLength 255 */
  reason?: string;
};
