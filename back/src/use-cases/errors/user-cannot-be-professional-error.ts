import { ForbiddenError } from './app-error';

export class UserCannotBeProfessionalError extends ForbiddenError {
  constructor() {
    super('Usuário administrador não pode ser profissional', 'USER_CANNOT_BE_PROFESSIONAL');
  }
}
