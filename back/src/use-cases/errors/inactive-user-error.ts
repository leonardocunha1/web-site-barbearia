export class InactiveUserError extends Error {
  constructor() {
    super('A conta do usuário está inativa');
    this.name = 'InactiveUserError';
  }
}
