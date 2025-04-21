import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UpdatePasswordUseCase } from './update-password-use-case';
import { hash } from 'bcryptjs';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { SamePasswordError } from '../errors/same-password-error';

let usersRepository: InMemoryUsersRepository;
let sut: UpdatePasswordUseCase;

describe('UpdatePasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdatePasswordUseCase(usersRepository);
  });

  it('deve atualizar a senha com sucesso', async () => {
    const password = await hash('old-password', 6);
    const user = await usersRepository.create({
      nome: 'Usuário Teste',
      email: 'user@example.com',
      senha: password,
    });

    const response = await sut.execute({
      userId: user.id,
      currentPassword: 'old-password',
      newPassword: 'new-password',
    });

    expect(response.user.id).toBe(user.id);
    expect(response.user.email).toBe(user.email);

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.senha).not.toBe(password); // a senha foi alterada
  });

  it('deve lançar erro se o usuário não existir', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
        currentPassword: '123',
        newPassword: '456',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro se a senha atual estiver incorreta', async () => {
    const password = await hash('senha-correta', 6);
    const user = await usersRepository.create({
      nome: 'João',
      email: 'joao@email.com',
      senha: password,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        currentPassword: 'senha-errada',
        newPassword: 'nova-senha',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('deve lançar erro se a nova senha for igual à antiga', async () => {
    const password = await hash('mesma-senha', 6);
    const user = await usersRepository.create({
      nome: 'Maria',
      email: 'maria@email.com',
      senha: password,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        currentPassword: 'mesma-senha',
        newPassword: 'mesma-senha',
      }),
    ).rejects.toBeInstanceOf(SamePasswordError);
  });
});
