import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { SearchProfessionalsUseCase } from './search-professionals-use-case';
import { InvalidQueryError } from '../errors/invalid-query-error';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';

let professionalsRepository: InMemoryProfessionalsRepository;
let sut: SearchProfessionalsUseCase;

describe('Caso de Uso: Buscar Profissionais', () => {
  beforeEach(() => {
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new SearchProfessionalsUseCase(professionalsRepository);
  });

  it('deve retornar profissionais que correspondem à query', async () => {
    // Cria profissionais de teste
    await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Dentista',
      ativo: true,
    });
    await professionalsRepository.create({
      user: { connect: { id: 'user-2' } },
      especialidade: 'Cardiologista',
      ativo: true,
    });
    await professionalsRepository.create({
      user: { connect: { id: 'user-3' } },
      especialidade: 'Ortopedista',
      ativo: false,
    });

    // Adiciona usuários associados
    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'Dr. Silva',
      email: 'silva@example.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      active: true,
      createdAt: new Date(),
      emailVerified: false,
      updatedAt: new Date(),
      telefone: null,
    });
    professionalsRepository.addUser({
      id: 'user-2',
      nome: 'Dr. Costa',
      email: 'costa@example.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      active: true,
      createdAt: new Date(),
      emailVerified: false,
      updatedAt: new Date(),
      telefone: null,
    });

    const result = await sut.execute({ query: 'Dentista' });

    expect(result.professionals.length).toBe(1);
    expect(result.professionals[0].especialidade).toBe('Dentista');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('deve aplicar paginação corretamente', async () => {
    // Cria 15 profissionais para testar paginação
    for (let i = 1; i <= 15; i++) {
      await professionalsRepository.create({
        user: { connect: { id: `user-${i}` } },
        especialidade: `Especialidade ${i}`,
        ativo: true,
      });
      professionalsRepository.addUser({
        id: `user-${i}`,
        nome: `Dr. ${i}`,
        email: `dr${i}@example.com`,
        senha: 'hashed-password',
        role: 'PROFISSIONAL',
        active: true,
        createdAt: new Date(),
        emailVerified: false,
        updatedAt: new Date(),
        telefone: null,
      });
    }

    const result = await sut.execute({
      query: 'Especialidade',
      page: 2,
      limit: 5,
    });

    expect(result.professionals.length).toBe(5);
    expect(result.total).toBe(15);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.totalPages).toBe(3);
  });

  it('deve filtrar por profissionais ativos/inativos', async () => {
    await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Ativo',
      ativo: true,
    });
    await professionalsRepository.create({
      user: { connect: { id: 'user-2' } },
      especialidade: 'Inativo',
      ativo: false,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'Dr. Ativo',
      email: 'ativo@example.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      active: true,
      createdAt: new Date(),
      emailVerified: false,
      updatedAt: new Date(),
      telefone: null,
    });

    professionalsRepository.addUser({
      id: 'user-2',
      nome: 'Dr. Inativo',
      email: 'inativo@example.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      active: false,
      createdAt: new Date(),
      emailVerified: false,
      updatedAt: new Date(),
      telefone: null,
    });

    // Testa busca por ativos
    const activeResult = await sut.execute({ query: 'ti', ativo: true });
    expect(activeResult.total).toBe(1);
    expect(activeResult.professionals[0].especialidade).toBe('Ativo');

    // Testa busca por inativos
    const inactiveResult = await sut.execute({ query: 'ti', ativo: false });
    expect(inactiveResult.total).toBe(1);
    expect(inactiveResult.professionals[0].especialidade).toBe('Inativo');
  });

  it('deve lançar erro quando a query for vazia', async () => {
    await expect(sut.execute({ query: '' })).rejects.toBeInstanceOf(
      InvalidQueryError,
    );

    await expect(sut.execute({ query: '   ' })).rejects.toBeInstanceOf(
      InvalidQueryError,
    );
  });

  it('deve lançar erro quando a página for inválida', async () => {
    await expect(
      sut.execute({ query: 'test', page: 0 }),
    ).rejects.toBeInstanceOf(InvalidPageError);

    await expect(
      sut.execute({ query: 'test', page: -1 }),
    ).rejects.toBeInstanceOf(InvalidPageError);
  });

  it('deve lançar erro quando o limite for inválido', async () => {
    await expect(
      sut.execute({ query: 'test', limit: 0 }),
    ).rejects.toBeInstanceOf(InvalidLimitError);

    await expect(
      sut.execute({ query: 'test', limit: 101 }),
    ).rejects.toBeInstanceOf(InvalidLimitError);
  });
});
