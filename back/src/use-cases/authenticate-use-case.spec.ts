import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from '@/use-cases/authenticate-use-case';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { EmailNotVerifiedError } from './errors/user-email-not-verified-error';
import { InactiveUserError } from './errors/inactive-user-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('deve ser possível logar com email verificado', async () => {
    const userData = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: await hash('123456', 6),
      telefone: null,
      role: 'CLIENTE' as const,
      emailVerified: new Date(),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersRepository.create(userData);

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      senha: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('não deve ser possível autenticar com e-mail errado/inexistente', async () => {
    await expect(() =>
      sut.execute({
        email: 'nonexistent@example.com',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('não deve ser possível autenticar com senha errada', async () => {
    await usersRepository.create({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: await hash('123456', 6),
      telefone: null,
      role: 'CLIENTE' as const,
      emailVerified: new Date(),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        senha: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('não deve ser possível autenticar com uma conta inativa', async () => {
    await usersRepository.create({
      nome: 'Inactive User',
      email: 'inactive@example.com',
      senha: await hash('123456', 6),
      telefone: null,
      role: 'CLIENTE' as const,
      emailVerified: new Date(),
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(() =>
      sut.execute({
        email: 'inactive@example.com',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(InactiveUserError);
  });

  it('não deve ser possível autenticar com uma conta sem email verificado', async () => {
    await usersRepository.create({
      nome: 'Unverified User',
      email: 'unverified@example.com',
      senha: await hash('123456', 6),
      telefone: null,
      role: 'CLIENTE' as const,
      emailVerified: null,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(() =>
      sut.execute({
        email: 'unverified@example.com',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailNotVerifiedError);
  });
});
