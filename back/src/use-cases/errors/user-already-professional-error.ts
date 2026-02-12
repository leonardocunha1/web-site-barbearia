import { ConflictError } from './app-error';

export class UserAlreadyProfessionalError extends ConflictError {
  constructor() {
    super('Usuário já é um profissional', 'USER_ALREADY_PROFESSIONAL');
  }
}
