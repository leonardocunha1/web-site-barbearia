export class HolidayNotFoundError extends Error {
  constructor() {
    super('Feriado não encontrado');
    this.name = 'HolidayNotFoundError';
  }
}
