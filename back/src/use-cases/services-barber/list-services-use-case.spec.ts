import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ListServicesUseCase } from './list-services-use-case';
import { ServicesRepository } from '@/repositories/services-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { Service } from '@prisma/client';

// Tipos para os mocks dos repositórios
type MockServicesRepository = ServicesRepository & {
  list: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('ListServicesUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let professionalsRepository: MockProfessionalsRepository;
  let sut: ListServicesUseCase;

  beforeEach(() => {
    servicesRepository = {
      list: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      softDelete: vi.fn(),
      toggleStatus: vi.fn(),
      existsProfessional: vi.fn(),
    };

    professionalsRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByProfessionalId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
      search: vi.fn(),
      countSearch: vi.fn(),
    };

    sut = new ListServicesUseCase(servicesRepository, professionalsRepository);
  });

  it('deve listar serviços com paginação', async () => {
    const mockServices: Service[] = [
      {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Corte básico',
        categoria: 'Cabelo',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'service-2',
        nome: 'Manicure',
        descricao: 'Manicure completa',
        categoria: 'Unhas',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 2,
    });

    const result = await sut.execute({ page: 1, limit: 10 });

    expect(result.services).toEqual(mockServices);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nome: undefined,
      categoria: undefined,
      ativo: undefined,
      professionalId: undefined,
    });
  });

  it('deve retornar lista vazia quando não houver serviços', async () => {
    servicesRepository.list.mockResolvedValue({
      services: [],
      total: 0,
    });

    const result = await sut.execute({ page: 1, limit: 10 });

    expect(result.services).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it('deve calcular corretamente o total de páginas', async () => {
    const mockServices = Array(15).fill({
      id: 'service',
      nome: 'Serviço',
      descricao: 'Descrição',
      categoria: 'Categoria',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    servicesRepository.list.mockResolvedValue({
      services: mockServices.slice(0, 10),
      total: 15,
    });

    const result = await sut.execute({ page: 1, limit: 10 });

    expect(result.totalPages).toBe(2);
    expect(result.services).toHaveLength(10);
  });

  it('deve filtrar serviços por nome', async () => {
    const mockServices: Service[] = [
      {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Corte básico',
        categoria: 'Cabelo',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      nome: 'Corte',
    });

    expect(result.services[0].nome).toBe('Corte de Cabelo');
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nome: 'Corte',
      categoria: undefined,
      ativo: undefined,
      professionalId: undefined,
    });
  });

  it('deve filtrar serviços por categoria', async () => {
    const mockServices: Service[] = [
      {
        id: 'service-1',
        nome: 'Manicure',
        descricao: 'Manicure completa',
        categoria: 'Unhas',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      categoria: 'Unhas',
    });

    expect(result.services[0].categoria).toBe('Unhas');
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nome: undefined,
      categoria: 'Unhas',
      ativo: undefined,
      professionalId: undefined,
    });
  });

  it('deve filtrar serviços por status ativo', async () => {
    const mockServices: Service[] = [
      {
        id: 'service-1',
        nome: 'Depilação',
        descricao: 'Depilação completa',
        categoria: 'Estética',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      ativo: true,
    });

    expect(result.services[0].ativo).toBe(true);
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nome: undefined,
      categoria: undefined,
      ativo: true,
      professionalId: undefined,
    });
  });

  it('deve verificar se o profissional existe quando professionalId é fornecido', async () => {
    const professionalId = 'professional-1';
    professionalsRepository.findById.mockResolvedValue({
      id: professionalId,
      userId: 'user-1',
      especialidade: 'Cabelereiro',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockServices: Service[] = [
      {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Corte básico',
        categoria: 'Cabelo',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      professionalId,
    });

    expect(professionalsRepository.findById).toHaveBeenCalledWith(
      professionalId,
    );
    expect(result.services).toEqual(mockServices);
  });

  it('deve lançar erro quando professionalId não existe', async () => {
    const professionalId = 'non-existent-professional';
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        page: 1,
        limit: 10,
        professionalId,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);

    expect(servicesRepository.list).not.toHaveBeenCalled();
  });

  it('deve filtrar serviços por professionalId', async () => {
    const professionalId = 'professional-1';
    professionalsRepository.findById.mockResolvedValue({
      id: professionalId,
      userId: 'user-1',
      especialidade: 'Cabelereiro',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockServices: Service[] = [
      {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Corte básico',
        categoria: 'Cabelo',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      professionalId,
    });

    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nome: undefined,
      categoria: undefined,
      ativo: undefined,
      professionalId,
    });
    expect(result.services).toEqual(mockServices);
  });
});
