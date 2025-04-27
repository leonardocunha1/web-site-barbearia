export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('O e-mail já está em uso');
    this.name = 'EmailAlreadyExistsError';
  }
}
