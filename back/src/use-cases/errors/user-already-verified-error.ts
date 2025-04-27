export class UserAlreadyVerifiedError extends Error {
  constructor() {
    super('Usuário já verificado.');
    this.name = 'UserAlreadyVerifiedError';
  }
}
