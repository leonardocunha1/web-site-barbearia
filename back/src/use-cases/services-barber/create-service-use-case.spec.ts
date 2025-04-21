import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { ServiceAlreadyExistsError } from '@/use-cases/errors/service-already-exists-error';
import { CreateServiceUseCase } from './create-service-use-case';

let servicesRepository: InMemoryServicesRepository;
let createServiceUseCase: CreateServiceUseCase;

describe('CreateServiceUseCase', () => {
  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    createServiceUseCase = new CreateServiceUseCase(servicesRepository);
  });

  it('deve criar um novo serviço com sucesso', async () => {
    const result = await createServiceUseCase.execute({
      nome: 'Corte de Cabelo',
      descricao: 'Um corte clássico',
      precoPadrao: 50,
      duracao: 30,
      categoria: 'Cabelo',
    });

    expect(result.service).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nome: 'Corte de Cabelo',
        descricao: 'Um corte clássico',
        precoPadrao: 50,
        duracao: 30,
        categoria: 'Cabelo',
        ativo: true,
      }),
    );
  });

  it('não deve permitir criar um serviço com nome duplicado', async () => {
    await createServiceUseCase.execute({
      nome: 'Corte de Cabelo',
      descricao: 'Um corte clássico',
      precoPadrao: 50,
      duracao: 30,
      categoria: 'Cabelo',
    });

    await expect(() =>
      createServiceUseCase.execute({
        nome: 'Corte de Cabelo',
        descricao: 'Outro corte',
        precoPadrao: 60,
        duracao: 45,
        categoria: 'Cabelo',
      }),
    ).rejects.toBeInstanceOf(ServiceAlreadyExistsError);
  });
});
