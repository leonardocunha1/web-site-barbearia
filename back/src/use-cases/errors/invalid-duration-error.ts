export class InvalidDurationError extends Error {
  constructor() {
    super('Service duration must be a positive number');
    this.name = 'InvalidDurationError';
  }
}
