import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';

export class AnonymizeUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userIdToAnonymize,
    userId,
    role,
  }: {
    userIdToAnonymize: string;
    userId: string;
    role: string;
  }): Promise<void> {
    const userExists = await this.usersRepository.findById(userIdToAnonymize);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    // Only CLIENTE (CLIENT) role users are restricted to anonymize only themselves
    if (role === 'CLIENTE' && userId !== userIdToAnonymize) {
      throw new UsuarioTentandoPegarInformacoesDeOutro();
    }

    await this.usersRepository.anonymize(userIdToAnonymize);
  }
}
