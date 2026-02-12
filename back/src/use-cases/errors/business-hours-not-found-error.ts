import { NotFoundError } from './app-error';

export class BusinessHoursNotFoundError extends NotFoundError {
  constructor() {
    super('Horário de funcionamento não encontrado.', 'BUSINESS_HOURS_NOT_FOUND');
  }
}
