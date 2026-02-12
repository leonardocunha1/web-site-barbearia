import { NotFoundError } from './app-error';

export class ServiceNotFoundError extends NotFoundError {
  constructor() {
    super('Serviço não encontrado', 'SERVICE_NOT_FOUND');
  }
}
