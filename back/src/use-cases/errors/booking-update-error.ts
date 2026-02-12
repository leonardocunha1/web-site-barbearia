import { BadRequestError } from './app-error';

export class BookingUpdateError extends BadRequestError {
  constructor(message: string) {
    super(message, 'BOOKING_UPDATE_ERROR');
  }
}
