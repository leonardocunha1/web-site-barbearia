import { UsersRepository } from '@/repositories/users-repository';
import type { Role } from '@prisma/client';
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

interface RegisterUserUseCaseProps {
  usersRepository: UsersRepository;
  sendVerificationEmail: (email: string) => Promise<void>;
}

export class RegisterUserUseCase {
  private usersRepository: UsersRepository;
  private sendVerificationEmail: (email: string) => Promise<void>;

  constructor({
    usersRepository,
    sendVerificationEmail,
  }: RegisterUserUseCaseProps) {
    this.usersRepository = usersRepository;
    this.sendVerificationEmail = sendVerificationEmail;
  }

  async execute({
    nome,
    email,
    senha,
    role = 'CLIENTE',
    requestRole,
  }: RegisterUserRequest): Promise<void> {
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

    await this.sendVerificationEmail(user.email);
  }
}
