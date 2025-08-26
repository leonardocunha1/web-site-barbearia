export class UserCannotBeProfessionalError extends Error {
  constructor() {
    super('Usuário administrador não pode ser profissional');
  }
}
