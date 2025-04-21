import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { ListServicesUseCase } from './list-services-use-case';

let servicesRepository: InMemoryServicesRepository;
let listServicesUseCase: ListServicesUseCase;

describe('ListServicesUseCase', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    listServicesUseCase = new ListServicesUseCase(servicesRepository);
  });

  it('deve listar serviços com paginação', async () => {
    // Criando 3 serviços no repositório in memory
    await servicesRepository.create({
      nome: 'Corte Masculino',
      precoPadrao: 30,
      duracao: 20,
      categoria: 'Cabelo',
    });

    await servicesRepository.create({
      nome: 'Corte Feminino',
      precoPadrao: 50,
      duracao: 40,
      categoria: 'Cabelo',
    });

    await servicesRepository.create({
      nome: 'Depilação',
      precoPadrao: 40,
      duracao: 30,
      categoria: 'Pele',
    });

    const { services, total, totalPages } = await listServicesUseCase.execute({
      page: 1,
      limit: 2,
    });

    expect(services).toHaveLength(2);
    expect(total).toBe(3);
    expect(totalPages).toBe(2);
  });

  it('deve filtrar por nome (case insensitive)', async () => {
    await servicesRepository.create({
      nome: 'Corte Feminino',
      precoPadrao: 50,
      duracao: 40,
      categoria: 'Cabelo',
    });

    await servicesRepository.create({
      nome: 'Manicure',
      precoPadrao: 25,
      duracao: 30,
      categoria: 'Unhas',
    });

    const result = await listServicesUseCase.execute({
      page: 1,
      limit: 10,
      nome: 'mani', // filtro por parte do nome
    });

    expect(result.services).toHaveLength(1);
    expect(result.services[0].nome).toBe('Manicure');
  });

  it('deve retornar página vazia se não houver correspondência', async () => {
    await servicesRepository.create({
      nome: 'Pedicure',
      precoPadrao: 35,
      duracao: 25,
      categoria: 'Unhas',
    });

    const result = await listServicesUseCase.execute({
      page: 1,
      limit: 10,
      nome: 'Corte Masculino',
    });

    expect(result.services).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });
});
