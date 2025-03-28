import { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import type { User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface RegisterUseCaseRequest {
  nome: string;
  email: string;
  senha: string;
  role?: Role;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nome,
    email,
    senha,
    role = 'CLIENTE',
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const senha_hash = await bcrypt.hash(senha, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    if (role === 'ADMIN') {
      throw new Error('Somente administradores podem criar outros admins.');
    }

    const user = await this.usersRepository.create({
      nome,
      email,
      senha: senha_hash,
      role,
    });

    return { user };
  }
}
