import { ConflictError } from './app-error';

export class ServiceAlreadyAddedError extends ConflictError {
  constructor() {
    super('Esse serviço já foi adicionado ao profissional.', 'SERVICE_ALREADY_ADDED');
  }
}
