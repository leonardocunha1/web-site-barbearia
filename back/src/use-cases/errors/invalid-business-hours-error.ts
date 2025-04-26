export class InvalidBusinessHoursError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBusinessHoursError';
  }
}
