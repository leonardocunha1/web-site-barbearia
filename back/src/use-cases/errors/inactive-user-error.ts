import { ForbiddenError } from './app-error';

export class InactiveUserError extends ForbiddenError {
  constructor() {
    super('A conta do usuário está inativa', 'INACTIVE_USER');
  }
}
