export class InvalidDurationError extends Error {
  constructor() {
    super('O tempo de duração do serviço deve ser um número positivo.');
    this.name = 'InvalidDurationError';
  }
}
