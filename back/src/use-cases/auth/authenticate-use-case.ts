import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { InactiveUserError } from "../errors/inactive-user-error";
import bcrypt from "bcryptjs";
import { EmailNotVerifiedError } from "../errors/user-email-not-verified-error";
import { User } from "@prisma/client";
import { ProfessionalsRepository } from "@/repositories/professionals-repository";

interface AuthenticateRequest {
  email: string;
  senha: string;
}

interface AuthenticateResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository
  ) {}

  async execute({
    email,
    senha,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    // verificando se o usuário existe
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verifica se o e-mail foi verificado (se emailVerified não é null)
    if (!user.emailVerified) {
      throw new EmailNotVerifiedError();
    }

    // verificando se o usuário está ativo
    if (!user.active) {
      throw new InactiveUserError();
    }

    // depois de validar o usuário
    if (user.role === "PROFISSIONAL") {
      const professional = await this.professionalsRepository.findByUserId(
        user.id
      );

      if (!professional?.ativo) {
        throw new InactiveUserError();
      }
    }

    // verificando se a senha está correta
    const passwordMatches = await bcrypt.compare(senha, user.senha);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
