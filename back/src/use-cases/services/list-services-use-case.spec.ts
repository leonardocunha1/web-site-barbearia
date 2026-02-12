import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ListServicesUseCase } from './list-services-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { Service } from '@prisma/client';
import {
  createMockProfessionalsRepository,
  createMockServicesRepository,
} from '@/mock/mock-repositories';
import { makeProfessional, makeService } from '@/test/factories';

// Tipos para os mocks dos repositórios
type MockServicesRepository = IServicesRepository & {
  list: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('ListServicesUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let professionalsRepository: MockProfessionalsRepository;
  let sut: ListServicesUseCase;

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();
    professionalsRepository = createMockProfessionalsRepository();

    sut = new ListServicesUseCase(servicesRepository, professionalsRepository);
  });

  it('deve listar serviços com paginação', async () => {
    const mockServices: Service[] = [
      makeService({
        id: 'service-1',
        name: 'Corte de Cabelo',
        description: 'Corte básico',
        category: 'Cabelo',
        active: true,
      }),
      makeService({
        id: 'service-2',
        name: 'Manicure',
        description: 'Manicure completa',
        category: 'Unhas',
        active: true,
      }),
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
      name: undefined,
      category: undefined,
      active: undefined,
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
    const mockServices = Array(15).fill(
      makeService({
        id: 'service',
        name: 'Serviço',
        description: 'Descrição',
        category: 'Categoria',
        active: true,
      }),
    );

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
      makeService({
        id: 'service-1',
        name: 'Corte de Cabelo',
        description: 'Corte básico',
        category: 'Cabelo',
        active: true,
      }),
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      name: 'Corte',
    });

    expect(result.services[0].name).toBe('Corte de Cabelo');
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      name: 'Corte',
      category: undefined,
      active: undefined,
      professionalId: undefined,
    });
  });

  it('deve filtrar serviços por categoria', async () => {
    const mockServices: Service[] = [
      makeService({
        id: 'service-1',
        name: 'Manicure',
        description: 'Manicure completa',
        category: 'Unhas',
        active: true,
      }),
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      category: 'Unhas',
    });

    expect(result.services[0].category).toBe('Unhas');
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      name: undefined,
      category: 'Unhas',
      active: undefined,
      professionalId: undefined,
    });
  });

  it('deve filtrar serviços por status ativo', async () => {
    const mockServices: Service[] = [
      makeService({
        id: 'service-1',
        name: 'Depilação',
        description: 'Depilação completa',
        category: 'Estética',
        active: true,
      }),
    ];

    servicesRepository.list.mockResolvedValue({
      services: mockServices,
      total: 1,
    });

    const result = await sut.execute({
      page: 1,
      limit: 10,
      active: true,
    });

    expect(result.services[0].active).toBe(true);
    expect(servicesRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      name: undefined,
      category: undefined,
      active: true,
      professionalId: undefined,
    });
  });

  it('deve verificar se o profissional existe quando professionalId é fornecido', async () => {
    const professionalId = 'professional-1';
    professionalsRepository.findById.mockResolvedValue(
      makeProfessional({
        id: professionalId,
        userId: 'user-1',
        specialty: 'Cabelereiro',
        active: true,
      }),
    );

    const mockServices: Service[] = [
      makeService({
        id: 'service-1',
        name: 'Corte de Cabelo',
        description: 'Corte básico',
        category: 'Cabelo',
        active: true,
      }),
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

    expect(professionalsRepository.findById).toHaveBeenCalledWith(professionalId);
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
      specialty: 'Cabelereiro',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockServices: Service[] = [
      {
        id: 'service-1',
        name: 'Corte de Cabelo',
        description: 'Corte básico',
        category: 'Cabelo',
        active: true,
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
      name: undefined,
      category: undefined,
      active: undefined,
      professionalId,
    });
    expect(result.services).toEqual(mockServices);
  });
});
