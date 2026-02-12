import { BadRequestError } from './app-error';

export class InvalidDataError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_DATA');
  }
}
