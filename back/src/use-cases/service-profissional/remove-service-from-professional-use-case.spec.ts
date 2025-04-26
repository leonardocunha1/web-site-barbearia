import { RemoveServiceFromProfessionalUseCase } from './remove-service-from-professional-use-case';
import { InMemoryServiceProfessionalRepository } from '@/repositories/in-memory/in-memory-service-professional-repository';
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { ServiceWithBookingsError } from '../errors/service-with-bookings-error';
import { beforeEach, describe, expect, it } from 'vitest';

describe('RemoveServiceFromProfessionalUseCase', () => {
  let serviceProfessionalRepository: InMemoryServiceProfessionalRepository;
  let bookingsRepository: InMemoryBookingsRepository;
  let sut: RemoveServiceFromProfessionalUseCase;

  beforeEach(() => {
    serviceProfessionalRepository = new InMemoryServiceProfessionalRepository();
    bookingsRepository = new InMemoryBookingsRepository();
    sut = new RemoveServiceFromProfessionalUseCase(
      serviceProfessionalRepository,
      bookingsRepository,
    );
  });

  it('should remove a service from a professional successfully', async () => {
    // Criar relação serviço-profissional
    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: 'professional-1' } },
      preco: 100,
      duracao: 60,
    });

    // Executar
    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'professional-1',
    });

    // Verificar se foi removido
    const result =
      await serviceProfessionalRepository.findByServiceAndProfessional(
        'service-1',
        'professional-1',
      );
    expect(result).toBeNull();
  });

  it('should throw error when service-professional relation does not exist', async () => {
    await expect(
      sut.execute({
        serviceId: 'non-existent-service',
        professionalId: 'non-existent-professional',
      }),
    ).rejects.toBeInstanceOf(ServiceProfessionalNotFoundError);
  });

  it('should throw error when service has active bookings', async () => {
    // Criar relação
    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: 'professional-1' } },
      preco: 100,
      duracao: 60,
    });

    // Criar booking ativo
    bookingsRepository.items.push({
      id: 'booking-1',
      items: [
        {
          service: {
            id: 'service-1',
            nome: 'Test Service',
          },
        },
      ],
      profissionalId: 'professional-1',
      user: { nome: 'Test User', id: 'user-1' },
      status: 'CONFIRMADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      canceledAt: null,
      confirmedAt: null,
      observacoes: null,
      dataHoraInicio: new Date(),
      dataHoraFim: new Date(new Date().getTime() + 60 * 60 * 1000),
      valorFinal: 100,
      usuarioId: 'user-1',
    });

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'professional-1',
      }),
    ).rejects.toBeInstanceOf(ServiceWithBookingsError);
  });

  it('should allow removal when service only has canceled bookings', async () => {
    // Criar relação
    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: 'professional-1' } },
      preco: 100,
      duracao: 60,
    });

    // Criar booking cancelado
    bookingsRepository.items.push({
      id: 'booking-1',
      items: [{ service: { nome: 'item1', id: 'item-1' } }],
      profissionalId: 'professional-1',
      user: { nome: 'user1', id: 'user-1' },
      status: 'CANCELADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      canceledAt: null,
      confirmedAt: null,
      observacoes: null,
      dataHoraInicio: new Date(),
      dataHoraFim: new Date(new Date().getTime() + 60 * 60 * 1000),
      valorFinal: 100,
      usuarioId: 'user-1',
    });

    // Executar (não deve lançar erro)
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'professional-1',
      }),
    ).resolves.not.toThrow();
  });
});
