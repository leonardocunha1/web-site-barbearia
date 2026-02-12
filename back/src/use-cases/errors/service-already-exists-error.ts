import { ConflictError } from './app-error';

export class ServiceAlreadyExistsError extends ConflictError {
  constructor() {
    super('Já existe um serviço com esse nome.', 'SERVICE_ALREADY_EXISTS');
  }
}
