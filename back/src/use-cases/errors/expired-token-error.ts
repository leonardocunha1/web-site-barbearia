import { UnauthorizedError } from './app-error';

export class ExpiredTokenError extends UnauthorizedError {
  constructor() {
    super('Token de redefinição expirado', 'EXPIRED_TOKEN');
  }
}
