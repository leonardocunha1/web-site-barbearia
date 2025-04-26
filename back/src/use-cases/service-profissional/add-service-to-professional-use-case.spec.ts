import { AddServiceToProfessionalUseCase } from './add-service-to-professional-use-case';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { InMemoryServiceProfessionalRepository } from '@/repositories/in-memory/in-memory-service-professional-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ServiceAlreadyAddedError } from '../errors/service-already-added-error';
import { describe, expect, beforeEach, it } from 'vitest';

describe('AddServiceToProfessionalUseCase', () => {
  let servicesRepository: InMemoryServicesRepository;
  let professionalsRepository: InMemoryProfessionalsRepository;
  let serviceProfessionalRepository: InMemoryServiceProfessionalRepository;
  let sut: AddServiceToProfessionalUseCase;

  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    serviceProfessionalRepository = new InMemoryServiceProfessionalRepository();
    sut = new AddServiceToProfessionalUseCase(
      servicesRepository,
      professionalsRepository,
      serviceProfessionalRepository,
    );
  });

  it('should be able to add a service to a professional', async () => {
    // Criar um serviço
    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 30,
    });

    // Criar um profissional
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    // Executar o caso de uso
    await sut.execute({
      serviceId: service.id,
      professionalId: professional.id,
    });

    // Verificar se a relação foi criada
    const relation =
      await serviceProfessionalRepository.findByServiceAndProfessional(
        service.id,
        professional.id,
      );

    expect(relation).toBeTruthy();
    expect(relation?.preco).toBe(50); // Deve usar o preço padrão do serviço
    expect(relation?.duracao).toBe(30); // Deve usar a duração padrão do serviço
  });

  it('should be able to add a service with custom price and duration', async () => {
    const service = await servicesRepository.create({
      nome: 'Massagem',
      precoPadrao: 100,
      duracao: 60,
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Massoterapeuta',
    });

    await sut.execute({
      serviceId: service.id,
      professionalId: professional.id,
      preco: 120,
      duracao: 90,
    });

    const relation =
      await serviceProfessionalRepository.findByServiceAndProfessional(
        service.id,
        professional.id,
      );

    expect(relation?.preco).toBe(120);
    expect(relation?.duracao).toBe(90);
  });

  it('should not be able to add a non-existing service to a professional', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    await expect(
      sut.execute({
        serviceId: 'non-existing-service-id',
        professionalId: professional.id,
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });

  it('should not be able to add a service to a non-existing professional', async () => {
    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 30,
    });

    await expect(
      sut.execute({
        serviceId: service.id,
        professionalId: 'non-existing-professional-id',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should not be able to add the same service twice to the same professional', async () => {
    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 30,
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    await sut.execute({
      serviceId: service.id,
      professionalId: professional.id,
    });

    await expect(
      sut.execute({
        serviceId: service.id,
        professionalId: professional.id,
      }),
    ).rejects.toBeInstanceOf(ServiceAlreadyAddedError);
  });

  it('should use default price and duration when not provided', async () => {
    const service = await servicesRepository.create({
      nome: 'Manicure',
      precoPadrao: 40,
      duracao: 45,
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Manicure',
    });

    await sut.execute({
      serviceId: service.id,
      professionalId: professional.id,
    });

    const relation =
      await serviceProfessionalRepository.findByServiceAndProfessional(
        service.id,
        professional.id,
      );

    expect(relation?.preco).toBe(40);
    expect(relation?.duracao).toBe(45);
  });
});
