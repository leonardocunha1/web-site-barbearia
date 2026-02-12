import { NotFoundError } from './app-error';

export class ServiceProfessionalNotFoundError extends NotFoundError {
  constructor() {
    super('O serviço não está vinculado ao profissional.', 'SERVICE_PROFESSIONAL_NOT_FOUND');
  }
}
