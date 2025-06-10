import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VerifyEmailUseCase } from './verify-email-use-case';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyVerifiedError } from '../errors/user-already-verified-error';
import { createMockUsersRepository } from '@/mock/mock-repositories';

const createMockVerificationTokensRepository = () => ({
  findByToken: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(),
});

describe('VerifyEmailUseCase', () => {
  let verifyEmailUseCase: VerifyEmailUseCase;
  let mockVerificationTokensRepository: ReturnType<
    typeof createMockVerificationTokensRepository
  >;
  let mockUsersRepository: ReturnType<typeof createMockUsersRepository>;

  const verificationToken = 'valid-token';
  const userId = 'user-id-123';

  beforeEach(() => {
    vi.clearAllMocks();

    mockVerificationTokensRepository = createMockVerificationTokensRepository();
    mockUsersRepository = createMockUsersRepository();

    verifyEmailUseCase = new VerifyEmailUseCase(
      mockVerificationTokensRepository,
      mockUsersRepository,
    );
  });

  it('deve verificar o e-mail com sucesso', async () => {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h no futuro

    mockVerificationTokensRepository.findByToken.mockResolvedValue({
      id: 'token-id',
      token: verificationToken,
      userId,
      expiresAt,
    });

    mockUsersRepository.findById.mockResolvedValue({
      id: userId,
      emailVerified: false,
    });

    await verifyEmailUseCase.execute({ verificationToken });

    expect(mockUsersRepository.update).toHaveBeenCalledWith(userId, {
      emailVerified: true,
    });

    expect(mockVerificationTokensRepository.delete).toHaveBeenCalledWith(
      'token-id',
    );
  });

  it('deve lançar erro se o token não for encontrado', async () => {
    mockVerificationTokensRepository.findByToken.mockResolvedValue(null);

    await expect(
      verifyEmailUseCase.execute({ verificationToken }),
    ).rejects.toThrow(InvalidTokenError);

    expect(mockUsersRepository.findById).not.toHaveBeenCalled();
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    mockVerificationTokensRepository.findByToken.mockResolvedValue({
      id: 'token-id',
      token: verificationToken,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(
      verifyEmailUseCase.execute({ verificationToken }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lançar erro se o usuário já estiver verificado', async () => {
    mockVerificationTokensRepository.findByToken.mockResolvedValue({
      id: 'token-id',
      token: verificationToken,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    mockUsersRepository.findById.mockResolvedValue({
      id: userId,
      emailVerified: true,
    });

    await expect(
      verifyEmailUseCase.execute({ verificationToken }),
    ).rejects.toThrow(UserAlreadyVerifiedError);
  });

  it('deve lançar erro se o token estiver expirado e deletar o token', async () => {
    const expiredDate = new Date(Date.now() - 1000 * 60 * 60); // 1h atrás

    mockVerificationTokensRepository.findByToken.mockResolvedValue({
      id: 'token-id',
      token: verificationToken,
      userId,
      expiresAt: expiredDate,
    });

    mockUsersRepository.findById.mockResolvedValue({
      id: userId,
      emailVerified: false,
    });

    await expect(
      verifyEmailUseCase.execute({ verificationToken }),
    ).rejects.toThrow(InvalidTokenError);

    expect(mockVerificationTokensRepository.delete).toHaveBeenCalledWith(
      'token-id',
    );
  });
});
