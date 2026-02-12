import { BadRequestError } from './app-error';

export class PastHolidayDeletionError extends BadRequestError {
  constructor() {
    super('Não é possível deletar feriados passados', 'PAST_HOLIDAY_DELETION');
  }
}
