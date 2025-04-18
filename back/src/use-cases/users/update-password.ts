import { compare, hash } from 'bcryptjs';
import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { SamePasswordError } from './errors/same-password-error';

interface UpdatePasswordUseCaseRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

interface UpdatePasswordUseCaseResponse {
  user: {
    id: string;
    email: string;
  };
}

export class UpdatePasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
  }: UpdatePasswordUseCaseRequest): Promise<UpdatePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new UserNotFoundError();

    const doesPasswordMatch = await compare(currentPassword, user.senha);
    if (!doesPasswordMatch) throw new InvalidCredentialsError();

    const isSamePassword = await compare(newPassword, user.senha);
    if (isSamePassword) throw new SamePasswordError();

    const hashedPassword = await hash(newPassword, 6);

    await this.usersRepository.updatePassword(userId, hashedPassword);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
