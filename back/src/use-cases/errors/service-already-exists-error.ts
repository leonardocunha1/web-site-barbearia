export class ServiceAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um serviço com esse nome.');
  }
}
