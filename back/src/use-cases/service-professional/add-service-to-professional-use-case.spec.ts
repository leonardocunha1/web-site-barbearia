import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AddServiceToProfessionalUseCase } from './add-service-to-professional-use-case';
import { IServicesRepository } from '@/repositories/services-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ServiceAlreadyAddedError } from '../errors/service-already-added-error';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';
import {
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
  createMockServicesRepository,
} from '@/mock/mock-repositories';

// Tipos para os mocks
type MockServicesRepository = IServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockServiceProfessionalRepository = IServiceProfessionalRepository & {
  findByServiceAndProfessional: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

describe('AddServiceToProfessionalUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let professionalsRepository: MockProfessionalsRepository;
  let serviceProfessionalRepository: MockServiceProfessionalRepository;
  let sut: AddServiceToProfessionalUseCase;

  beforeEach(() => {
    servicesRepository = createMockServicesRepository();
    professionalsRepository = createMockProfessionalsRepository();
    serviceProfessionalRepository = createMockServiceProfessionalRepository();

    sut = new AddServiceToProfessionalUseCase(
      servicesRepository,
      professionalsRepository,
      serviceProfessionalRepository,
    );
  });

  it('deve adicionar um serviço a um profissional com sucesso', async () => {
    // Configurar mocks
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    });

    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      null,
    );
    serviceProfessionalRepository.create.mockResolvedValue({
      id: 'sp-1',
      serviceId: 'service-1',
      professionalId: 'prof-1', price: 50, duration: 30,
    });

    // Executar
    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'prof-1', price: 50, duration: 30,
    });

    // Verificar
    expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-1');
    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'prof-1');
    expect(serviceProfessionalRepository.create).toHaveBeenCalledWith({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: 'prof-1' } }, price: 50, duration: 30,
    });
  });

  it('deve lançar erro quando o serviço não existe', async () => {
    servicesRepository.findById.mockResolvedValue(null);
    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    await expect(
      sut.execute({
        serviceId: 'service-inexistente',
        professionalId: 'prof-1', price: 50, duration: 30,
      }),
    ).rejects.toThrow(ServiceNotFoundError);
  });

  it('deve lançar erro quando o profissional não existe', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    });
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-inexistente', price: 50, duration: 30,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro quando o serviço já foi adicionado ao profissional', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    });

    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'prof-1',
        service: {
          id: 'service-1', name: 'Corte de Cabelo', description: null,
          categoria: null,
          ativo: true,
        }, price: 50, duration: 30,
      },
    );

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1', price: 50, duration: 30,
      }),
    ).rejects.toThrow(ServiceAlreadyAddedError);
  });

  it('deve lançar erro quando o preço é inválido', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    });

    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    // Teste para preço zero
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1', price: 0, duration: 30,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Teste para preço negativo
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1', price: -10, duration: 30,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Verifica que o repositório não foi chamado
    expect(serviceProfessionalRepository.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a duração é inválida', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    });

    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    // Teste para duração zero
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1', price: 50, duration: 0,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Teste para duração negativa
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1', price: 50, duration: -30,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Verifica que o repositório não foi chamado
    expect(serviceProfessionalRepository.create).not.toHaveBeenCalled();
  });

  it('deve permitir preço e duração decimais válidos', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1', name: 'Corte de Cabelo',
      ativo: true,
    });

    professionalsRepository.findById.mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      ativo: true,
    });

    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      null,
    );
    serviceProfessionalRepository.create.mockResolvedValue({
      id: 'sp-1',
      serviceId: 'service-1',
      professionalId: 'prof-1', price: 49.99, duration: 45.5,
    });

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1', price: 49.99, duration: 45.5,
      }),
    ).resolves.not.toThrow();
  });
});

