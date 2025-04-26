export class InvalidHolidayDescriptionError extends Error {
  constructor() {
    super('O motivo do feriado deve ter entre 3 e 100 caracteres');
    this.name = 'InvalidHolidayDescriptionError';
  }
}
