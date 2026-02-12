import { ConflictError } from './app-error';

export class UserAlreadyExistsError extends ConflictError {
  constructor() {
    super('E-mail e/ou Telefone já cadastrado.', 'USER_ALREADY_EXISTS');
  }
}
