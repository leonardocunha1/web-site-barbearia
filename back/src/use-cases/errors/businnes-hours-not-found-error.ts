export class BusinessHoursNotFoundError extends Error {
  constructor() {
    super('Horário de funcionamento não encontrado.');
  }
}
