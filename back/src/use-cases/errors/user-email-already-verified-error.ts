import { ConflictError } from './app-error';

export class UserEmailAlreadyVerifiedError extends ConflictError {
  constructor() {
    super('E-mail já verificado', 'USER_EMAIL_ALREADY_VERIFIED');
  }
}
