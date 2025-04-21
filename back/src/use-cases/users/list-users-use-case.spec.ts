import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { ListUsersUseCase } from './list-users-use-case';

let usersRepository: InMemoryUsersRepository;
let sut: ListUsersUseCase;

describe('Caso de Uso: Listar Usuários', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListUsersUseCase(usersRepository);
  });

  it('deve listar todos os usuários com paginação padrão', async () => {
    // Cria 15 usuários de teste
    for (let i = 1; i <= 15; i++) {
      await usersRepository.create({
        nome: `User ${i}`,
        email: `user${i}@example.com`,
        senha: 'password',
        role: i % 2 === 0 ? 'CLIENTE' : 'PROFISSIONAL',
      });
    }

    const result = await sut.execute({});

    expect(result.users.length).toBe(10); // Limite padrão
    expect(result.total).toBe(15);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(2);
  });

  it('deve filtrar usuários por role', async () => {
    // Cria usuários com roles diferentes
    await usersRepository.create({
      nome: 'Professional',
      email: 'pro@example.com',
      senha: 'password',
      role: 'PROFISSIONAL',
    });
    await usersRepository.create({
      nome: 'Client',
      email: 'client@example.com',
      senha: 'password',
      role: 'CLIENTE',
    });

    const result = await sut.execute({ role: 'PROFISSIONAL' });

    expect(result.total).toBe(1);
    expect(result.users[0].role).toBe('PROFISSIONAL');
  });

  it('deve filtrar usuários por nome', async () => {
    await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: 'password',
    });
    await usersRepository.create({
      nome: 'Jane Smith',
      email: 'jane@example.com',
      senha: 'password',
    });

    const result = await sut.execute({ name: 'John' });

    expect(result.total).toBe(1);
    expect(result.users[0].nome).toBe('John Doe');
  });

  it('deve retornar paginação personalizada', async () => {
    // Cria 5 usuários de teste
    for (let i = 1; i <= 5; i++) {
      await usersRepository.create({
        nome: `User ${i}`,
        email: `user${i}@example.com`,
        senha: 'password',
      });
    }

    const result = await sut.execute({ page: 2, limit: 2 });

    expect(result.users.length).toBe(2);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it('deve retornar lista vazia quando não houver usuários', async () => {
    const result = await sut.execute({});

    expect(result.users.length).toBe(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('deve converter os usuários para DTO', async () => {
    await usersRepository.create({
      nome: 'Test User',
      email: 'test@example.com',
      senha: 'password',
      telefone: '11999999999',
      role: 'ADMIN',
      emailVerified: true,
    });

    const result = await sut.execute({});

    expect(result.users[0]).toEqual({
      id: expect.any(String),
      nome: 'Test User',
      email: 'test@example.com',
      telefone: '11999999999',
      role: 'ADMIN',
      emailVerified: true,
      active: true,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    // Verifica que a senha não está incluída no DTO
    expect(result.users[0]).not.toHaveProperty('senha');
  });
});
