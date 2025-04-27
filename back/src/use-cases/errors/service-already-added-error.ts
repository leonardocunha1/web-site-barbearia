export class ServiceAlreadyAddedError extends Error {
  constructor() {
    super('Esse serviço já foi adicionado ao profissional.');
    this.name = 'ServiceAlreadyAddedError';
  }
}
