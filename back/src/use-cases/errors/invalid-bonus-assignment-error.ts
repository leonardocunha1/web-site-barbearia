import { BadRequestError } from './app-error';

export class InvalidBonusAssignmentError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_BONUS_ASSIGNMENT');
  }
}
