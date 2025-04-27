export class ServiceProfessionalNotFoundError extends Error {
  constructor() {
    super('O serviço não está vinculado ao profissional.');
    this.name = 'ServiceProfessionalNotFoundError';
  }
}
