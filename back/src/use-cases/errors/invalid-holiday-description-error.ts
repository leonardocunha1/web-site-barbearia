import { BadRequestError } from './app-error';

export class InvalidHolidayDescriptionError extends BadRequestError {
  constructor() {
    super('O motivo do feriado deve ter entre 3 e 100 caracteres', 'INVALID_HOLIDAY_DESCRIPTION');
  }
}
