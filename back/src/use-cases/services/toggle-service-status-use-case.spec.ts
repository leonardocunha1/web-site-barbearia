import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ToggleServiceStatusUseCase } from './toggle-service-status-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { Service } from '@prisma/client';
import { createMockServicesRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockServicesRepository = IServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
  toggleStatus: ReturnType<typeof vi.fn>;
};

describe('ToggleServiceStatusUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let sut: ToggleServiceStatusUseCase;

  // Dados mockados para os testes
  const mockActiveService: Service = {
    id: 'service-1', name: 'Corte de Cabelo', description: 'Corte básico',
    categoria: 'Cabelo',
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInactiveService: Service = {
    ...mockActiveService,
    ativo: false,
  };

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();

    sut = new ToggleServiceStatusUseCase(servicesRepository);
  });

  it('deve alternar o status de ativo para inativo', async () => {
    // Configura o mock para retornar um serviço ativo
    servicesRepository.findById.mockResolvedValue(mockActiveService);
    // Configura o mock para retornar o serviço como inativo após o toggle
    servicesRepository.toggleStatus.mockResolvedValue(mockInactiveService);

    const result = await sut.execute({ id: 'service-1' });

    // Verifica se o serviço retornado está inativo
    expect(result.service.active).toBe(false);
    // Verifica se findById foi chamado com o ID correto
    expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
    // Verifica se toggleStatus foi chamado com os parâmetros corretos
    expect(servicesRepository.toggleStatus).toHaveBeenCalledWith(
      'service-1',
      false,
    );
  });

  it('deve alternar o status de inativo para ativo', async () => {
    // Configura o mock para retornar um serviço inativo
    servicesRepository.findById.mockResolvedValue(mockInactiveService);
    // Configura o mock para retornar o serviço como ativo após o toggle
    servicesRepository.toggleStatus.mockResolvedValue(mockActiveService);

    const result = await sut.execute({ id: 'service-1' });

    // Verifica se o serviço retornado está ativo
    expect(result.service.active).toBe(true);
    // Verifica se toggleStatus foi chamado com os parâmetros corretos
    expect(servicesRepository.toggleStatus).toHaveBeenCalledWith(
      'service-1',
      true,
    );
  });

  it('deve lançar erro quando o serviço não existe', async () => {
    // Configura o mock para retornar null (serviço não encontrado)
    servicesRepository.findById.mockResolvedValue(null);

    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toThrow(
      ServiceNotFoundError,
    );

    // Verifica se findById foi chamado com o ID correto
    expect(servicesRepository.findById).toHaveBeenCalledWith('non-existent-id');
    // Verifica se toggleStatus não foi chamado
    expect(servicesRepository.toggleStatus).not.toHaveBeenCalled();
  });

  it('deve manter outras propriedades do serviço inalteradas', async () => {
    // Configura o mock para retornar um serviço ativo
    servicesRepository.findById.mockResolvedValue(mockActiveService);
    // Configura o mock para retornar o serviço como inativo após o toggle
    servicesRepository.toggleStatus.mockResolvedValue(mockInactiveService);

    const result = await sut.execute({ id: 'service-1' });

    // Verifica se as outras propriedades permanecem iguais
    expect(result.service.id).toBe(mockActiveService.id);
    expect(result.service.name).toBe(mockActiveService.name);
    expect(result.service.description).toBe(mockActiveService.description);
    expect(result.service.category).toBe(mockActiveService.category);
    // Apenas o status ativo deve ter mudado
    expect(result.service.active).not.toBe(mockActiveService.active);
  });

  it('deve chamar o repositório com o novo status invertido', async () => {
    // Testa a lógica de inversão do status
    servicesRepository.findById.mockResolvedValueOnce(mockActiveService);
    servicesRepository.toggleStatus.mockResolvedValueOnce(mockInactiveService);

    await sut.execute({ id: 'service-1' });
    expect(servicesRepository.toggleStatus).toHaveBeenCalledWith(
      'service-1',
      false,
    );

    // Limpa os mocks para o próximo teste
    vi.clearAllMocks();

    // Testa com serviço inativo
    servicesRepository.findById.mockResolvedValueOnce(mockInactiveService);
    servicesRepository.toggleStatus.mockResolvedValueOnce(mockActiveService);

    await sut.execute({ id: 'service-1' });
    expect(servicesRepository.toggleStatus).toHaveBeenCalledWith(
      'service-1',
      true,
    );
  });
});

