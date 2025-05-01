import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RemoveServiceFromProfessionalUseCase } from './remove-service-from-professional-use-case';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { ServiceWithBookingsError } from '../errors/service-with-bookings-error';

describe('RemoveServiceFromProfessionalUseCase', () => {
  let serviceProfessionalRepository: ServiceProfessionalRepository;
  let bookingsRepository: BookingsRepository;
  let sut: RemoveServiceFromProfessionalUseCase;

  beforeEach(() => {
    serviceProfessionalRepository = {
      findByServiceAndProfessional: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
      findByProfessional: vi.fn(),
    };

    bookingsRepository = {
      countActiveByServiceAndProfessional: vi.fn(),
      // Adicione outros métodos que possam ser necessários para os testes
    } as unknown as BookingsRepository;

    sut = new RemoveServiceFromProfessionalUseCase(
      serviceProfessionalRepository,
      bookingsRepository,
    );
  });

  it('should remove service from professional when no bookings exist', async () => {
    // Arrange
    const mockRelation = {
      id: 'relation-1',
      serviceId: 'service-1',
      professionalId: 'professional-1',
      preco: 100,
      duracao: 60,
    };

    vi.mocked(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).mockResolvedValueOnce(mockRelation);
    vi.mocked(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).mockResolvedValueOnce(0);

    // Act
    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'professional-1',
    });

    // Assert
    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'professional-1');
    expect(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'professional-1');
    expect(serviceProfessionalRepository.delete).toHaveBeenCalledWith(
      'relation-1',
    );
  });

  it('should throw ServiceProfessionalNotFoundError when relation does not exist', async () => {
    // Arrange
    vi.mocked(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).mockResolvedValueOnce(null);

    // Act & Assert
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'professional-1',
      }),
    ).rejects.toBeInstanceOf(ServiceProfessionalNotFoundError);

    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'professional-1');
    expect(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).not.toHaveBeenCalled();
    expect(serviceProfessionalRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw ServiceWithBookingsError when service has active bookings', async () => {
    // Arrange
    const mockRelation = {
      id: 'relation-1',
      serviceId: 'service-1',
      professionalId: 'professional-1',
      preco: 100,
      duracao: 60,
    };

    vi.mocked(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).mockResolvedValueOnce(mockRelation);
    vi.mocked(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).mockResolvedValueOnce(1);

    // Act & Assert
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'professional-1',
      }),
    ).rejects.toBeInstanceOf(ServiceWithBookingsError);

    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'professional-1');
    expect(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'professional-1');
    expect(serviceProfessionalRepository.delete).not.toHaveBeenCalled();
  });
});
