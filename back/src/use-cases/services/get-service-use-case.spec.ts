import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetServiceUseCase } from './get-service-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ServiceDTO } from '@/dtos/service-dto';
import { createMockServicesRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockServicesRepository = IServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('GetServiceUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let sut: GetServiceUseCase;

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();

    sut = new GetServiceUseCase(servicesRepository);
  });

  it('deve retornar um serviço existente', async () => {
    const mockService: ServiceDTO = {
      id: 'service-1', name: 'Corte de Cabelo', description: 'Corte básico',
      categoria: 'Cabelo',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profissionais: [],
    };

    servicesRepository.findById.mockResolvedValue(mockService);

    const result = await sut.execute({ id: 'service-1' });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
  });

  it('deve lançar erro quando o serviço não existe', async () => {
    servicesRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toThrow(
      ServiceNotFoundError,
    );

    expect(servicesRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('deve retornar um serviço inativo se existir', async () => {
    const mockInactiveService: ServiceDTO = {
      id: 'service-2', name: 'Manicure', description: 'Manicure completa',
      categoria: 'Unhas',
      ativo: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      profissionais: [],
    };

    servicesRepository.findById.mockResolvedValue(mockInactiveService);

    const result = await sut.execute({ id: 'service-2' });

    expect(result.service).toEqual(mockInactiveService);
    expect(result.service.active).toBe(false);
  });

  it('deve retornar um serviço sem descrição e categoria', async () => {
    const mockService: ServiceDTO = {
      id: 'service-3', name: 'Depilação', description: null,
      categoria: null,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profissionais: [],
    };

    servicesRepository.findById.mockResolvedValue(mockService);

    const result = await sut.execute({ id: 'service-3' });

    expect(result.service.description).toBeNull();
    expect(result.service.category).toBeNull();
  });

  it('deve retornar um serviço com profissionais associados', async () => {
    const mockServiceWithProfessionals: ServiceDTO = {
      id: 'service-4', name: 'Massagem', description: 'Massagem relaxante',
      categoria: 'Bem-estar',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profissionais: [
        {
          id: 'professional-1',
          professional: {
            id: 'prof-1',
            user: {
              id: 'user-1', name: 'João Massagista',
            },
          },
        },
      ],
    };

    servicesRepository.findById.mockResolvedValue(mockServiceWithProfessionals);

    const result = await sut.execute({ id: 'service-4' });

    expect(result.service.professionals).toHaveLength(1);
    expect(result.service.professionals[0].professional.user.name).toBe(
      'João Massagista',
    );
  });
});

