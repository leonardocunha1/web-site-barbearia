import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ListProfessionalServicesUseCase } from './list-professional-services-use-case';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import {
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
} from '@/mock/mock-repositories';

// Tipos para os mocks
type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockServiceProfessionalRepository = ServiceProfessionalRepository & {
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
            id: 'service-1',
            nome: 'Corte de Cabelo',
            descricao: 'Descrição do corte',
            categoria: 'Cabelo',
            ativo: true,
          },
          preco: 50,
          duracao: 30,
        },
        {
          service: {
            id: 'service-2',
            nome: 'Manicure',
            descricao: 'Descrição da manicure',
            categoria: 'Unhas',
            ativo: true,
          },
          preco: 30,
          duracao: 45,
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
          id: 'service-1',
          nome: 'Corte de Cabelo',
          descricao: 'Descrição do corte',
          categoria: 'Cabelo',
          ativo: true,
          preco: 50,
          duracao: 30,
        },
        {
          id: 'service-2',
          nome: 'Manicure',
          descricao: 'Descrição da manicure',
          categoria: 'Unhas',
          ativo: true,
          preco: 30,
          duracao: 45,
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
            id: 'service-1',
            nome: 'Corte de Cabelo',
            descricao: 'Descrição do corte',
            categoria: 'Cabelo',
            ativo: true,
          },
          preco: 50,
          duracao: 30,
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

    expect(result.services.every((s) => s.ativo)).toBe(true);
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
            id: 'service-1',
            nome: 'Corte de Cabelo',
            descricao: 'Descrição do corte',
            categoria: 'Cabelo',
            ativo: false,
          },
          preco: 50,
          duracao: 30,
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

    expect(result.services.some((s) => !s.ativo)).toBe(true);
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
            id: 'service-3',
            nome: 'Massagem',
            descricao: 'Descrição da massagem',
            categoria: 'Bem-estar',
            ativo: true,
          },
          preco: 80,
          duracao: 60,
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
        nome: 'Massagem',
        descricao: 'Descrição da massagem',
        categoria: 'Bem-estar',
        ativo: true,
        preco: 80,
        duracao: 60,
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
