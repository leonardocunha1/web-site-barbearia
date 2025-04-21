import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { EmailAlreadyExistsError } from '../errors/user-email-already-exists-error';
import { UserDTO } from '@/dtos/user-dto';

interface UpdateUserProfileUseCaseRequest {
  userId: string;
  nome?: string;
  email?: string;
  telefone?: string | null;
}

interface UpdateUserProfileUseCaseResponse {
  user: UserDTO;
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    nome,
    email,
    telefone,
  }: UpdateUserProfileUseCaseRequest): Promise<UpdateUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (email && email === user.email) {
      throw new InvalidDataError(
        'O email informado é o mesmo que o atual. Por favor, forneça um novo email.',
      );
    }

    if (email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);

      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new EmailAlreadyExistsError();
      }
    }

    const dataToUpdate: Partial<Pick<UserDTO, 'nome' | 'email' | 'telefone'>> =
      {};

    if (nome !== undefined) dataToUpdate.nome = nome;
    if (email !== undefined) dataToUpdate.email = email;
    if (telefone !== undefined) dataToUpdate.telefone = telefone;

    const updatedUser = await this.usersRepository.update(userId, dataToUpdate);

    const userWithoutPassword: UserDTO = {
      id: updatedUser.id,
      nome: updatedUser.nome,
      email: updatedUser.email,
      telefone: updatedUser.telefone,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
      active: updatedUser.active,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return { user: userWithoutPassword };
  }
}
