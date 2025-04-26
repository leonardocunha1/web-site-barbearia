export class PastDateError extends Error {
  constructor() {
    super('Não é possível cadastrar feriados para datas passadas');
    this.name = 'PastDateError';
  }
}
