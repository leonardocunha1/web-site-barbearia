import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { UserAlreadyVerifiedError } from '@/use-cases/errors/user-already-verified-error';
import { InMemoryVerificationTokensRepository } from '@/repositories/in-memory/in-memory-tokens-repository';
import { VerifyEmailUseCase } from './verify-email-use-case';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';

let usersRepository: InMemoryUsersRepository;
let tokensRepository: InMemoryVerificationTokensRepository;
let sut: VerifyEmailUseCase;

describe('VerifyEmailUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    tokensRepository = new InMemoryVerificationTokensRepository();
    sut = new VerifyEmailUseCase(tokensRepository, usersRepository);
  });

  it('deve verificar o e-mail com token válido dentro de 24h', async () => {
    const user = await usersRepository.create({
      id: 'user-1',
      nome: 'Jane Doe',
      email: 'jane@example.com',
      senha: 'hashed-password',
      telefone: null,
      role: 'CLIENTE',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tokensRepository.create(
      'valid-token',
      user.id,
      new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 horas no futuro
    );

    await sut.execute({ verificationToken: 'valid-token' });

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.emailVerified).toBeTruthy();
  });

  it('deve lançar erro se o token não existir', async () => {
    await expect(() =>
      sut.execute({ verificationToken: 'nonexistent-token' }),
    ).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    await tokensRepository.create(
      'orphan-token',
      'nonexistent-user-id',
      new Date(Date.now() + 1000 * 60 * 60),
    );

    await expect(() =>
      sut.execute({ verificationToken: 'orphan-token' }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro se o usuário já tiver o email verificado', async () => {
    const user = await usersRepository.create({
      id: 'user-2',
      nome: 'Already Verified',
      email: 'verified@example.com',
      senha: 'hashed-password',
      telefone: null,
      role: 'CLIENTE',
      emailVerified: true, // já verificado
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tokensRepository.create(
      'already-verified-token',
      user.id,
      new Date(Date.now() + 1000 * 60 * 60),
    );

    await expect(() =>
      sut.execute({ verificationToken: 'already-verified-token' }),
    ).rejects.toBeInstanceOf(UserAlreadyVerifiedError);
  });

  it('deve lançar erro se o token estiver expirado (mais de 24h)', async () => {
    const user = await usersRepository.create({
      id: 'user-3',
      nome: 'Expired Token User',
      email: 'expired@example.com',
      senha: 'hashed-password',
      telefone: null,
      role: 'CLIENTE',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const expiredDate = new Date(Date.now() - 1000 * 60 * 60 * 25); // 25h atrás

    await tokensRepository.create('expired-token', user.id, expiredDate);

    await expect(() =>
      sut.execute({ verificationToken: 'expired-token' }),
    ).rejects.toBeInstanceOf(InvalidTokenError);

    // Verifica se o token foi removido após expirar
    const tokenStillExists =
      await tokensRepository.findByToken('expired-token');
    expect(tokenStillExists).toBeNull();
  });
});
