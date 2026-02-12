import { NotFoundError } from './app-error';

export class ProfessionalNotFoundError extends NotFoundError {
  constructor() {
    super('Profissional não encontrado', 'PROFESSIONAL_NOT_FOUND');
  }
}
