import { ConflictError } from './app-error';

export class UserAlreadyVerifiedError extends ConflictError {
  constructor() {
    super('Usuário já verificado.', 'USER_ALREADY_VERIFIED');
  }
}
