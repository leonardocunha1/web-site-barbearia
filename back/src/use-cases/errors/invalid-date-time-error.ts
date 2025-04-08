export class InvalidDateTimeError extends Error {
  constructor() {
    super('Start date/time cannot be in the past');
    this.name = 'InvalidDateTimeError';
  }
}
