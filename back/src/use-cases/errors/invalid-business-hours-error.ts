import { BadRequestError } from './app-error';

export class InvalidBusinessHoursError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_BUSINESS_HOURS');
  }
}
