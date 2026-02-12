import { BadRequestError } from './app-error';

export class InvalidPageRangeError extends BadRequestError {
  constructor(message = 'A página solicitada está fora do intervalo permitido.') {
    super(message, 'INVALID_PAGE_RANGE');
  }
}
