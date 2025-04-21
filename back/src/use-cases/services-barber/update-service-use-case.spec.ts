import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { UpdateServiceUseCase } from './update-service-use-case';

let servicesRepository: InMemoryServicesRepository;
let updateServiceUseCase: UpdateServiceUseCase;

describe('UpdateServiceUseCase', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    updateServiceUseCase = new UpdateServiceUseCase(servicesRepository);
  });

  it('deve atualizar os dados de um serviço existente', async () => {
    const createdService = await servicesRepository.create({
      nome: 'Barba',
      precoPadrao: 20,
      duracao: 15,
      categoria: 'Cabelo',
      ativo: true,
    });

    const { service: updatedService } = await updateServiceUseCase.execute({
      id: createdService.id,
      data: {
        nome: 'Barba e Sobrancelha',
        precoPadrao: 30,
      },
    });

    expect(updatedService.nome).toBe('Barba e Sobrancelha');
    expect(updatedService.precoPadrao).toBe(30);
    expect(updatedService.id).toBe(createdService.id);
  });

  it('deve lançar um erro se o serviço não for encontrado', async () => {
    await expect(() =>
      updateServiceUseCase.execute({
        id: 'non-existent-id',
        data: {
          nome: 'Atualização Inútil',
        },
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });
});
