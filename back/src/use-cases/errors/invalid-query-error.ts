export class InvalidQueryError extends Error {
  constructor(message = 'A pesquisa deve conter uma consulta válida.') {
    super(message);
    this.name = 'InvalidQueryError';
  }
}
