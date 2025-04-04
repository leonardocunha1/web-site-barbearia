import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUserUseCase } from './register';
import { InsufficientPermissionsError } from './errors/insufficient-permissions-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(usersRepository);
  });

  it('deve cadastrar um novo usuário', async () => {
    const { user } = await sut.execute({
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('joao@example.com');
  });

  it('não deve permitir cadastrar com email já existente', async () => {
    await sut.execute({
      nome: 'Maria',
      email: 'maria@example.com',
      senha: '123456',
    });

    await expect(() =>
      sut.execute({
        nome: 'Maria 2',
        email: 'maria@example.com',
        senha: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('não deve permitir criar ADMIN ou PROFISSIONAL se não for ADMIN', async () => {
    await expect(() =>
      sut.execute({
        nome: 'Hacker',
        email: 'admin-fake@example.com',
        senha: '123456',
        role: 'ADMIN',
        requestRole: 'CLIENTE',
      })
    ).rejects.toBeInstanceOf(InsufficientPermissionsError);
  });

  it('deve permitir ADMIN criar outro ADMIN', async () => {
    const { user } = await sut.execute({
      nome: 'Admin Master',
      email: 'admin@example.com',
      senha: '123456',
      role: 'ADMIN',
      requestRole: 'ADMIN',
    });

    expect(user.role).toBe('ADMIN');
  });
});
