import { BadRequestError } from './app-error';

export class InvalidPageError extends BadRequestError {
  constructor(message = 'O número da página deve ser maior ou igual a 1.') {
    super(message, 'INVALID_PAGE');
  }
}
