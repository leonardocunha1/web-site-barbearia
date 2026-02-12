import { BadRequestError } from './app-error';

export class PastDateError extends BadRequestError {
  constructor() {
    super('Não é possível cadastrar feriados para datas passadas', 'PAST_DATE');
  }
}
