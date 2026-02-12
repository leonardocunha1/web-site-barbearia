import { UnauthorizedError } from './app-error';

export class InvalidTokenError extends UnauthorizedError {
  constructor() {
    super('Token inválido ou expirado', 'INVALID_TOKEN');
  }
}
