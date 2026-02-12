import { BadRequestError } from './app-error';

export class InvalidUpdateError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_UPDATE');
  }
}
