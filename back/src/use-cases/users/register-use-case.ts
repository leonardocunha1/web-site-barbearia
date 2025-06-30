import { UsersRepository } from '@/repositories/users-repository';
import type { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';

interface RegisterUserRequest {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
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
    telefone,
    role = 'CLIENTE',
    requestRole,
  }: RegisterUserRequest): Promise<void> {
    // Verificação de permissões
    if (
      (role === 'ADMIN' || role === 'PROFISSIONAL') &&
      requestRole !== 'ADMIN'
    ) {
      throw new InsufficientPermissionsError();
    }

    // Verifica se email já existe
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    // Verifica se telefone já existe
    const userWithSamePhone = await this.usersRepository.findByPhone(telefone);
    if (userWithSamePhone) {
      throw new UserAlreadyExistsError();
    }

    // Criptografa a senha
    const senha_hash = await bcrypt.hash(senha, 6);

    // Cria o usuário
    const user = await this.usersRepository.create({
      nome,
      email,
      senha: senha_hash,
      telefone, 
      role,
    });

    // Envia email de verificação
    await this.sendVerificationEmail(user.email);
    
    // Poderia adicionar aqui o envio de SMS de verificação se necessário
  }
}