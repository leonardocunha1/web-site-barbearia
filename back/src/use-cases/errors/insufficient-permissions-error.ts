export class InsufficientPermissionsError extends Error {
  constructor() {
    super(
      'Apenas administradores podem criar usuários do tipo ADMIN ou PROFISSIONAL.',
    );
    this.name = 'InsufficientPermissionsError';
  }
}
