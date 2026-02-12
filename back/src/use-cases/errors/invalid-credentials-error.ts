import { UnauthorizedError } from './app-error';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('E-mail e/ou senha inválidos.', 'INVALID_CREDENTIALS');
  }
}
