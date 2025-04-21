import { UsersRepository } from '@/repositories/users-repository';
import type { User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';

interface RegisterUserRequest {
  nome: string;
  email: string;
  senha: string;
  role?: Role;
  requestRole?: Role;
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private sendVerificationEmail?: (email: string) => Promise<void>,
  ) {}

  async execute({
    nome,
    email,
    senha,
    role = 'CLIENTE',
    requestRole,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    if (
      (role === 'ADMIN' || role === 'PROFISSIONAL') &&
      requestRole !== 'ADMIN'
    ) {
      throw new InsufficientPermissionsError();
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const senha_hash = await bcrypt.hash(senha, 6);

    const user = await this.usersRepository.create({
      nome,
      email,
      senha: senha_hash,
      role,
    });

    if (this.sendVerificationEmail) {
      await this.sendVerificationEmail(user.email);
    }

    return { user };
  }
}
