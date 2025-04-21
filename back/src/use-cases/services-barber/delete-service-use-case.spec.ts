import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { DeleteServiceUseCase } from './delete-service-use-case';

let servicesRepository: InMemoryServicesRepository;
let deleteServiceUseCase: DeleteServiceUseCase;

describe('DeleteServiceUseCase', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    deleteServiceUseCase = new DeleteServiceUseCase(servicesRepository);
  });

  it('deve fazer soft delete de um serviço existente', async () => {
    const service = await servicesRepository.create({
      nome: 'Depilação',
      descricao: 'Serviço de depilação',
      precoPadrao: 80,
      duracao: 60,
      categoria: 'Estética',
    });

    await deleteServiceUseCase.executeSoft(service.id);

    const updatedService = await servicesRepository.findById(service.id);
    expect(updatedService?.ativo).toBe(false);
  });

  it('deve lançar erro ao fazer soft delete de serviço inexistente', async () => {
    await expect(() =>
      deleteServiceUseCase.executeSoft('serviço-inexistente'),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });

  it('deve deletar permanentemente um serviço existente', async () => {
    const service = await servicesRepository.create({
      nome: 'Massagem Relaxante',
      descricao: 'Massagem para relaxamento',
      precoPadrao: 100,
      duracao: 90,
      categoria: 'Bem-estar',
    });

    await deleteServiceUseCase.executePermanent(service.id);

    const deletedService = await servicesRepository.findById(service.id);
    expect(deletedService).toBeNull();
  });

  it('deve lançar erro ao tentar deletar permanentemente um serviço inexistente', async () => {
    await expect(() =>
      deleteServiceUseCase.executePermanent('serviço-inexistente'),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });
});
