import { ConflictError } from './app-error';

export class TimeSlotAlreadyBookedError extends ConflictError {
  constructor() {
    super('Este horário já está ocupado pelo profissional.', 'TIME_SLOT_ALREADY_BOOKED');
  }
}
