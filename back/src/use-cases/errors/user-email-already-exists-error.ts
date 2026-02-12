import { ConflictError } from './app-error';

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('O e-mail já está em uso', 'EMAIL_ALREADY_EXISTS');
  }
}
