import { UnauthorizedError } from './app-error';

export class EmailNotVerifiedError extends UnauthorizedError {
  constructor() {
    super('E-mail não verificado', 'EMAIL_NOT_VERIFIED');
  }
}
