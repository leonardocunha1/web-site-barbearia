import { ForbiddenError } from './app-error';

export class InsufficientPermissionsError extends ForbiddenError {
  constructor() {
    super(
      'Apenas administradores podem criar usuários do tipo ADMIN ou PROFISSIONAL.',
      'INSUFFICIENT_PERMISSIONS',
    );
  }
}
