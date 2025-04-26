export class PastHolidayDeletionError extends Error {
  constructor() {
    super('Não é possível deletar feriados passados');
    this.name = 'PastHolidayDeletionError';
  }
}
