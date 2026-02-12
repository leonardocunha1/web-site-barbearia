import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateServiceUseCase } from './create-service-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceAlreadyExistsError } from '../errors/service-already-exists-error';
import { Service } from '@prisma/client';
import { createMockServicesRepository } from '@/mock/mock-repositories';

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
    const mockService: Service = {
      id: 'service-1', name: 'Corte de Cabelo', description: 'Corte básico',
      categoria: 'Cabelo',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    // Executar
    const result = await sut.execute({ name: 'Corte de Cabelo', description: 'Corte básico',
      categoria: 'Cabelo',
    });

    // Verificar
    expect(result.service).toEqual(mockService);
    expect(servicesRepository.findByName).toHaveBeenCalledWith(
      'Corte de Cabelo',
    );
    expect(servicesRepository.create).toHaveBeenCalledWith({ name: 'Corte de Cabelo', description: 'Corte básico',
      categoria: 'Cabelo',
    });
  });

  it('deve criar um serviço com dados mínimos', async () => {
    const mockService: Service = {
      id: 'service-1', name: 'Corte de Cabelo', description: null,
      categoria: null,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({ name: 'Corte de Cabelo',
    });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.create).toHaveBeenCalledWith({ name: 'Corte de Cabelo', description: undefined,
      categoria: undefined,
    });
  });

  it('deve lançar erro quando o serviço já existe', async () => {
    const existingService = {
      id: 'service-1', name: 'Corte de Cabelo', description: 'Corte básico',
      categoria: 'Cabelo',
      ativo: true,
    };

    servicesRepository.findByName.mockResolvedValue(existingService);

    await expect(
      sut.execute({ name: 'Corte de Cabelo', description: 'Corte básico',
        categoria: 'Cabelo',
      }),
    ).rejects.toThrow(ServiceAlreadyExistsError);

    expect(servicesRepository.create).not.toHaveBeenCalled();
  });

  it('deve permitir criar serviços com nomes diferentes', async () => {
    const mockService: Service = {
      id: 'service-1', name: 'Corte de Cabelo Premium', description: 'Corte completo',
      categoria: 'Cabelo',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockImplementation((name) =>
      name === 'Corte de Cabelo'
        ? {
            id: 'service-2', name: 'Corte de Cabelo', description: 'Corte básico',
            categoria: 'Cabelo',
            ativo: true,
          }
        : null,
    );

    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({ name: 'Corte de Cabelo Premium', description: 'Corte completo',
      categoria: 'Cabelo',
    });

    expect(result.service.name).toBe('Corte de Cabelo Premium');
    expect(servicesRepository.create).toHaveBeenCalled();
  });

  it('deve criar serviço com descrição e categoria opcionais', async () => {
    const mockService: Service = {
      id: 'service-1', name: 'Manicure', description: null,
      categoria: null,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    servicesRepository.findByName.mockResolvedValue(null);
    servicesRepository.create.mockResolvedValue(mockService);

    const result = await sut.execute({ name: 'Manicure',
    });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.create).toHaveBeenCalledWith({ name: 'Manicure', description: undefined,
      categoria: undefined,
    });
  });
});

