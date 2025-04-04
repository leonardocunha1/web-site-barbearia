export class EmailNotVerifiedError extends Error {
  constructor() {
    super('E-mail não verificado');
  }
}