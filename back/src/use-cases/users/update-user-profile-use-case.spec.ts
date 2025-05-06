import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateUserProfileUseCase } from './update-user-profile-use-case';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { EmailAlreadyExistsError } from '../errors/user-email-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let updateUserProfileUseCase: UpdateUserProfileUseCase;

describe('UpdateUserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    updateUserProfileUseCase = new UpdateUserProfileUseCase(usersRepository);
  });

  it('deve atualizar o nome, email e telefone com sucesso', async () => {
    const user = await usersRepository.create({
      nome: 'Maria',
      email: 'maria@example.com',
      senha: '123456',
      role: 'CLIENTE',
    });

    const { user: updatedUser } = await updateUserProfileUseCase.execute({
      userId: user.id,
      nome: 'Maria Clara',
      email: 'mariaclara@example.com',
      telefone: '11999999999',
    });

    expect(updatedUser.nome).toBe('Maria Clara');
    expect(updatedUser.email).toBe('mariaclara@example.com');
    expect(updatedUser.telefone).toBe('11999999999');
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: 'inexistente',
        nome: 'Novo Nome',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro se o email for o mesmo do atual', async () => {
    const user = await usersRepository.create({
      nome: 'João',
      email: 'joao@example.com',
      senha: '123456',
      role: 'CLIENTE',
    });

    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: user.id,
        email: 'joao@example.com',
      }),
    ).rejects.toBeInstanceOf(InvalidDataError);
  });

  it('deve lançar erro se o novo email já estiver em uso por outro usuário', async () => {
    await usersRepository.create({
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '123456',
      role: 'CLIENTE',
    });

    const user2 = await usersRepository.create({
      nome: 'Beatriz',
      email: 'bea@example.com',
      senha: '123456',
      role: 'CLIENTE',
    });

    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: user2.id,
        email: 'ana@example.com',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
