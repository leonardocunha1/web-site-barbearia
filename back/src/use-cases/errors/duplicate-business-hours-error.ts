import { ConflictError } from './app-error';

export class DuplicateBusinessHoursError extends ConflictError {
  constructor() {
    super('Já existe um horário cadastrado para este dia', 'DUPLICATE_BUSINESS_HOURS');
  }
}
