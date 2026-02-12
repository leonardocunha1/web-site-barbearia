import { NotFoundError } from './app-error';

export class HolidayNotFoundError extends NotFoundError {
  constructor() {
    super('Feriado não encontrado', 'HOLIDAY_NOT_FOUND');
  }
}
