import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ListProfessionalServicesUseCase } from './list-professional-services-use-case';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import {
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
} from '@/mock/mock-repositories';

// Tipos para os mocks
type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockServiceProfessionalRepository = IServiceProfessionalRepository & {
  findByProfessional: ReturnType<typeof vi.fn>;
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

  it('deve listar serviços de um profissional com paginação', async () => {
    const mockProfessional = {
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    };

    const mockServices = {
      services: [
        {
          service: {
            id: 'service-1', name: 'Corte de Cabelo', description: 'Descrição do corte',
            categoria: 'Cabelo',
            ativo: true,
          }, price: 50, duration: 30,
        },
        {
          service: {
            id: 'service-2', name: 'Manicure', description: 'Descrição da manicure',
            categoria: 'Unhas',
            ativo: true,
          }, price: 30, duration: 45,
        },
      ],
      total: 2,
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    serviceProfessionalRepository.findByProfessional.mockResolvedValue(
      mockServices,
    );

    const result = await sut.execute({
      professionalId: 'prof-1',
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      services: [
        {
          id: 'service-1', name: 'Corte de Cabelo', description: 'Descrição do corte',
          categoria: 'Cabelo',
          ativo: true, price: 50, duration: 30,
        },
        {
          id: 'service-2', name: 'Manicure', description: 'Descrição da manicure',
          categoria: 'Unhas',
          ativo: true, price: 30, duration: 45,
        },
      ],
      total: 2,
    });

    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-1');
    expect(
      serviceProfessionalRepository.findByProfessional,
    ).toHaveBeenCalledWith('prof-1', {
      page: 1,
      limit: 10,
      activeOnly: true,
    });
  });

  it('deve listar apenas serviços ativos quando activeOnly=true', async () => {
    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByProfessional.mockResolvedValue({
      services: [
        {
          service: {
            id: 'service-1', name: 'Corte de Cabelo', description: 'Descrição do corte',
            categoria: 'Cabelo',
            ativo: true,
          }, price: 50, duration: 30,
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
    expect(
      serviceProfessionalRepository.findByProfessional,
    ).toHaveBeenCalledWith('prof-1', {
      page: 1,
      limit: 10,
      activeOnly: true,
    });
  });

  it('deve listar todos os serviços quando activeOnly=false', async () => {
    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByProfessional.mockResolvedValue({
      services: [
        {
          service: {
            id: 'service-1', name: 'Corte de Cabelo', description: 'Descrição do corte',
            categoria: 'Cabelo',
            ativo: false,
          }, price: 50, duration: 30,
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
    expect(
      serviceProfessionalRepository.findByProfessional,
    ).toHaveBeenCalledWith('prof-1', {
      page: 1,
      limit: 10,
      activeOnly: false,
    });
  });

  it('deve lançar erro quando o profissional não existe', async () => {
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        professionalId: 'prof-inexistente',
        page: 1,
        limit: 10,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);

    expect(
      serviceProfessionalRepository.findByProfessional,
    ).not.toHaveBeenCalled();
  });

  it('deve retornar lista vazia quando não há serviços', async () => {
    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByProfessional.mockResolvedValue({
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

  it('deve aplicar paginação corretamente', async () => {
    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByProfessional.mockResolvedValue({
      services: [
        {
          service: {
            id: 'service-3', name: 'Massagem', description: 'Descrição da massagem',
            categoria: 'Bem-estar',
            ativo: true,
          }, price: 80, duration: 60,
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
        id: 'service-3', name: 'Massagem', description: 'Descrição da massagem',
        categoria: 'Bem-estar',
        ativo: true, price: 80, duration: 60,
      },
    ]);
    expect(result.total).toBe(3);
    expect(
      serviceProfessionalRepository.findByProfessional,
    ).toHaveBeenCalledWith('prof-1', {
      page: 2,
      limit: 1,
      activeOnly: true,
    });
  });
});

