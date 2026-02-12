import { BadRequestError } from './app-error';

export class InvalidQueryError extends BadRequestError {
  constructor(message = 'A pesquisa deve conter uma consulta válida.') {
    super(message, 'INVALID_QUERY');
  }
}
