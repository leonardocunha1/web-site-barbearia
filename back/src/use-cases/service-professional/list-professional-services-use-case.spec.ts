import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ListProfessionalServicesUseCase } from './list-professional-services-use-case';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import {
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
} from '@/mock/mock-repositories';
import { makeProfessional, makeService } from '@/test/factories';

// Tipos para os mocks
type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockServiceProfessionalRepository = IServiceProfessionalRepository & {
  findAllActiveWithProfessionalData: ReturnType<typeof vi.fn>;
  findAllWithProfessionalData: ReturnType<typeof vi.fn>;
};

describe('ListProfessionalServicesUseCase', () => {
  let professionalsRepository: MockProfessionalsRepository;
  let serviceProfessionalRepository: MockServiceProfessionalRepository;
  let sut: ListProfessionalServicesUseCase;

  beforeEach(() => {
    professionalsRepository = createMockProfessionalsRepository();
    serviceProfessionalRepository = createMockServiceProfessionalRepository();

    sut = new ListProfessionalServicesUseCase(
      serviceProfessionalRepository,
      professionalsRepository,
    );
  });

  it('deve listar serviÃ§os de um profissional com paginaÃ§Ã£o', async () => {
    const mockProfessional = makeProfessional({
      id: 'prof-1',
      userId: 'user-1',
      active: true,
    });

    const mockServices = {
      services: [
        {
          service: {
            ...makeService({
              id: 'service-1',
              name: 'Corte de Cabelo',
              description: 'DescriÃ§Ã£o do corte',
              category: 'Cabelo',
              active: true,
            }),
          },
          price: 50,
          duration: 30,
        },
        {
          service: {
            ...makeService({
              id: 'service-2',
              name: 'Manicure',
              description: 'DescriÃ§Ã£o da manicure',
              category: 'Unhas',
              active: true,
            }),
          },
          price: 30,
          duration: 45,
        },
      ],
      total: 2,
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    serviceProfessionalRepository.findAllActiveWithProfessionalData.mockResolvedValue(mockServices);

    const result = await sut.execute({
      professionalId: 'prof-1',
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      services: [
        {
          id: 'service-1',
          name: 'Corte de Cabelo',
          description: 'DescriÃ§Ã£o do corte',
          category: 'Cabelo',
          active: true,
          price: 50,
          duration: 30,
        },
        {
          id: 'service-2',
          name: 'Manicure',
          description: 'DescriÃ§Ã£o da manicure',
          category: 'Unhas',
          active: true,
          price: 30,
          duration: 45,
        },
      ],
      total: 2,
    });

    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-1');
    expect(serviceProfessionalRepository.findAllActiveWithProfessionalData).toHaveBeenCalledWith(
      'prof-1',
      {
        page: 1,
        limit: 10,
      },
    );
  });

  it('deve listar apenas serviÃ§os ativos quando activeOnly=true', async () => {
    professionalsRepository.findById.mockResolvedValue(
      makeProfessional({ id: 'prof-1', userId: 'user-1', active: true }),
    );

    serviceProfessionalRepository.findAllActiveWithProfessionalData.mockResolvedValue({
      services: [
        {
          service: {
            ...makeService({
              id: 'service-1',
              name: 'Corte de Cabelo',
              description: 'DescriÃ§Ã£o do corte',
              category: 'Cabelo',
              active: true,
            }),
          },
          price: 50,
          duration: 30,
        },
      ],
      total: 1,
    });

    const result = await sut.execute({
      professionalId: 'prof-1',
      page: 1,
      limit: 10,
      activeOnly: true,
    });

    expect(result.services.every((s) => s.active)).toBe(true);
    expect(serviceProfessionalRepository.findAllActiveWithProfessionalData).toHaveBeenCalledWith(
      'prof-1',
      {
        page: 1,
        limit: 10,
      },
    );
  });

  it('deve listar todos os serviÃ§os quando activeOnly=false', async () => {
    professionalsRepository.findById.mockResolvedValue(
      makeProfessional({ id: 'prof-1', userId: 'user-1', active: true }),
    );

    serviceProfessionalRepository.findAllWithProfessionalData.mockResolvedValue({
      services: [
        {
          service: {
            ...makeService({
              id: 'service-1',
              name: 'Corte de Cabelo',
              description: 'DescriÃ§Ã£o do corte',
              category: 'Cabelo',
              active: false,
            }),
          },
          price: 50,
          duration: 30,
        },
      ],
      total: 1,
    });

    const result = await sut.execute({
      professionalId: 'prof-1',
      page: 1,
      limit: 10,
      activeOnly: false,
    });

    expect(result.services.some((s) => !s.active)).toBe(true);
    expect(serviceProfessionalRepository.findAllWithProfessionalData).toHaveBeenCalledWith(
      'prof-1',
      {
        page: 1,
        limit: 10,
      },
    );
  });

  it('deve lanÃ§ar erro quando o profissional nÃ£o existe', async () => {
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        professionalId: 'prof-inexistente',
        page: 1,
        limit: 10,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);

    expect(serviceProfessionalRepository.findAllActiveWithProfessionalData).not.toHaveBeenCalled();
    expect(serviceProfessionalRepository.findAllWithProfessionalData).not.toHaveBeenCalled();
  });

  it('deve retornar lista vazia quando nÃ£o hÃ¡ serviÃ§os', async () => {
    professionalsRepository.findById.mockResolvedValue(
      makeProfessional({ id: 'prof-1', userId: 'user-1', active: true }),
    );

    serviceProfessionalRepository.findAllActiveWithProfessionalData.mockResolvedValue({
      services: [],
      total: 0,
    });

    const result = await sut.execute({
      professionalId: 'prof-1',
      page: 1,
      limit: 10,
    });

    expect(result.services).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('deve aplicar paginaÃ§Ã£o corretamente', async () => {
    professionalsRepository.findById.mockResolvedValue(
      makeProfessional({ id: 'prof-1', userId: 'user-1', active: true }),
    );

    serviceProfessionalRepository.findAllActiveWithProfessionalData.mockResolvedValue({
      services: [
        {
          service: {
            ...makeService({
              id: 'service-3',
              name: 'Massagem',
              description: 'DescriÃ§Ã£o da massagem',
              category: 'Bem-estar',
              active: true,
            }),
          },
          price: 80,
          duration: 60,
        },
      ],
      total: 3,
    });

    const result = await sut.execute({
      professionalId: 'prof-1',
      page: 2,
      limit: 1,
    });

    expect(result.services).toEqual([
      {
        id: 'service-3',
        name: 'Massagem',
        description: 'DescriÃ§Ã£o da massagem',
        category: 'Bem-estar',
        active: true,
        price: 80,
        duration: 60,
      },
    ]);
    expect(result.total).toBe(3);
    expect(serviceProfessionalRepository.findAllActiveWithProfessionalData).toHaveBeenCalledWith(
      'prof-1',
      {
        page: 2,
        limit: 1,
      },
    );
  });
});
