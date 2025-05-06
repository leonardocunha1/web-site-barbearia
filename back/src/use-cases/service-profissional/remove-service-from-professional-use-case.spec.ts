import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RemoveServiceFromProfessionalUseCase } from './remove-service-from-professional-use-case';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { ServiceWithBookingsError } from '../errors/service-with-bookings-error';
import {
  createMockBookingsRepository,
  createMockServiceProfessionalRepository,
} from '@/mock/mock-repositories';

// Tipos para os mocks
type MockServiceProfessionalRepository = ServiceProfessionalRepository & {
  findByServiceAndProfessional: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

type MockBookingsRepository = BookingsRepository & {
  countActiveByServiceAndProfessional: ReturnType<typeof vi.fn>;
};

describe('RemoveServiceFromProfessionalUseCase', () => {
  let serviceProfessionalRepository: MockServiceProfessionalRepository;
  let bookingsRepository: MockBookingsRepository;
  let sut: RemoveServiceFromProfessionalUseCase;

  beforeEach(() => {
    serviceProfessionalRepository = createMockServiceProfessionalRepository();
    bookingsRepository = createMockBookingsRepository();

    sut = new RemoveServiceFromProfessionalUseCase(
      serviceProfessionalRepository,
      bookingsRepository,
    );
  });

  it('deve remover um serviço de um profissional com sucesso', async () => {
    // Mock da relação existente
    const mockRelation = {
      id: 'relation-1',
      professionalId: 'prof-1',
      service: {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Descrição do serviço',
        categoria: 'Cabelo',
        ativo: true,
      },
      preco: 50,
      duracao: 30,
    };

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      mockRelation,
    );
    bookingsRepository.countActiveByServiceAndProfessional.mockResolvedValue(0);
    serviceProfessionalRepository.delete.mockResolvedValue(undefined);

    // Executar
    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'prof-1',
    });

    // Verificar
    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'prof-1');
    expect(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'prof-1');
    expect(serviceProfessionalRepository.delete).toHaveBeenCalledWith(
      'relation-1',
    );
  });

  it('deve lançar erro quando a relação serviço-profissional não existe', async () => {
    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      null,
    );

    await expect(
      sut.execute({
        serviceId: 'service-inexistente',
        professionalId: 'prof-1',
      }),
    ).rejects.toThrow(ServiceProfessionalNotFoundError);

    expect(
      bookingsRepository.countActiveByServiceAndProfessional,
    ).not.toHaveBeenCalled();
    expect(serviceProfessionalRepository.delete).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando existem agendamentos ativos para o serviço', async () => {
    const mockRelation = {
      id: 'relation-1',
      professionalId: 'prof-1',
      service: {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Descrição do serviço',
        categoria: 'Cabelo',
        ativo: true,
      },
      preco: 50,
      duracao: 30,
    };

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      mockRelation,
    );
    bookingsRepository.countActiveByServiceAndProfessional.mockResolvedValue(2); // 2 agendamentos ativos

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
      }),
    ).rejects.toThrow(ServiceWithBookingsError);

    expect(serviceProfessionalRepository.delete).not.toHaveBeenCalled();
  });

  it('deve permitir remoção quando não há agendamentos ativos', async () => {
    const mockRelation = {
      id: 'relation-1',
      professionalId: 'prof-1',
      service: {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Descrição do serviço',
        categoria: 'Cabelo',
        ativo: true,
      },
      preco: 50,
      duracao: 30,
    };

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      mockRelation,
    );
    bookingsRepository.countActiveByServiceAndProfessional.mockResolvedValue(0); // Nenhum agendamento ativo

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
      }),
    ).resolves.not.toThrow();

    expect(serviceProfessionalRepository.delete).toHaveBeenCalledWith(
      'relation-1',
    );
  });

  it('deve chamar o repositório com o ID correto da relação', async () => {
    const mockRelation = {
      id: 'relation-123',
      professionalId: 'prof-1',
      service: {
        id: 'service-1',
        nome: 'Corte de Cabelo',
        descricao: 'Descrição do serviço',
        categoria: 'Cabelo',
        ativo: true,
      },
      preco: 50,
      duracao: 30,
    };

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      mockRelation,
    );
    bookingsRepository.countActiveByServiceAndProfessional.mockResolvedValue(0);

    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'prof-1',
    });

    expect(serviceProfessionalRepository.delete).toHaveBeenCalledWith(
      'relation-123',
    );
  });
});
