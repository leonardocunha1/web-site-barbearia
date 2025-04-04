import { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import type { User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { InsufficientPermissionsError } from './errors/insufficient-permissions-error';

interface RegisterUserRequest {
  nome: string;
  email: string;
  senha: string;
  role?: Role;
  requestRole?: Role; // Papel do usuário que está fazendo a requisição
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nome,
    email,
    senha,
    role = 'CLIENTE',
    requestRole,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Validação de permissões
    if ((role === 'ADMIN' || role === 'PROFISSIONAL') && requestRole !== 'ADMIN') {
      throw new InsufficientPermissionsError();
    }

    // Validação de email existente
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    // Criptografia da senha
    const senha_hash = await bcrypt.hash(senha, 6);

    // Criação do usuário
    const user = await this.usersRepository.create({
      nome,
      email,
      senha: senha_hash,
      role,
    });

    return { user };
  }
}