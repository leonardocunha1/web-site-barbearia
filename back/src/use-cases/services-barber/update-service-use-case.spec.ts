import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateServiceUseCase } from './update-service-use-case';
import { ServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { Service, Prisma } from '@prisma/client';

// Tipo para o mock do repositório
type MockServicesRepository = ServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('UpdateServiceUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let sut: UpdateServiceUseCase;

  // Dados mockados para os testes
  const mockService: Service = {
    id: 'service-1',
    nome: 'Corte de Cabelo',
    descricao: 'Corte básico',
    categoria: 'Cabelo',
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedMockService: Service = {
    ...mockService,
    nome: 'Corte Premium',
    descricao: 'Corte completo com lavagem',
    categoria: 'Cabelo Premium',
  };

  beforeEach(() => {
    servicesRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      // Outras funções do repositório que não são usadas neste use case
      findByName: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      softDelete: vi.fn(),
      toggleStatus: vi.fn(),
      list: vi.fn(),
      existsProfessional: vi.fn(),
    };

    sut = new UpdateServiceUseCase(servicesRepository);
  });

  it('deve atualizar um serviço existente com sucesso', async () => {
    // Configura os mocks
    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(updatedMockService);

    const updateData: Prisma.ServiceUpdateInput = {
      nome: 'Corte Premium',
      descricao: 'Corte completo com lavagem',
      categoria: 'Cabelo Premium',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    // Verificações
    expect(result.service).toEqual(updatedMockService);
    expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
    expect(servicesRepository.update).toHaveBeenCalledWith(
      'service-1',
      updateData,
    );
  });

  it('deve lançar erro quando o serviço não existe', async () => {
    // Configura o mock para retornar null (serviço não encontrado)
    servicesRepository.findById.mockResolvedValue(null);

    const updateData: Prisma.ServiceUpdateInput = {
      nome: 'Corte Premium',
    };

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
      nome: 'Corte Premium',
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(partialUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      nome: 'Corte Premium',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.nome).toBe('Corte Premium');
    expect(result.service.descricao).toBe(mockService.descricao); // Mantém o valor original
    expect(servicesRepository.update).toHaveBeenCalledWith('service-1', {
      nome: 'Corte Premium',
    });
  });

  it('deve permitir atualizar apenas a descrição do serviço', async () => {
    const partialUpdateMock = {
      ...mockService,
      descricao: 'Novo descrição detalhada',
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(partialUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      descricao: 'Novo descrição detalhada',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.descricao).toBe('Novo descrição detalhada');
    expect(result.service.nome).toBe(mockService.nome); // Mantém o valor original
  });

  it('deve permitir atualizar apenas a categoria do serviço', async () => {
    const partialUpdateMock = {
      ...mockService,
      categoria: 'Nova categoria',
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(partialUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      categoria: 'Nova categoria',
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.categoria).toBe('Nova categoria');
    expect(result.service.nome).toBe(mockService.nome); // Mantém o valor original
  });

  it('deve permitir atualizar o status ativo do serviço', async () => {
    const statusUpdateMock = {
      ...mockService,
      ativo: false,
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.update.mockResolvedValue(statusUpdateMock);

    const updateData: Prisma.ServiceUpdateInput = {
      ativo: false,
    };

    const result = await sut.execute({
      id: 'service-1',
      data: updateData,
    });

    expect(result.service.ativo).toBe(false);
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
