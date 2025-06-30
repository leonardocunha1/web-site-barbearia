export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail e/ou Telefone já cadastrado.');
  }
}
