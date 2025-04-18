import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';

export class AnonymizeUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<void> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    await this.usersRepository.anonymize(userId);
  }
}
