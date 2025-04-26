export class DuplicateHolidayError extends Error {
  constructor() {
    super('Já existe um feriado cadastrado para esta data');
    this.name = 'DuplicateHolidayError';
  }
}
