// src/use-cases/authenticate.ts
import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { InactiveUserError } from './errors/inactive-user-error';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

interface AuthenticateRequest {
  email: string;
  senha: string;
}

interface AuthenticateResponse {
  user: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, senha }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    // verificando se o usuário existe
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // verificando se o usuário está ativo
    if (!user.active) {
      throw new InactiveUserError();
    }

    // verificando se a senha está correta
    const passwordMatches = await bcrypt.compare(senha, user.senha);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }
}