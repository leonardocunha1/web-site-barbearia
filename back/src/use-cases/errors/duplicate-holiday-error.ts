import { ConflictError } from './app-error';

export class DuplicateHolidayError extends ConflictError {
  constructor() {
    super('Já existe um feriado cadastrado para esta data', 'DUPLICATE_HOLIDAY');
  }
}
