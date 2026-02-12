import { BadRequestError } from './app-error';

export class InvalidDateTimeError extends BadRequestError {
  constructor() {
    super(' A data/hora de início não pode estar no passado.', 'INVALID_DATE_TIME');
  }
}
