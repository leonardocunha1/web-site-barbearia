export class InvalidServicePriceDurationError extends Error {
  constructor() {
    super('O preço e a duração do serviço devem ser números positivos.');
    this.name = 'InvalidServicePriceDurationError';
  }
}
