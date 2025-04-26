import { ListProfessionalServicesUseCase } from './list-professional-services-use-case';
import { InMemoryServiceProfessionalRepository } from '@/repositories/in-memory/in-memory-service-professional-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { describe, expect, beforeEach, it } from 'vitest';

describe('ListProfessionalServicesUseCase', () => {
  let serviceProfessionalRepository: InMemoryServiceProfessionalRepository;
  let professionalsRepository: InMemoryProfessionalsRepository;
  let sut: ListProfessionalServicesUseCase;

  beforeEach(() => {
    serviceProfessionalRepository = new InMemoryServiceProfessionalRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new ListProfessionalServicesUseCase(
      serviceProfessionalRepository,
      professionalsRepository,
    );
  });

  it('should be able to list services for a professional', async () => {
    // Criar um profissional
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    // Adicionar serviços ao profissional usando o método público create
    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: professional.id } },
      preco: 50,
      duracao: 30,
    });

    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-2' } },
      professional: { connect: { id: professional.id } },
      preco: 80,
      duracao: 60,
    });

    // Executar o caso de uso
    const result = await sut.execute({
      professionalId: professional.id,
      page: 1,
      limit: 10,
    });

    // Verificar o resultado
    expect(result.services).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.services[0]).toEqual({
      id: 'service-1',
      nome: 'Fake Service Name',
      descricao: 'Fake description',
      preco: 100, // precoPadrao do serviço fake
      duracao: 60, // duracao padrão do serviço fake
      categoria: 'Fake Category',
      ativo: true,
      precoPersonalizado: 50, // preço personalizado
      duracaoPersonalizada: 30, // duração personalizada
    });
  });

  it('should return empty list if professional has no services', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    const result = await sut.execute({
      professionalId: professional.id,
      page: 1,
      limit: 10,
    });

    expect(result.services).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should not list services from another professional', async () => {
    // Criar dois profissionais
    const professional1 = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Cabeleireiro',
    });
    const professional2 = await professionalsRepository.create({
      user: { connect: { id: 'user-2' } },
      especialidade: 'Massagista',
    });

    // Adicionar serviços apenas ao profissional 1
    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-1' } },
      professional: { connect: { id: professional1.id } },
      preco: 50,
      duracao: 30,
    });

    // Listar serviços do profissional 2
    const result = await sut.execute({
      professionalId: professional2.id,
      page: 1,
      limit: 10,
    });

    expect(result.services).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should throw error if professional does not exist', async () => {
    await expect(
      sut.execute({
        professionalId: 'non-existing-professional',
        page: 1,
        limit: 10,
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should respect pagination', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    // Adicionar vários serviços
    for (let i = 1; i <= 15; i++) {
      await serviceProfessionalRepository.create({
        service: { connect: { id: `service-${i}` } },
        professional: { connect: { id: professional.id } },
        preco: 50 + i,
        duracao: 30 + i,
      });
    }

    // Página 1 com limite 5
    const page1 = await sut.execute({
      professionalId: professional.id,
      page: 1,
      limit: 5,
    });

    expect(page1.services).toHaveLength(5);
    expect(page1.total).toBe(15);

    // Página 2 com limite 5
    const page2 = await sut.execute({
      professionalId: professional.id,
      page: 2,
      limit: 5,
    });

    expect(page2.services).toHaveLength(5);
    expect(page2.total).toBe(15);

    // Página 3 com limite 5 (deve ter apenas 5 itens restantes)
    const page3 = await sut.execute({
      professionalId: professional.id,
      page: 3,
      limit: 5,
    });

    expect(page3.services).toHaveLength(5);
    expect(page3.total).toBe(15);
  });

  it('should filter inactive services when activeOnly is true', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-id' } },
      especialidade: 'Cabeleireiro',
    });

    // Adicionar serviços (o repositório em memória considera todos ativos por padrão)
    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-active-1' } },
      professional: { connect: { id: professional.id } },
      preco: 50,
      duracao: 30,
    });

    await serviceProfessionalRepository.create({
      service: { connect: { id: 'service-inactive-1' } },
      serviceAtivo: false,
      professional: { connect: { id: professional.id } },
      preco: 80,
      duracao: 60,
    });

    // Mock do findByProfessional para simular um serviço inativo
    const originalFindByProfessional =
      serviceProfessionalRepository.findByProfessional.bind(
        serviceProfessionalRepository,
      );

    serviceProfessionalRepository.findByProfessional = async (
      professionalId,
      options,
    ) => {
      const result = await originalFindByProfessional(professionalId, options);
      return result;
    };

    // Listar apenas ativos (default)
    const activeOnlyResult = await sut.execute({
      professionalId: professional.id,
      page: 1,
      limit: 10,
    });

    expect(activeOnlyResult.services).toHaveLength(1);
    expect(activeOnlyResult.services[0].id).toBe('service-active-1');

    // Listar todos (incluindo inativos)
    const allResults = await sut.execute({
      professionalId: professional.id,
      page: 1,
      limit: 10,
      activeOnly: false,
    });

    expect(allResults.services).toHaveLength(2);
  });
});
