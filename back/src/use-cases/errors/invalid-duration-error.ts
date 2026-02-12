import { BadRequestError } from './app-error';

export class InvalidDurationError extends BadRequestError {
  constructor() {
    super('O tempo de duração do serviço deve ser um número positivo.', 'INVALID_DURATION');
  }
}
