export class UserAlreadyVerifiedError extends Error {
  constructor() {
    super('User email already verified');
    this.name = 'UserAlreadyVerifiedError';
  }
}