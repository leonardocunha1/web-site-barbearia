import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { User } from '@prisma/client';
import { toProfessionalDTO } from '@/dtos/professional-dto';
import { ListProfessionalsUseCase } from './list-professionals-use-case';
import { beforeEach, describe, expect, it } from 'vitest';

describe('List Professionals Use Case', () => {
  let professionalsRepository: InMemoryProfessionalsRepository;
  let sut: ListProfessionalsUseCase;

  const testUser1: User = {
    id: 'user-1',
    nome: 'John Doe',
    email: 'john@example.com',
    senha: 'hashed-password',
    telefone: '123456789',
    role: 'PROFISSIONAL',
    emailVerified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const testUser2: User = {
    id: 'user-2',
    nome: 'Jane Smith',
    email: 'jane@example.com',
    senha: 'hashed-password',
    telefone: '987654321',
    role: 'PROFISSIONAL',
    emailVerified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const testUser3: User = {
    id: 'user-3',
    nome: 'Bob Barber',
    email: 'bob@example.com',
    senha: 'hashed-password',
    telefone: '111111111',
    role: 'PROFISSIONAL',
    emailVerified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new ListProfessionalsUseCase(professionalsRepository);

    professionalsRepository.addUser(testUser1);
    professionalsRepository.addUser(testUser2);
    professionalsRepository.addUser(testUser3);

    professionalsRepository.items.push(
      {
        id: 'professional-1',
        userId: 'user-1',
        especialidade: 'Cabelo',
        bio: 'Especialista em cabelos',
        avatarUrl: 'http://example.com/avatar1.jpg',
        documento: '123456',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'professional-2',
        userId: 'user-2',
        especialidade: 'Dermatologista',
        bio: 'Especialista em pele',
        avatarUrl: 'http://example.com/avatar2.jpg',
        documento: '654321',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'professional-3',
        userId: 'user-3',
        especialidade: 'Ortopedista',
        bio: 'Especialista em ossos',
        avatarUrl: 'http://example.com/avatar3.jpg',
        documento: '789012',
        ativo: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
  });

  it('should list all active professionals with pagination', async () => {
    const result = await sut.execute({ page: 1, limit: 2, ativo: true });

    expect(result.professionals).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
    expect(result.totalPages).toBe(1);

    expect(result.professionals[0]).toEqual(
      toProfessionalDTO({
        ...professionalsRepository.items[0],
        user: testUser1,
        services: [],
      }),
    );
    expect(result.professionals[1]).toEqual(
      toProfessionalDTO({
        ...professionalsRepository.items[1],
        user: testUser2,
        services: [],
      }),
    );
  });

  it('should filter professionals by specialty', async () => {
    const result = await sut.execute({ especialidade: 'Dermato' });

    expect(result.professionals).toHaveLength(1);
    expect(result.professionals[0].especialidade).toBe('Dermatologista');
  });

  it('should filter inactive professionals', async () => {
    const result = await sut.execute({ ativo: false });

    expect(result.professionals).toHaveLength(1);
    expect(result.professionals[0].especialidade).toBe('Ortopedista');
    expect(result.professionals[0].ativo).toBe(false);
  });

  it('should return empty list when no professionals match filters', async () => {
    const result = await sut.execute({ especialidade: 'Neurologista' });

    expect(result.professionals).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should handle pagination correctly', async () => {
    for (let i = 4; i <= 15; i++) {
      professionalsRepository.items.push({
        id: `professional-${i}`,
        userId: `user-${i}`,
        especialidade: `Especialidade ${i}`,
        bio: `Bio ${i}`,
        avatarUrl: `http://example.com/avatar${i}.jpg`,
        documento: `doc-${i}`,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      professionalsRepository.addUser({
        id: `user-${i}`,
        nome: `User ${i}`,
        email: `user${i}@example.com`,
        senha: 'hashed-password',
        telefone: '123456789',
        role: 'PROFISSIONAL',
        emailVerified: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const page1 = await sut.execute({ page: 1, limit: 5 });
    expect(page1.professionals).toHaveLength(5);
    expect(page1.total).toBe(15); // Corrigido para 15
    expect(page1.page).toBe(1);
    expect(page1.totalPages).toBe(3);

    const page2 = await sut.execute({ page: 2, limit: 5 });
    expect(page2.professionals).toHaveLength(5);
    expect(page2.page).toBe(2);

    const page3 = await sut.execute({ page: 3, limit: 5 });
    expect(page3.professionals).toHaveLength(5);
    expect(page3.page).toBe(3);
  });
});
