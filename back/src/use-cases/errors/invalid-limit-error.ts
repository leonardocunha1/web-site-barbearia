import { BadRequestError } from './app-error';

export class InvalidLimitError extends BadRequestError {
  constructor(message = 'O limite de resultados deve ser entre 1 e 100.') {
    super(message, 'INVALID_LIMIT');
  }
}
