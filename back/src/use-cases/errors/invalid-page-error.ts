export class InvalidPageError extends Error {
  constructor(message = 'O número da página deve ser maior ou igual a 1.') {
    super(message);
    this.name = 'InvalidPageError';
  }
}
