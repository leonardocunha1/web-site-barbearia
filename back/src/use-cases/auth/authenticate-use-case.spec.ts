import { describe, it, expect } from 'vitest';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { InactiveUserError } from '../errors/inactive-user-error';
import { EmailNotVerifiedError } from '../errors/user-email-not-verified-error';
import { createMockUsersRepository } from '@/mock/mock-users-repository';
import { AuthenticateUseCase } from './authenticate-use-case';
import bcrypt from 'bcryptjs';

describe('AuthenticateUseCase', () => {
  const { mockRepository, createMockUser } = createMockUsersRepository();

  const useCase = new AuthenticateUseCase(mockRepository);

  it('should authenticate a valid user with correct credentials', async () => {
    const user = createMockUser({
      email: 'john@example.com',
      senha: await bcrypt.hash('password', 6),
    });

    mockRepository.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute({
      email: 'john@example.com',
      senha: 'password',
    });

    expect(result.user.id).toBe(user.id);
    expect(result.user.nome).toBe(user.nome);
    expect(result.user.email).toBe(user.email);
    expect(result.user.role).toBe(user.role);
  });

  it('should throw InvalidCredentialsError when user does not exist', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'invalid@example.com', senha: 'password' }),
    ).rejects.toThrowError(InvalidCredentialsError);
  });

  it('should throw EmailNotVerifiedError when email is not verified', async () => {
    const user = createMockUser({ emailVerified: false });
    mockRepository.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'john@example.com', senha: 'password' }),
    ).rejects.toThrowError(EmailNotVerifiedError);
  });

  it('should throw InactiveUserError when user is inactive', async () => {
    const user = createMockUser({ active: false });
    mockRepository.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'john@example.com', senha: 'password' }),
    ).rejects.toThrowError(InactiveUserError);
  });

  it('should throw InvalidCredentialsError when password is incorrect', async () => {
    const user = createMockUser({ senha: 'hashed-password' });
    mockRepository.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'john@example.com', senha: 'wrong-password' }),
    ).rejects.toThrowError(InvalidCredentialsError);
  });
});
