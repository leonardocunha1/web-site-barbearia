export class UserEmailAlreadyVerifiedError extends Error {
  constructor() {
    super('E-mail já verificado');
  }
}
