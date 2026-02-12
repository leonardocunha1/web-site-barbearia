import { BadRequestError } from './app-error';

export class InvalidTimeFormatError extends BadRequestError {
  constructor() {
    super('Formato de horário inválido. Use "HH:MM"', 'INVALID_TIME_FORMAT');
  }
}
