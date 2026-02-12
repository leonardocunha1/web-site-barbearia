import { IUsersRepository } from '@/repositories/users-repository';
import type { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PASSWORD_HASH_ROUNDS } from '@/consts/const';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role;
  requestRole?: Role;
}

interface RegisterUserUseCaseProps {
  usersRepository: IUsersRepository;
  sendVerificationEmail: (email: string) => Promise<void>;
}
export class RegisterUserUseCase {
  private usersRepository: IUsersRepository;
  private sendVerificationEmail: (email: string) => Promise<void>;

  constructor({ usersRepository, sendVerificationEmail }: RegisterUserUseCaseProps) {
    this.usersRepository = usersRepository;
    this.sendVerificationEmail = sendVerificationEmail;
  }

  async execute({
    name,
    email,
    password,
    phone,
    role = 'CLIENT',
    requestRole,
  }: RegisterUserRequest): Promise<void> {
    // Fail-fast: validate all business rules before any operation
    this.validatePermissions(role, requestRole);
    await this.validateEmailNotInUse(email);
    await this.validatePhoneNotInUse(phone);

    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    await this.sendVerificationEmail(user.email);
  }

  /**
   * Validates if requester has permission to create user with specified role
   * @throws {InsufficientPermissionsError} If insufficient permissions
   */
  private validatePermissions(role: Role, requestRole?: Role): void {
    if ((role === 'ADMIN' || role === 'PROFESSIONAL') && requestRole !== 'ADMIN') {
      throw new InsufficientPermissionsError();
    }
  }

  /**
   * Validates that email is not already in use
   * @throws {UserAlreadyExistsError} If email already exists
   */
  private async validateEmailNotInUse(email: string): Promise<void> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
  }

  /**
   * Validates that phone is not already in use
   * @throws {UserAlreadyExistsError} If phone already exists
   */
  private async validatePhoneNotInUse(phone: string): Promise<void> {
    const userWithSamePhone = await this.usersRepository.findByPhone(phone);
    if (userWithSamePhone) {
      throw new UserAlreadyExistsError();
    }
  }

  /**
   * Hashes the password using bcrypt
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  }
}
