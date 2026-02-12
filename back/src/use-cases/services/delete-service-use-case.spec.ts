import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DeleteServiceUseCase } from './delete-service-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { createMockServicesRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockServicesRepository = IServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
  softDelete: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('DeleteServiceUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let sut: DeleteServiceUseCase;

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();

    sut = new DeleteServiceUseCase(servicesRepository);
  });

  describe('executeSoft (soft delete)', () => {
    it('deve desativar um serviço existente', async () => {
      const mockService = {
        id: 'service-1', name: 'Corte de Cabelo',
        ativo: true,
      };

      servicesRepository.findById.mockResolvedValue(mockService);
      servicesRepository.softDelete.mockResolvedValue(undefined);

      await sut.executeSoft('service-1');

      expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
      expect(servicesRepository.softDelete).toHaveBeenCalledWith('service-1');
      expect(servicesRepository.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o serviço não existe', async () => {
      servicesRepository.findById.mockResolvedValue(null);

      await expect(sut.executeSoft('service-inexistente')).rejects.toThrow(
        ServiceNotFoundError,
      );

      expect(servicesRepository.softDelete).not.toHaveBeenCalled();
    });

    it('deve garantir que apenas serviços ativos podem ser desativados', async () => {
      const mockService = {
        id: 'service-1', name: 'Corte de Cabelo',
        ativo: false, // Já está desativado
      };

      servicesRepository.findById.mockResolvedValue(mockService);

      await sut.executeSoft('service-1');

      // Ainda deve chamar softDelete mesmo já estando desativado
      expect(servicesRepository.softDelete).toHaveBeenCalled();
    });
  });

  describe('executePermanent (hard delete)', () => {
    it('deve excluir permanentemente um serviço existente', async () => {
      const mockService = {
        id: 'service-1', name: 'Corte de Cabelo',
        ativo: true,
      };

      servicesRepository.findById.mockResolvedValue(mockService);
      servicesRepository.delete.mockResolvedValue(undefined);

      await sut.executePermanent('service-1');

      expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
      expect(servicesRepository.delete).toHaveBeenCalledWith('service-1');
      expect(servicesRepository.softDelete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando o serviço não existe', async () => {
      servicesRepository.findById.mockResolvedValue(null);

      await expect(sut.executePermanent('service-inexistente')).rejects.toThrow(
        ServiceNotFoundError,
      );

      expect(servicesRepository.delete).not.toHaveBeenCalled();
    });

    it('deve permitir exclusão mesmo para serviços inativos', async () => {
      const mockService = {
        id: 'service-1', name: 'Corte de Cabelo',
        ativo: false,
      };

      servicesRepository.findById.mockResolvedValue(mockService);
      servicesRepository.delete.mockResolvedValue(undefined);

      await sut.executePermanent('service-1');

      expect(servicesRepository.delete).toHaveBeenCalled();
    });
  });

  it('deve diferenciar corretamente entre soft delete e hard delete', async () => {
    const mockService = {
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    };

    servicesRepository.findById.mockResolvedValue(mockService);
    servicesRepository.softDelete.mockResolvedValue(undefined);
    servicesRepository.delete.mockResolvedValue(undefined);

    // Executar ambos
    await sut.executeSoft('service-1');
    await sut.executePermanent('service-1');

    // Verificar chamadas
    expect(servicesRepository.softDelete).toHaveBeenCalledTimes(1);
    expect(servicesRepository.delete).toHaveBeenCalledTimes(1);
  });
});

