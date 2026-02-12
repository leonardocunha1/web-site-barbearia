import { BadRequestError } from './app-error';

export class InvalidBookingStatusError extends BadRequestError {
  constructor(currentStatus: string, requiredStatus: string) {
    super(
      `A reserva não pode ser atualizada de ${currentStatus} para ${requiredStatus}`,
      'INVALID_BOOKING_STATUS',
    );
  }
}
