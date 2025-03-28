import { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface RegisterAdminUseCaseRequest {
  nome: string;
  email: string;
  senha: string;
}

interface RegisterAdminUseCaseResponse {
  user: User;
}

export class RegisterAdminUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nome,
    email,
    senha,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const senha_hash = await bcrypt.hash(senha, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      nome,
      email,
      senha: senha_hash,
      role: 'ADMIN',
    });

    return { user };
  }
}
