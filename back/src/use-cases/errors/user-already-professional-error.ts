export class UserAlreadyProfessionalError extends Error {
  constructor() {
    super('Usuário já é um profissional');
    this.name = 'UserAlreadyProfessionalError';
  }
}
