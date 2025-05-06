import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ListUsersUseCase } from './list-users-use-case';
import { UsersRepository } from '@/repositories/users-repository';
import { Role, User } from '@prisma/client';
import { ListUsersResponse } from '@/dtos/user-dto';
import { createMockUsersRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockUsersRepository = UsersRepository & {
  listUsers: ReturnType<typeof vi.fn>;
  countUsers: ReturnType<typeof vi.fn>;
};

describe('ListUsersUseCase', () => {
  let usersRepository: MockUsersRepository;
  let sut: ListUsersUseCase;

  beforeEach(() => {
    usersRepository = createMockUsersRepository();

    sut = new ListUsersUseCase(usersRepository);
  });

  it('deve listar usuários com paginação padrão', async () => {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashed-password',
        telefone: '123456789',
        role: Role.CLIENTE,
        emailVerified: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        nome: 'Jane Smith',
        email: 'jane@example.com',
        senha: 'hashed-password',
        telefone: '987654321',
        role: Role.CLIENTE,
        emailVerified: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const expectedResponse: ListUsersResponse = {
      users: mockUsers,
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    };

    usersRepository.listUsers.mockResolvedValue(mockUsers);
    usersRepository.countUsers.mockResolvedValue(2);

    const result = await sut.execute({});

    expect(result).toEqual(expectedResponse);
    expect(usersRepository.listUsers).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      role: undefined,
      name: undefined,
    });
    expect(usersRepository.countUsers).toHaveBeenCalledWith({
      role: undefined,
      name: undefined,
    });
  });

  it('deve listar usuários com paginação personalizada', async () => {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashed-password',
        telefone: '123456789',
        role: Role.CLIENTE,
        emailVerified: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const expectedResponse: ListUsersResponse = {
      users: mockUsers,
      page: 2,
      limit: 5,
      total: 6,
      totalPages: 2,
    };

    usersRepository.listUsers.mockResolvedValue(mockUsers);
    usersRepository.countUsers.mockResolvedValue(6);

    const result = await sut.execute({ page: 2, limit: 5 });

    expect(result).toEqual(expectedResponse);
    expect(usersRepository.listUsers).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      role: undefined,
      name: undefined,
    });
  });

  it('deve filtrar usuários por role', async () => {
    const mockUsers: User[] = [
      {
        id: 'admin-1',
        nome: 'Admin User',
        email: 'admin@example.com',
        senha: 'hashed-password',
        telefone: '111111111',
        role: Role.ADMIN,
        emailVerified: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    usersRepository.listUsers.mockResolvedValue(mockUsers);
    usersRepository.countUsers.mockResolvedValue(1);

    const result = await sut.execute({ role: Role.ADMIN });

    expect(result.users.length).toBe(1);
    expect(result.users[0].role).toBe(Role.ADMIN);
    expect(usersRepository.listUsers).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      role: Role.ADMIN,
      name: undefined,
    });
    expect(usersRepository.countUsers).toHaveBeenCalledWith({
      role: Role.ADMIN,
      name: undefined,
    });
  });

  it('deve filtrar usuários por nome', async () => {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashed-password',
        telefone: '123456789',
        role: Role.CLIENTE,
        emailVerified: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    usersRepository.listUsers.mockResolvedValue(mockUsers);
    usersRepository.countUsers.mockResolvedValue(1);

    const result = await sut.execute({ name: 'John' });

    expect(result.users.length).toBe(1);
    expect(result.users[0].nome).toBe('John Doe');
    expect(usersRepository.listUsers).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      role: undefined,
      name: 'John',
    });
    expect(usersRepository.countUsers).toHaveBeenCalledWith({
      role: undefined,
      name: 'John',
    });
  });

  it('deve calcular corretamente o total de páginas', async () => {
    usersRepository.listUsers.mockResolvedValue([]);
    usersRepository.countUsers.mockResolvedValue(25);

    const result = await sut.execute({ limit: 10 });

    expect(result.totalPages).toBe(3); // 25 / 10 = 2.5 → arredonda para 3
  });

  it('deve lançar erro se a paginação for inválida', async () => {
    await expect(sut.execute({ page: 0, limit: 10 })).rejects.toThrow();
    await expect(sut.execute({ page: 1, limit: 0 })).rejects.toThrow();
    await expect(sut.execute({ page: -1, limit: 10 })).rejects.toThrow();
    await expect(sut.execute({ page: 1, limit: -5 })).rejects.toThrow();
  });
});
