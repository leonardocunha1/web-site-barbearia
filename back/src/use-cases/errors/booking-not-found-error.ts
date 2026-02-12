import { NotFoundError } from './app-error';

export class BookingNotFoundError extends NotFoundError {
  constructor() {
    super('Reserva não encontrada', 'BOOKING_NOT_FOUND');
  }
}
