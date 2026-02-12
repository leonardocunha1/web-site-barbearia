import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';
import { ListOrSearchProfessionalsUseCase } from './list-professionals-use-case';
import { createMockProfessionalsRepository } from '@/mock/mock-repositories';
import { makeProfessional, makeService, makeUser } from '@/test/factories';

// Tipos para os mocks
type MockProfessionalsRepository = IProfessionalsRepository & {
  list: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
  search: ReturnType<typeof vi.fn>;
  countSearch: ReturnType<typeof vi.fn>;
};

describe('ListOrSearchProfessionalsUseCase', () => {
  let useCase: ListOrSearchProfessionalsUseCase;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    mockProfessionalsRepository = createMockProfessionalsRepository();

    useCase = new ListOrSearchProfessionalsUseCase(mockProfessionalsRepository);
  });

  const mockProfessional = (id: string) => {
    const user = makeUser({
      id: `user-${id}`,
      name: `Professional ${id}`,
      email: `professional${id}@example.com`,
      phone: null,
      role: 'PROFESSIONAL' as any,
    });
    const service = makeService({
      id: `service-${id}`,
      name: 'Consulta Odontológica',
      description: 'Descrição do serviço',
      category: 'Odontologia',
      active: true,
    });

    return {
      ...makeProfessional({
        id: `prof-${id}`,
        userId: user.id,
        specialty: 'Dentista',
        bio: `Bio do profissional ${id}`,
        document: `doc-${id}`,
        active: true,
      }),
      user,
      services: [service],
    };
  };

  it('deve listar profissionais com paginação padrão', async () => {
    // Configurar mocks
    const mockProfessionals = [mockProfessional('1'), mockProfessional('2')];
    mockProfessionalsRepository.list.mockResolvedValue(mockProfessionals);
    mockProfessionalsRepository.count.mockResolvedValue(20);

    // Executar
    const result = await useCase.execute({});

    // Verificar estrutura básica
    expect(result).toEqual({
      professionals: expect.any(Array),
      total: 20,
      page: 1,
      limit: 10,
      totalPages: 2,
    });

    // Verificar detalhes dos profissionais
    expect(result.professionals).toHaveLength(2);
    expect(result.professionals[0]).toEqual({
      id: 'prof-1',
      specialty: 'Dentista',
      bio: 'Bio do profissional 1',
      active: true,
      user: {
        id: 'user-1',
        name: 'Professional 1',
        email: 'professional1@example.com',
        phone: undefined,
      },
      services: [
        {
          id: 'service-1',
          name: 'Consulta Odontológica',
          description: 'Descrição do serviço',
        },
      ],
      avatarUrl: undefined,
    });

    expect(mockProfessionalsRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      active: true,
    });
    expect(mockProfessionalsRepository.count).toHaveBeenCalledWith({
      active: true,
    });
  });

  it('deve permitir customizar paginação', async () => {
    // Configurar mocks
    const mockProfessionals = [mockProfessional('1')];
    mockProfessionalsRepository.list.mockResolvedValue(mockProfessionals);
    mockProfessionalsRepository.count.mockResolvedValue(5);

    // Executar
    const result = await useCase.execute({
      page: 2,
      limit: 5,
    });

    // Verificar
    expect(result).toEqual({
      professionals: expect.arrayContaining([
        expect.objectContaining({
          id: 'prof-1',
        }),
      ]),
      total: 5,
      page: 2,
      limit: 5,
      totalPages: 1,
    });
    expect(mockProfessionalsRepository.list).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      active: true,
    });
  });

  it('deve lançar erro quando página for inválida', async () => {
    await expect(
      useCase.execute({
        page: 0,
      }),
    ).rejects.toThrow(InvalidPageError);

    await expect(
      useCase.execute({
        page: -1,
      }),
    ).rejects.toThrow(InvalidPageError);
  });

  it('deve lançar erro quando limite for inválido', async () => {
    await expect(
      useCase.execute({
        limit: 0,
      }),
    ).rejects.toThrow(InvalidLimitError);

    await expect(
      useCase.execute({
        limit: 101,
      }),
    ).rejects.toThrow(InvalidLimitError);
  });

  it('deve filtrar por especialidade', async () => {
    // Configurar mocks
    const mockProfessionals = [mockProfessional('1')];
    mockProfessionalsRepository.list.mockResolvedValue(mockProfessionals);
    mockProfessionalsRepository.count.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      specialty: 'Dentista',
    });

    // Verificar
    expect(result.professionals.length).toBe(1);
    expect(mockProfessionalsRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      specialty: 'Dentista',
      active: true,
    });
  });

  it('deve permitir listar profissionais inativos', async () => {
    // Configurar mocks
    const mockProfessionals = [mockProfessional('1')];
    mockProfessionalsRepository.list.mockResolvedValue(mockProfessionals);
    mockProfessionalsRepository.count.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      active: false,
    });

    // Verificar
    expect(result.professionals.length).toBe(1);
    expect(mockProfessionalsRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      active: false,
    });
  });

  it('deve retornar lista vazia quando não houver profissionais', async () => {
    // Configurar mocks
    mockProfessionalsRepository.list.mockResolvedValue([]);
    mockProfessionalsRepository.count.mockResolvedValue(0);

    // Executar
    const result = await useCase.execute({});

    // Verificar
    expect(result).toEqual({
      professionals: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });

  it('deve realizar busca quando query for fornecida', async () => {
    // Configurar mocks
    const mockProfessionals = [mockProfessional('1')];
    mockProfessionalsRepository.search.mockResolvedValue(mockProfessionals);
    mockProfessionalsRepository.countSearch.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      query: 'Dentista',
    });

    // Verificar
    expect(result.professionals.length).toBe(1);
    expect(mockProfessionalsRepository.search).toHaveBeenCalledWith({
      query: 'Dentista',
      page: 1,
      limit: 10,
      active: true,
    });
    expect(mockProfessionalsRepository.countSearch).toHaveBeenCalledWith({
      query: 'Dentista',
      active: true,
    });
  });

  it('deve combinar busca com outros filtros', async () => {
    // Configurar mocks
    const mockProfessionals = [mockProfessional('1')];
    mockProfessionalsRepository.search.mockResolvedValue(mockProfessionals);
    mockProfessionalsRepository.countSearch.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      query: 'Dentista',
      specialty: 'Ortodontia',
      active: false,
      page: 3,
      limit: 20,
    });

    // Verificar
    expect(result.professionals.length).toBe(1);
    expect(mockProfessionalsRepository.search).toHaveBeenCalledWith({
      query: 'Dentista',
      page: 3,
      limit: 20,
      active: false,
    });
    // Nota: A especialidade não é usada na busca, apenas na listagem normal
  });

  it('deve calcular corretamente o total de páginas', async () => {
    // Testar diferentes cenários de paginação
    const testCases = [
      { total: 100, limit: 10, expected: 10 },
      { total: 101, limit: 10, expected: 11 },
      { total: 99, limit: 10, expected: 10 },
      { total: 0, limit: 10, expected: 0 },
      { total: 5, limit: 5, expected: 1 },
    ];

    for (const testCase of testCases) {
      mockProfessionalsRepository.list.mockResolvedValue([]);
      mockProfessionalsRepository.count.mockResolvedValue(testCase.total);

      const result = await useCase.execute({
        limit: testCase.limit,
      });

      expect(result.totalPages).toBe(testCase.expected);
    }
  });
});
