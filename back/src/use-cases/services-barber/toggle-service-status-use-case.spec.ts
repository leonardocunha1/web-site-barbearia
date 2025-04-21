import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { ToggleServiceStatusUseCase } from './toggle-service-status-use-case';

let servicesRepository: InMemoryServicesRepository;
let toggleServiceStatusUseCase: ToggleServiceStatusUseCase;

describe('ToggleServiceStatusUseCase', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    toggleServiceStatusUseCase = new ToggleServiceStatusUseCase(
      servicesRepository,
    );
  });

  it('deve alternar o status do serviço de ativo para inativo', async () => {
    const service = await servicesRepository.create({
      nome: 'Corte Masculino',
      precoPadrao: 30,
      duracao: 20,
      categoria: 'Cabelo',
      ativo: true,
    });

    const { service: updatedService } =
      await toggleServiceStatusUseCase.execute({
        id: service.id,
      });

    expect(updatedService.ativo).toBe(false);
  });

  it('deve alternar o status do serviço de inativo para ativo', async () => {
    const service = await servicesRepository.create({
      nome: 'Corte Feminino',
      precoPadrao: 50,
      duracao: 30,
      categoria: 'Cabelo',
      ativo: false,
    });

    const { service: updatedService } =
      await toggleServiceStatusUseCase.execute({
        id: service.id,
      });

    expect(updatedService.ativo).toBe(true);
  });

  it('deve lançar erro se o serviço não existir', async () => {
    await expect(() =>
      toggleServiceStatusUseCase.execute({
        id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });
});
