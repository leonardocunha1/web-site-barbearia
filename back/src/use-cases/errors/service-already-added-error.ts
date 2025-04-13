export class ServiceAlreadyAddedError extends Error {
  constructor() {
    super('Service already added to professional');
    this.name = 'ServiceAlreadyAddedError';
  }
}
