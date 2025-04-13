export class ServiceProfessionalNotFoundError extends Error {
  constructor() {
    super('Service not linked to professional');
    this.name = 'ServiceProfessionalNotFoundError';
  }
}
