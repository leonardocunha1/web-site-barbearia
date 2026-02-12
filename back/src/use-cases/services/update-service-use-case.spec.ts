import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateServiceUseCase } from './update-service-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { Service, Prisma } from '@prisma/client';
import { createMockServicesRepository } from '@/mock/mock-repositories';
import { makeService } from '@/test/factories';

// Tipo para o mock do repositório
type MockServicesRepository = IServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('UpdateServiceUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let sut: UpdateServiceUseCase;

  // Dados mockados para os testes
  const mockService: Service = makeService({
    id: 'service-1',
    name: 'Corte de Cabelo',
    description: 'Corte básico',
    category: 'Cabelo',
    active: true,
  });

  const updatedMockService: Service = {
    ...mockService,
    name: 'Corte Premium',
    description: 'Corte completo com lavagem',
    category: 'Cabelo Premium',
  };

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();

    sut = new UpdateServiceUseCase(servicesRepository);
  });

  it('deve atualizar um serviço existente com sucesso', async () => {
    // Configura os mocks
    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(updatedMockService);

    const updateData: Prisma.ServiceUpdateInput = {
      name: 'Corte Premium',
      description: 'Corte completo com lavagem',
      category: 'Cabelo Premium',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    // Verificações
    expect(result.service).toEqual(updatedMockService);
    expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
    expect(servicesRepository.update).toHaveBeenCalledWith('service-1', updateData);
  });

  it('deve lançar erro quando o serviço não existe', async () => {
    // Configura o mock para retornar null (serviço não encontrado)
    servicesRepository.findById.mockResolvedValue(null);

    const updateData: Prisma.ServiceUpdateInput = { name: 'Corte Premium' };

    await expect(
      sut.execute({
        id: 'non-existent-id',
        data: updateData,
      }),
    ).rejects.toThrow(ServiceNotFoundError);

    // Verifica se findById foi chamado
    expect(servicesRepository.findById).toHaveBeenCalledWith('non-existent-id');
    // Verifica se update não foi chamado
    expect(servicesRepository.update).not.toHaveBeenCalled();
  });

  it('deve permitir atualizar apenas o nome do serviço', async () => {
    const partialUpdateMock = {
      ...mockService,
      name: 'Corte Premium',
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(partialUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = { name: 'Corte Premium' };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.name).toBe('Corte Premium');
    expect(result.service.description).toBe(mockService.description); // Mantém o valor original
    expect(servicesRepository.update).toHaveBeenCalledWith('service-1', {
      name: 'Corte Premium',
    });
  });

  it('deve permitir atualizar apenas a descrição do serviço', async () => {
    const partialUpdateMock = {
      ...mockService,
      description: 'Novo descrição detalhada',
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(partialUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      description: 'Novo descrição detalhada',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.description).toBe('Novo descrição detalhada');
    expect(result.service.name).toBe(mockService.name); // Mantém o valor original
  });

  it('deve permitir atualizar apenas a categoria do serviço', async () => {
    const partialUpdateMock = {
      ...mockService,
      category: 'Nova categoria',
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(partialUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      category: 'Nova categoria',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.category).toBe('Nova categoria');
    expect(result.service.name).toBe(mockService.name); // Mantém o valor original
  });

  it('deve permitir atualizar o status ativo do serviço', async () => {
    const statusUpdateMock = {
      ...mockService,
      active: false,
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(statusUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      active: false,
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.active).toBe(false);
  });

  it('deve atualizar corretamente quando enviado dados vazios', async () => {
    // Neste caso, o serviço deve permanecer igual
    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(mockService);

    const updateData: Prisma.ServiceUpdateInput = {};

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service).toEqual(mockService);
    expect(servicesRepository.update).toHaveBeenCalledWith('service-1', {});
  });
});
