export class DuplicateBusinessHoursError extends Error {
  constructor() {
    super('Já existe um horário cadastrado para este dia');
    this.name = 'DuplicateBusinessHoursError';
  }
}
