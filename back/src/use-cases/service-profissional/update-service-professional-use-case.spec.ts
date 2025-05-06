import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateServiceProfessionalUseCase } from './update-service-professional-use-case';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';

// Tipo para o mock do repositório
type MockServiceProfessionalRepository = ServiceProfessionalRepository & {
  findByServiceAndProfessional: ReturnType<typeof vi.fn>;
  updateByServiceAndProfessional: ReturnType<typeof vi.fn>;
};

describe('UpdateServiceProfessionalUseCase', () => {
  let serviceProfessionalRepository: MockServiceProfessionalRepository;
  let sut: UpdateServiceProfessionalUseCase;

  beforeEach(() => {
    serviceProfessionalRepository = {
      findByServiceAndProfessional: vi.fn(),
      updateByServiceAndProfessional: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findByProfessional: vi.fn(),
    };

    sut = new UpdateServiceProfessionalUseCase(serviceProfessionalRepository);
  });

  it('deve atualizar preço e duração de um serviço profissional com sucesso', async () => {
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
    serviceProfessionalRepository.updateByServiceAndProfessional.mockResolvedValue(
      undefined,
    );

    // Executar
    await sut.execute({
      serviceId: 'service-1',
      professionalId: 'prof-1',
      preco: 60,
      duracao: 45,
    });

    // Verificar
    expect(
      serviceProfessionalRepository.findByServiceAndProfessional,
    ).toHaveBeenCalledWith('service-1', 'prof-1');
    expect(
      serviceProfessionalRepository.updateByServiceAndProfessional,
    ).toHaveBeenCalledWith({
      serviceId: 'service-1',
      professionalId: 'prof-1',
      preco: 60,
      duracao: 45,
    });
  });

  it('deve lançar erro quando o preço é inválido', async () => {
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

    expect(
      serviceProfessionalRepository.updateByServiceAndProfessional,
    ).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a duração é inválida', async () => {
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

    expect(
      serviceProfessionalRepository.updateByServiceAndProfessional,
    ).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o serviço não existe para o profissional', async () => {
    serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      null,
    );

    await expect(
      sut.execute({
        serviceId: 'service-inexistente',
        professionalId: 'prof-1',
        preco: 50,
        duracao: 30,
      }),
    ).rejects.toThrow('Serviço não encontrado para esse profissional.');

    expect(
      serviceProfessionalRepository.updateByServiceAndProfessional,
    ).not.toHaveBeenCalled();
  });

  it('deve permitir valores decimais válidos para preço e duração', async () => {
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
    serviceProfessionalRepository.updateByServiceAndProfessional.mockResolvedValue(
      undefined,
    );

    await expect(
      sut.execute({
        serviceId: 'service-1',
        professionalId: 'prof-1',
        preco: 49.99,
        duracao: 45.5,
      }),
    ).resolves.not.toThrow();

    expect(
      serviceProfessionalRepository.updateByServiceAndProfessional,
    ).toHaveBeenCalledWith({
      serviceId: 'service-1',
      professionalId: 'prof-1',
      preco: 49.99,
      duracao: 45.5,
    });
  });
});
