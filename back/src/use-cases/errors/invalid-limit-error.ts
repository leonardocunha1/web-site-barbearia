export class InvalidLimitError extends Error {
  constructor(message = 'O limite de resultados deve ser entre 1 e 100.') {
    super(message);
    this.name = 'InvalidLimitError';
  }
}
