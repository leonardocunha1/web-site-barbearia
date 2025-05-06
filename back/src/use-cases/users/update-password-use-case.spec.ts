import { describe, it, expect, beforeEach } from 'vitest';
import { UpdatePasswordUseCase } from './update-password-use-case';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { SamePasswordError } from '../errors/same-password-error';
import bcrypt from 'bcryptjs';

let usersRepository: InMemoryUsersRepository;
let updatePasswordUseCase: UpdatePasswordUseCase;

describe('UpdatePasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    updatePasswordUseCase = new UpdatePasswordUseCase(usersRepository);
  });

  it('deve atualizar a senha com sucesso', async () => {
    const senhaOriginal = await bcrypt.hash('senha-atual', 6);
    const user = await usersRepository.create({
      nome: 'João',
      email: 'joao@example.com',
      senha: senhaOriginal,
      role: 'CLIENTE',
    });

    await updatePasswordUseCase.execute({
      userId: user.id,
      currentPassword: 'senha-atual',
      newPassword: 'nova-senha',
    });

    const updatedUser = await usersRepository.findById(user.id);
    const senhaAtualizadaCorreta = await bcrypt.compare(
      'nova-senha',
      updatedUser!.senha,
    );

    expect(senhaAtualizadaCorreta).toBe(true);
  });

  it('deve lançar erro se o usuário não existir', async () => {
    await expect(() =>
      updatePasswordUseCase.execute({
        userId: 'usuario-inexistente',
        currentPassword: 'qualquer',
        newPassword: 'nova',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro se a senha atual estiver incorreta', async () => {
    const senhaHash = await bcrypt.hash('senha-correta', 6);
    const user = await usersRepository.create({
      nome: 'Maria',
      email: 'maria@example.com',
      senha: senhaHash,
      role: 'CLIENTE',
    });

    await expect(() =>
      updatePasswordUseCase.execute({
        userId: user.id,
        currentPassword: 'senha-errada',
        newPassword: 'nova-senha',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('deve lançar erro se a nova senha for igual à senha atual', async () => {
    const senhaHash = await bcrypt.hash('mesma-senha', 6);
    const user = await usersRepository.create({
      nome: 'Carlos',
      email: 'carlos@example.com',
      senha: senhaHash,
      role: 'CLIENTE',
    });

    await expect(() =>
      updatePasswordUseCase.execute({
        userId: user.id,
        currentPassword: 'mesma-senha',
        newPassword: 'mesma-senha',
      }),
    ).rejects.toBeInstanceOf(SamePasswordError);
  });
});
