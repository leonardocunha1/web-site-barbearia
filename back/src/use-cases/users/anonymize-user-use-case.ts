import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';

export class AnonymizeUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

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

    if (role === 'CLIENTE' && userId !== userIdToAnonymize) {
      throw new UsuarioTentandoPegarInformacoesDeOutro();
    }

    if (!userExists) {
      throw new UserNotFoundError();
    }

    await this.usersRepository.anonymize(userIdToAnonymize);
  }
}
