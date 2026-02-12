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

    if (role === 'CLIENT' && userId !== userIdToAnonymize) {
      throw new UsuarioTentandoPegarInformacoesDeOutro();
    }

    if (!userExists) {
      throw new UserNotFoundError();
    }

    await this.usersRepository.anonymize(userIdToAnonymize);
  }
}

