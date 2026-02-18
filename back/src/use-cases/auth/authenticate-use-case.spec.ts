import { describe, it, expect, beforeEach } from 'vitest';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { InactiveUserError } from '../errors/inactive-user-error';
import { EmailNotVerifiedError } from '../errors/user-email-not-verified-error';
import { createMockUsersRepository } from '@/mock/mock-users-repository';
import { createMockProfessionalsRepository } from '@/mock/mock-repositories';
import { AuthenticateUseCase } from './authenticate-use-case';
import bcrypt from 'bcryptjs';

describe('AuthenticateUseCase', () => {
  const { mockRepository, createMockUser } = createMockUsersRepository();
  const mockProfessionalsRepository = createMockProfessionalsRepository();

  let useCase: AuthenticateUseCase;

  beforeEach(() => {
    useCase = new AuthenticateUseCase(mockRepository, mockProfessionalsRepository);
  });

  it('should authenticate a valid user with correct credentials', async () => {
    const user = createMockUser({
      email: 'john@example.com',
      password: await bcrypt.hash('password', 6),
    });

    mockRepository.findByEmail.mockResolvedValue(user);

    const result = await useCase.execute({
      email: 'john@example.com',
      password: 'password',
    });

    expect(result.user.id).toBe(user.id);
    expect(result.user.name).toBe(user.name);
    expect(result.user.email).toBe(user.email);
    expect(result.user.role).toBe(user.role);
    expect(result.professionalId).toBeUndefined();
  });

  it('should throw InvalidCredentialsError when user does not exist', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'invalid@example.com', password: 'password' }),
    ).rejects.toThrowError(InvalidCredentialsError);
  });

  it('should throw EmailNotVerifiedError when email is not verified', async () => {
    const hashedPassword = await bcrypt.hash('password', 6);
    const user = createMockUser({ emailVerified: false, password: hashedPassword });
    mockRepository.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'john@example.com', password: 'password' }),
    ).rejects.toThrowError(EmailNotVerifiedError);
  });

  it('should throw InactiveUserError when user is inactive', async () => {
    const hashedPassword = await bcrypt.hash('password', 6);
    const user = createMockUser({ active: false, password: hashedPassword });
    mockRepository.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'john@example.com', password: 'password' }),
    ).rejects.toThrowError(InactiveUserError);
  });

  it('should throw InvalidCredentialsError when password is incorrect', async () => {
    const user = createMockUser({ password: 'hashed-password' });
    mockRepository.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({ email: 'john@example.com', password: 'wrong-password' }),
    ).rejects.toThrowError(InvalidCredentialsError);
  });

  it('should authenticate a professional and return professionalId', async () => {
    const hashedPassword = await bcrypt.hash('password', 6);
    const user = createMockUser({
      email: 'professional@example.com',
      password: hashedPassword,
      role: 'PROFESSIONAL',
    });

    const professional = {
      id: 'professional-123',
      userId: user.id,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.findByEmail.mockResolvedValue(user);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(professional);

    const result = await useCase.execute({
      email: 'professional@example.com',
      password: 'password',
    });

    expect(result.user.id).toBe(user.id);
    expect(result.user.role).toBe('PROFESSIONAL');
    expect(result.professionalId).toBe('professional-123');
    expect(mockProfessionalsRepository.findByUserId).toHaveBeenCalledWith(user.id);
  });

  it('should throw InactiveUserError when professional is inactive', async () => {
    const hashedPassword = await bcrypt.hash('password', 6);
    const user = createMockUser({
      email: 'professional@example.com',
      password: hashedPassword,
      role: 'PROFESSIONAL',
    });

    const professional = {
      id: 'professional-123',
      userId: user.id,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.findByEmail.mockResolvedValue(user);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(professional);

    await expect(
      useCase.execute({
        email: 'professional@example.com',
        password: 'password',
      }),
    ).rejects.toThrowError(InactiveUserError);
  });

  it('should throw InactiveUserError when professional does not exist', async () => {
    const hashedPassword = await bcrypt.hash('password', 6);
    const user = createMockUser({
      email: 'professional@example.com',
      password: hashedPassword,
      role: 'PROFESSIONAL',
    });

    mockRepository.findByEmail.mockResolvedValue(user);
    mockProfessionalsRepository.findByUserId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'professional@example.com',
        password: 'password',
      }),
    ).rejects.toThrowError(InactiveUserError);
  });
});
