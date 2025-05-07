import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBookingUseCase } from './create-booking-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import {
  createMockBonusRedemptionRepository,
  createMockBookingsRepository,
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
  createMockUserBonusRepository,
  createMockUsersRepository,
} from '@/mock/mock-repositories';
import { InsufficientBonusPointsError } from '../errors/insufficient-bonus-points-error';
import { InvalidBonusRedemptionError } from '../errors/invalid-bonus-redemption-error';

// Função para criar todos os mocks
const createMockRepositories = () => ({
  bookingsRepository: createMockBookingsRepository(),
  usersRepository: createMockUsersRepository(),
  professionalsRepository: createMockProfessionalsRepository(),
  serviceProfessionalRepository: createMockServiceProfessionalRepository(),
  userBonusRepository: createMockUserBonusRepository(),
  bonusRedemptionRepository: createMockBonusRedemptionRepository(),
});

describe('CreateBookingUseCase', () => {
  let useCase: CreateBookingUseCase;
  let mockRepos: ReturnType<typeof createMockRepositories>;

  beforeEach(() => {
    mockRepos = createMockRepositories();
    useCase = new CreateBookingUseCase(
      mockRepos.bookingsRepository,
      mockRepos.usersRepository,
      mockRepos.professionalsRepository,
      mockRepos.serviceProfessionalRepository,
      mockRepos.userBonusRepository,
      mockRepos.bonusRedemptionRepository,
    );
  });

  it('deve criar um agendamento com sucesso', async () => {
    const now = new Date();
    const startDateTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hora
    const mockBookingId = 'mock-booking-id-123';
    const mockUserId = 'user-1';
    const mockProfessionalId = 'pro-1';
    const mockServiceId = 'srv-1';
    const mockServiceProfessionalId = 'sp-1';

    mockRepos.usersRepository.findById.mockResolvedValue({
      id: mockUserId,
      nome: 'Usuário Teste',
      email: 'user@example.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'USER',
    });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: mockProfessionalId,
      nome: 'Profissional Teste',
      email: 'pro@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      fotoPerfil: null,
      telefone: null,
      descricao: null,
      enderecoId: null,
      ativo: true,
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: mockServiceProfessionalId,
        professionalId: mockProfessionalId,
        preco: 100,
        duracao: 60,
        service: {
          id: mockServiceId,
          nome: 'Serviço X',
          descricao: 'Descrição do Serviço X',
          categoria: 'CATEGORIA_TESTE',
          ativo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    // CORREÇÃO: Mockar o retorno de bookingsRepository.create
    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: mockBookingId,
      dataHoraInicio: startDateTime,
      dataHoraFim: new Date(startDateTime.getTime() + 60 * 60000),
      observacoes: 'observações',
      userId: mockUserId,
      profissionalId: mockProfessionalId,
      status: 'PENDENTE', // Usar o enum BookingStatus importado ou string literal se o tipo permitir
      valorTotal: 100,
      valorFinal: 100,
      desconto: 0,
      pontosUtilizados: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Adicione outras propriedades obrigatórias do tipo Booking se houver
    });

    const result = await useCase.execute({
      userId: mockUserId,
      professionalId: mockProfessionalId,
      services: [{ serviceId: mockServiceId }],
      startDateTime,
      notes: 'observações',
    });

    expect(mockRepos.bookingsRepository.create).toHaveBeenCalledWith({
      dataHoraInicio: startDateTime,
      dataHoraFim: new Date(startDateTime.getTime() + 60 * 60000),
      observacoes: 'observações',
      user: { connect: { id: mockUserId } },
      profissional: { connect: { id: mockProfessionalId } },
      status: 'PENDENTE',
      valorFinal: 100,
      pontosUtilizados: 0,
      items: {
        create: [
          {
            serviceProfessionalId: mockServiceProfessionalId,
            preco: 100,
            nome: 'Serviço X',
            duracao: 60,
            serviceId: mockServiceId,
          },
        ],
      },
    });
    expect(result).toHaveProperty('id');
    expect(result.id).toBe(mockBookingId);
  });

  it('deve lançar erro se data for no passado', async () => {
    const pastDate = new Date(Date.now() - 1000);

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: pastDate,
      }),
    ).rejects.toThrow(InvalidDateTimeError);
  });

  it('deve lançar erro se usuário não existir', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(null);
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lançar erro se profissional não existir', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue(null);

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro se serviço não estiver vinculado ao profissional', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      null,
    );

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(ServiceProfessionalNotFoundError);
  });

  it('deve lançar erro se duração do serviço for inválida', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 0, // duração inválida
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(InvalidDurationError);
  });

  it('deve lançar erro se houver agendamento no mesmo horário', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue({
      id: 'existing',
    });

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(TimeSlotAlreadyBookedError);
  });

  it('deve calcular corretamente para múltiplos serviços', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional
      .mockResolvedValueOnce({
        // Primeiro serviço
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 30,
        service: {
          id: 'srv-1',
          nome: 'Serviço A',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      })
      .mockResolvedValueOnce({
        // Segundo serviço
        id: 'sp-2',
        professionalId: 'pro-1',
        preco: 150,
        duracao: 45,
        service: {
          id: 'srv-2',
          nome: 'Serviço B',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      });
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }, { serviceId: 'srv-2' }],
      startDateTime: futureDate,
    });

    const createCall = mockRepos.bookingsRepository.create.mock.calls[0][0];
    expect(createCall.dataHoraFim).toEqual(
      new Date(futureDate.getTime() + 75 * 60000),
    ); // 30 + 45 minutos
    expect(createCall.valorFinal).toBe(250); // 100 + 150
    expect(createCall.items.create).toHaveLength(2);
  });

  it('deve aplicar desconto de bônus corretamente', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.userBonusRepository.getValidPointsWithExpiration.mockResolvedValue(
      {
        points: 200, // 200 pontos = R$ 100 de desconto
        expiresAt: new Date(Date.now() + 86400000),
      },
    );

    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: 'booking-1',
      dataHoraInicio: futureDate,
      dataHoraFim: new Date(futureDate.getTime() + 60 * 60000),
      observacoes: undefined,
      userId: 'user-1',
      profissionalId: 'pro-1',
      status: 'PENDENTE',
      valorFinal: 0.01,
      pontosUtilizados: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }],
      startDateTime: futureDate,
      useBonusPoints: true,
    });

    // Use objectContaining for more flexible assertions
    expect(mockRepos.bookingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        dataHoraInicio: futureDate,
        dataHoraFim: new Date(futureDate.getTime() + 60 * 60000),
        user: { connect: { id: 'user-1' } },
        profissional: { connect: { id: 'pro-1' } },
        status: 'PENDENTE',
        valorFinal: 0.01,
        pontosUtilizados: 200,
        items: {
          create: [
            expect.objectContaining({
              serviceProfessionalId: 'sp-1',
              preco: 100,
              nome: 'Serviço X',
              duracao: 60,
              serviceId: 'srv-1',
            }),
          ],
        },
      }),
    );

    expect(mockRepos.bonusRedemptionRepository.create).toHaveBeenCalledWith({
      user: { connect: { id: 'user-1' } },
      booking: { connect: { id: 'booking-1' } },
      pointsUsed: 200,
      discount: 99.99,
    });
  });

  it('deve lançar erro se não houver pontos suficientes para resgate', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.userBonusRepository.getValidPointsWithExpiration.mockResolvedValue(
      {
        points: 5, // Menos que o mínimo de 10 pontos
        expiresAt: new Date(Date.now() + 86400000),
      },
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
        useBonusPoints: true,
      }),
    ).rejects.toThrow(InsufficientBonusPointsError);
  });

  it('deve usar apenas pontos necessários quando desconto excede valor total', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    const mockBookingId = 'booking-excess-bonus-456'; // Novo ID para este teste

    mockRepos.usersRepository.findById.mockResolvedValue({
      id: 'user-1',
      nome: 'Usuário Teste',
      email: 'user@example.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'USER',
    });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
      nome: 'Profissional Teste',
      email: 'pro@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      fotoPerfil: null,
      telefone: null,
      descricao: null,
      enderecoId: null,
      ativo: true,
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 50, // Valor menor do serviço
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: 'desc',
          categoria: 'CAT',
          ativo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.userBonusRepository.getValidPointsWithExpiration.mockResolvedValue(
      {
        points: 200, // 200 pontos = R$ 100 de desconto (mas só precisa de 100 pontos para cobrir R$ 49.99 de desconto)
        expiresAt: new Date(Date.now() + 86400000),
      },
    );

    // CORREÇÃO: Adicionar mock para bookingsRepository.create neste teste
    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: mockBookingId, // Essencial para que booking.id não seja undefined
      dataHoraInicio: futureDate,
      dataHoraFim: new Date(futureDate.getTime() + 60 * 60000),
      observacoes: undefined,
      userId: 'user-1',
      profissionalId: 'pro-1',
      status: 'PENDENTE',
      valorTotal: 50,
      valorFinal: 0.01, // Valor mínimo após desconto
      desconto: 49.99, // 50 - 0.01
      pontosUtilizados: 100, // Pontos para cobrir R$49.99 (49.99 / 0.5 = 99.98, Math.ceil -> 100)
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }],
      startDateTime: futureDate,
      useBonusPoints: true,
    });

    // Verifica que só foram usados 100 pontos (R$50 de serviço - R$0.01 valor mínimo = R$49.99 de desconto. R$49.99 / R$0.50 por ponto = 99.98 pontos, arredondado para cima para 100 pontos)
    expect(mockRepos.bookingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        valorFinal: 0.01,
        pontosUtilizados: 100, // A lógica do use case deve calcular isso
      }),
    );

    // Verifica se o resgate foi registrado corretamente
    expect(mockRepos.bonusRedemptionRepository.create).toHaveBeenCalledWith({
      user: { connect: { id: 'user-1' } },
      booking: { connect: { id: result.id } }, // result.id não deve ser undefined agora
      pointsUsed: 100,
      discount: 49.99, // O desconto efetivamente aplicado
    });
  });

  it('não deve tentar usar pontos se valor total for zero', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 0, // Serviço gratuito
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
        useBonusPoints: true,
      }),
    ).rejects.toThrow(InvalidBonusRedemptionError);
  });
});
