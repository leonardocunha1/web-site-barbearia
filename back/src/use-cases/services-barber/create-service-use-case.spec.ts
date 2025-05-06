import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateServiceUseCase } from './create-service-use-case';
import { ServicesRepository } from '@/repositories/services-repository';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';
import { Service } from '@prisma/client';
import { createMockServicesRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockServicesRepository = ServicesRepository & {
  findByName: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

describe('CreateServiceUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let sut: CreateServiceUseCase;

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();

    sut = new CreateServiceUseCase(servicesRepository);
  });

  it('deve criar um novo serviço com sucesso', async () => {
    // Mock do serviço criado
    const mockService: Service = {
      id: 'service-1',
      nome: 'Corte de Cabelo',
      descricao: 'Corte básico',
      categoria: 'Cabelo',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    // Executar
    const result = await sut.execute({
      nome: 'Corte de Cabelo',
      descricao: 'Corte básico',
      categoria: 'Cabelo',
    });

    // Verificar
    expect(result.service).toEqual(mockService);
    expect(servicesRepository.findByName).toHaveBeenCalledWith(
      'Corte de Cabelo',
    );
    expect(servicesRepository.create).toHaveBeenCalledWith({
      nome: 'Corte de Cabelo',
      descricao: 'Corte básico',
      categoria: 'Cabelo',
    });
  });

  it('deve criar um serviço com dados mínimos', async () => {
    const mockService: Service = {
      id: 'service-1',
      nome: 'Corte de Cabelo',
      descricao: null,
      categoria: null,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({
      nome: 'Corte de Cabelo',
    });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.create).toHaveBeenCalledWith({
      nome: 'Corte de Cabelo',
      descricao: undefined,
      categoria: undefined,
    });
  });

  it('deve lançar erro quando o serviço já existe', async () => {
    const existingService = {
      id: 'service-1',
      nome: 'Corte de Cabelo',
      descricao: 'Corte básico',
      categoria: 'Cabelo',
      ativo: true,
    };

    servicesRepository.findByName.mockResolvedValue(existingService);

    await expect(
      sut.execute({
        nome: 'Corte de Cabelo',
        descricao: 'Corte básico',
        categoria: 'Cabelo',
      }),
    ).rejects.toThrow(ServiceAlreadyExistsError);

    expect(servicesRepository.create).not.toHaveBeenCalled();
  });

  it('deve permitir criar serviços com nomes diferentes', async () => {
    const mockService: Service = {
      id: 'service-1',
      nome: 'Corte de Cabelo Premium',
      descricao: 'Corte completo',
      categoria: 'Cabelo',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockImplementation((name) =>
      name === 'Corte de Cabelo'
        ? {
            id: 'service-2',
            nome: 'Corte de Cabelo',
            descricao: 'Corte básico',
            categoria: 'Cabelo',
            ativo: true,
          }
        : null,
    );

    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({
      nome: 'Corte de Cabelo Premium',
      descricao: 'Corte completo',
      categoria: 'Cabelo',
    });

    expect(result.service.nome).toBe('Corte de Cabelo Premium');
    expect(servicesRepository.create).toHaveBeenCalled();
  });

  it('deve criar serviço com descrição e categoria opcionais', async () => {
    const mockService: Service = {
      id: 'service-1',
      nome: 'Manicure',
      descricao: null,
      categoria: null,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({
      nome: 'Manicure',
    });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.create).toHaveBeenCalledWith({
      nome: 'Manicure',
      descricao: undefined,
      categoria: undefined,
    });
  });
});
