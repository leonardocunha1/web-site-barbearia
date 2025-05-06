import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AddServiceToProfessionalUseCase } from './add-service-to-professional-use-case';
import { ServicesRepository } from '@/repositories/services-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ServiceAlreadyAddedError } from '../errors/service-already-added-error';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';

// Tipos para os mocks
type MockServicesRepository = ServicesRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

type MockServiceProfessionalRepository = ServiceProfessionalRepository & {
  findByServiceAndProfessional: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

describe('AddServiceToProfessionalUseCase', () => {
  let servicesRepository: MockServicesRepository;
  let professionalsRepository: MockProfessionalsRepository;
  let serviceProfessionalRepository: MockServiceProfessionalRepository;
  let sut: AddServiceToProfessionalUseCase;

  beforeEach(() => {
    servicesRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      findByName: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      softDelete: vi.fn(),
      toggleStatus: vi.fn(),
      list: vi.fn(),
      existsProfessional: vi.fn(),
    };

    professionalsRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByProfessionalId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
      search: vi.fn(),
      countSearch: vi.fn(),
    };

    serviceProfessionalRepository = {
      findByServiceAndProfessional: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findByProfessional: vi.fn(),
      updateByServiceAndProfessional: vi.fn(),
    };

    sut = new AddServiceToProfessionalUseCase(
      servicesRepository,
      professionalsRepository,
      serviceProfessionalRepository,
    );
  });

  it('deve adicionar um serviço a um profissional com sucesso', async () => {
    // Configurar mocks
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      nome: 'Corte de Cabelo',
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
      professionalId: 'prof-1',
      preco: 50,
      duracao: 30,
    });

    // Executar
    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'prof-1',
      preco: 50,
      duracao: 30,
    });

    // Verificar
    expect(servicesRepository.findById).toHaveBeenCalledWith('service-1');
    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-1');
    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'prof-1');
    expect(serviceProfessionalRepository.create).toHaveBeenCalledWith({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: 'prof-1' } },
      preco: 50,
      duracao: 30,
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
        professionalId: 'prof-1',
        preco: 50,
        duracao: 30,
      }),
    ).rejects.toThrow(ServiceNotFoundError);
  });

  it('deve lançar erro quando o profissional não existe', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      nome: 'Corte de Cabelo',
      ativo: true,
    });
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-inexistente',
        preco: 50,
        duracao: 30,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro quando o serviço já foi adicionado ao profissional', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      nome: 'Corte de Cabelo',
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
          id: 'service-1',
          nome: 'Corte de Cabelo',
          descricao: null,
          categoria: null,
          ativo: true,
        },
        preco: 50,
        duracao: 30,
      },
    );

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
        preco: 50,
        duracao: 30,
      }),
    ).rejects.toThrow(ServiceAlreadyAddedError);
  });

  it('deve lançar erro quando o preço é inválido', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      nome: 'Corte de Cabelo',
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
        professionalId: 'prof-1',
        preco: 0,
        duracao: 30,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Teste para preço negativo
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
        preco: -10,
        duracao: 30,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Verifica que o repositório não foi chamado
    expect(serviceProfessionalRepository.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a duração é inválida', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      nome: 'Corte de Cabelo',
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
        professionalId: 'prof-1',
        preco: 50,
        duracao: 0,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Teste para duração negativa
    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
        preco: 50,
        duracao: -30,
      }),
    ).rejects.toThrow(InvalidServicePriceDurationError);

    // Verifica que o repositório não foi chamado
    expect(serviceProfessionalRepository.create).not.toHaveBeenCalled();
  });

  it('deve permitir preço e duração decimais válidos', async () => {
    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      nome: 'Corte de Cabelo',
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
      professionalId: 'prof-1',
      preco: 49.99,
      duracao: 45.5,
    });

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
        preco: 49.99,
        duracao: 45.5,
      }),
    ).resolves.not.toThrow();
  });
});
