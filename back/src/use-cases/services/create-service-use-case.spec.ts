import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateServiceUseCase } from './create-service-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';
import { Service } from '@prisma/client';
import { createMockServicesRepository } from '@/mock/mock-repositories';
import { makeService } from '@/test/factories';

// Tipo para o mock do repositório
type MockServicesRepository = IServicesRepository & {
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
    const mockService: Service = makeService({
      id: 'service-1',
      name: 'Corte de Cabelo',
      description: 'Corte básico',
      category: 'Cabelo',
      active: true,
    });

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    // Executar
    const result = await sut.execute({
      name: 'Corte de Cabelo',
      description: 'Corte básico',
      category: 'Cabelo',
    });

    // Verificar
    expect(result.service).toEqual(mockService);
    expect(servicesRepository.findByName).toHaveBeenCalledWith('Corte de Cabelo');
    expect(servicesRepository.create).toHaveBeenCalledWith({
      name: 'Corte de Cabelo',
      description: 'Corte básico',
      category: 'Cabelo',
    });
  });

  it('deve criar um serviço com dados mínimos', async () => {
    const mockService: Service = makeService({
      id: 'service-1',
      name: 'Corte de Cabelo',
      description: null,
      category: null,
      active: true,
    });

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({ name: 'Corte de Cabelo' });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.create).toHaveBeenCalledWith({
      name: 'Corte de Cabelo',
      description: undefined,
      category: undefined,
    });
  });

  it('deve lançar erro quando o serviço já existe', async () => {
    const existingService = makeService({
      id: 'service-1',
      name: 'Corte de Cabelo',
      description: 'Corte básico',
      category: 'Cabelo',
      active: true,
    });

    servicesRepository.findByName.mockResolvedValue(existingService);

    await expect(
      sut.execute({
        name: 'Corte de Cabelo',
        description: 'Corte básico',
        category: 'Cabelo',
      }),
    ).rejects.toThrow(ServiceAlreadyExistsError);

    expect(servicesRepository.create).not.toHaveBeenCalled();
  });

  it('deve permitir criar serviços com nomes diferentes', async () => {
    const mockService: Service = makeService({
      id: 'service-1',
      name: 'Corte de Cabelo Premium',
      description: 'Corte completo',
      category: 'Cabelo',
      active: true,
    });

    servicesRepository.findByName.mockImplementation((name) =>
      name === 'Corte de Cabelo'
        ? makeService({
            id: 'service-2',
            name: 'Corte de Cabelo',
            description: 'Corte básico',
            category: 'Cabelo',
            active: true,
          })
        : null,
    );

    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({
      name: 'Corte de Cabelo Premium',
      description: 'Corte completo',
      category: 'Cabelo',
    });

    expect(result.service.name).toBe('Corte de Cabelo Premium');
    expect(servicesRepository.create).toHaveBeenCalled();
  });

  it('deve criar serviço com descrição e categoria opcionais', async () => {
    const mockService: Service = makeService({
      id: 'service-1',
      name: 'Manicure',
      description: null,
      category: null,
      active: true,
    });

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({ name: 'Manicure' });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.create).toHaveBeenCalledWith({
      name: 'Manicure',
      description: undefined,
      category: undefined,
    });
  });
});
