import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserDTO } from '@/dtos/user-dto';

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: UserDTO;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const userWithoutPassword: UserDTO = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      role: user.role,
      emailVerified: user.emailVerified,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userWithoutPassword };
  }
}
