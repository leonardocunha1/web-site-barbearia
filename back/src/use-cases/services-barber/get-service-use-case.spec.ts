import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { GetServiceUseCase } from './get-service-use-case';

let servicesRepository: InMemoryServicesRepository;
let getServiceUseCase: GetServiceUseCase;

describe('GetServiceUseCase', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    getServiceUseCase = new GetServiceUseCase(servicesRepository);
  });

  it('deve retornar um serviço existente pelo ID', async () => {
    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      descricao: 'Corte masculino ou feminino',
      precoPadrao: 50,
      duracao: 30,
      categoria: 'Beleza',
    });

    const result = await getServiceUseCase.execute({ id: service.id });

    expect(result.service).toEqual(service);
  });

  it('deve lançar erro se o serviço não for encontrado', async () => {
    await expect(() =>
      getServiceUseCase.execute({ id: 'id-inexistente' }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });
});
