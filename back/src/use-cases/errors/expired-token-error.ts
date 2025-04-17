export class ExpiredTokenError extends Error {
  constructor() {
    super('Token de redefinição expirado');
    this.name = 'ExpiredTokenError';
  }
}
