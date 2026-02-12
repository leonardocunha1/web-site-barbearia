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
  createMockCouponsRepository,
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
  createMockUserBonusRepository,
  createMockUsersRepository,
} from '@/mock/mock-repositories';
import { InsufficientBonusPointsError } from '../errors/insufficient-bonus-points-error';
import { InvalidBonusRedemptionError } from '../errors/invalid-bonus-redemption-error';
import { CouponBonusConflictError } from '../errors/coupon-bonus-conflict-error';
import { InvalidCouponError } from './invalid-coupon-error';
import { makeProfessional, makeService, makeServiceProfessional, makeUser } from '@/test/factories';

// FunÃ§Ã£o para criar todos os mocks
const createMockRepositories = () => ({
  bookingsRepository: createMockBookingsRepository(),
  usersRepository: createMockUsersRepository(),
  professionalsRepository: createMockProfessionalsRepository(),
  serviceProfessionalRepository: createMockServiceProfessionalRepository(),
  userBonusRepository: createMockUserBonusRepository(),
  bonusRedemptionRepository: createMockBonusRedemptionRepository(),
  couponRepository: createMockCouponsRepository(),
});

const makeValidUser = (overrides: Parameters<typeof makeUser>[0] = {}) =>
  makeUser({
    id: 'user-1',
    name: 'UsuÃ¡rio Teste',
    email: 'user@example.com',
    password: 'hash',
    role: 'USER' as any,
    ...overrides,
  });

const makeValidProfessional = (overrides: Parameters<typeof makeProfessional>[0] = {}) =>
  makeProfessional({
    id: 'pro-1',
    userId: 'user-1',
    specialty: 'Especialidade',
    active: true,
    ...overrides,
  });

const makeValidService = (overrides: Parameters<typeof makeService>[0] = {}) =>
  makeService({
    id: 'srv-1',
    name: 'ServiÃ§o X',
    description: 'DescriÃ§Ã£o do ServiÃ§o X',
    category: 'CATEGORIA_TESTE',
    active: true,
    ...overrides,
  });

const makeValidServiceProfessional = (
  overrides: Parameters<typeof makeServiceProfessional>[0] = {},
) =>
  makeServiceProfessional({
    id: 'sp-1',
    professionalId: 'pro-1',
    service: makeValidService(),
    price: 100,
    duration: 60,
    ...overrides,
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
      mockRepos.couponRepository,
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

    mockRepos.usersRepository.findById.mockResolvedValue(
      makeValidUser({ id: mockUserId, role: 'USER' as any }),
    );
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: mockProfessionalId, active: true }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: mockServiceProfessionalId,
        professionalId: mockProfessionalId,
        service: makeValidService({ id: mockServiceId }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: mockBookingId,
      startDateTime,
      endDateTime: new Date(startDateTime.getTime() + 60 * 60000),
      notes: 'observaÃ§Ãµes',
      userId: mockUserId,
      professionalId: mockProfessionalId,
      status: 'PENDING',
      valorTotal: 100,
      totalAmount: 100,
      desconto: 0,
      pointsUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      userId: mockUserId,
      professionalId: mockProfessionalId,
      services: [{ serviceId: mockServiceId }],
      startDateTime,
      notes: 'observaÃ§Ãµes',
    });

    expect(mockRepos.bookingsRepository.create).toHaveBeenCalledWith({
      startDateTime,
      coupon: undefined,
      couponDiscount: 0,
      endDateTime: new Date(startDateTime.getTime() + 60 * 60000),
      notes: 'observaÃ§Ãµes',
      user: { connect: { id: mockUserId } },
      professional: { connect: { id: mockProfessionalId } },
      status: 'PENDING',
      totalAmount: 100,
      pointsUsed: 0,
      items: {
        create: [
          {
            serviceProfessionalId: mockServiceProfessionalId,
            price: 100,
            name: 'ServiÃ§o X',
            duration: 60,
            serviceId: mockServiceId,
          },
        ],
      },
    });
    expect(result).toHaveProperty('id');
    expect(result.id).toBe(mockBookingId);
  });

  it('deve lanÃ§ar erro se data for no passado', async () => {
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

  it('deve lanÃ§ar erro se usuÃ¡rio nÃ£o existir', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(null);
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lanÃ§ar erro se profissional nÃ£o existir', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
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

  it('deve lanÃ§ar erro se serviÃ§o nÃ£o estiver vinculado ao profissional', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(null);

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(ServiceProfessionalNotFoundError);
  });

  it('deve lanÃ§ar erro se duraÃ§Ã£o do serviÃ§o for invÃ¡lida', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        duration: 0, // duraÃ§Ã£o invÃ¡lida
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
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

  it('deve lanÃ§ar erro se houver agendamento no mesmo horÃ¡rio', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
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

  it('deve calcular corretamente para mÃºltiplos serviÃ§os', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional
      .mockResolvedValueOnce({
        // Primeiro serviÃ§o
        ...makeValidServiceProfessional({
          id: 'sp-1',
          professionalId: 'pro-1',
          price: 100,
          duration: 30,
          service: makeValidService({
            id: 'srv-1',
            name: 'ServiÃ§o A',
            description: null,
            category: null,
            active: true,
          }),
        }),
      })
      .mockResolvedValueOnce({
        // Segundo serviÃ§o
        ...makeValidServiceProfessional({
          id: 'sp-2',
          professionalId: 'pro-1',
          price: 150,
          duration: 45,
          service: makeValidService({
            id: 'srv-2',
            name: 'ServiÃ§o B',
            description: null,
            category: null,
            active: true,
          }),
        }),
      });
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }, { serviceId: 'srv-2' }],
      startDateTime: futureDate,
    });

    const createCall = mockRepos.bookingsRepository.create.mock.calls[0][0];
    expect(createCall.endDateTime).toEqual(new Date(futureDate.getTime() + 75 * 60000)); // 30 + 45 minutos
    expect(createCall.totalAmount).toBe(250); // 100 + 150
    expect(createCall.items.create).toHaveLength(2);
  });

  it('deve aplicar desconto de bÃ´nus corretamente', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 100,
        duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.userBonusRepository.getValidPointsWithExpiration.mockImplementation(
      async (_userId, type) => {
        if (type === 'BOOKING_POINTS') {
          return { points: 200, expiresAt: new Date(Date.now() + 86400000) };
        }
        return { points: 0 };
      },
    );

    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: 'booking-1',
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 60 * 60000),
      notes: undefined,
      userId: 'user-1',
      professionalId: 'pro-1',
      status: 'PENDING',
      totalAmount: 0,
      pointsUsed: 200,
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
        startDateTime: futureDate,
        endDateTime: new Date(futureDate.getTime() + 60 * 60000),
        user: { connect: { id: 'user-1' } },
        professional: { connect: { id: 'pro-1' } },
        status: 'PENDING',
        totalAmount: 0,
        pointsUsed: 200,
        items: {
          create: [
            expect.objectContaining({
              serviceProfessionalId: 'sp-1',
              price: 100,
              name: 'ServiÃ§o X',
              duration: 60,
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
      discount: 100,
    });
  });

  it('deve lanÃ§ar erro se nÃ£o houver pontos suficientes para resgate', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 100,
        duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.userBonusRepository.getValidPointsWithExpiration.mockImplementation(
      async (_userId, type) => {
        if (type === 'BOOKING_POINTS') {
          return { points: 5, expiresAt: new Date(Date.now() + 86400000) };
        }
        return { points: 0 };
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

  it('deve usar apenas pontos necessÃ¡rios quando desconto excede valor total', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    const mockBookingId = 'booking-excess-bonus-456'; // Novo ID para este teste

    mockRepos.usersRepository.findById.mockResolvedValue(
      makeValidUser({ id: 'user-1', role: 'USER' as any }),
    );
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1', active: true }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 50, // Valor menor do serviÃ§o duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: 'desc',
          category: 'CAT',
          active: true,
        }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.userBonusRepository.getValidPointsWithExpiration.mockImplementation(
      async (_userId, type) => {
        if (type === 'BOOKING_POINTS') {
          return { points: 200, expiresAt: new Date(Date.now() + 86400000) };
        }
        return { points: 0 };
      },
    );

    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: mockBookingId, // Essencial para que booking.id nÃ£o seja undefined
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 60 * 60000),
      notes: undefined,
      userId: 'user-1',
      professionalId: 'pro-1',
      status: 'PENDING',
      valorTotal: 50,
      totalAmount: 0, // Valor mÃ­nimo apÃ³s desconto
      desconto: 50,
      pointsUsed: 100, // Pontos para cobrir R$49.99 (49.99 / 0.5 = 99.98, Math.ceil -> 100)
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

    // Verifica que sÃ³ foram usados 100 pontos (R$50 de serviÃ§o - R$0.01 valor mÃ­nimo = R$49.99 de desconto. R$49.99 / R$0.50 por ponto = 99.98 pontos, arredondado para cima para 100 pontos)
    expect(mockRepos.bookingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        totalAmount: 0,
        pointsUsed: 100, // A lÃ³gica do use case deve calcular isso
      }),
    );

    // Verifica se o resgate foi registrado corretamente
    expect(mockRepos.bonusRedemptionRepository.create).toHaveBeenCalledWith({
      user: { connect: { id: 'user-1' } },
      booking: { connect: { id: result.id } }, // result.id nÃ£o deve ser undefined agora
      pointsUsed: 100,
      discount: 50, // O desconto efetivamente aplicado
    });
  });

  it('nÃ£o deve tentar usar pontos se valor total for zero', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 0, // ServiÃ§o gratuito duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
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

  it('deve aplicar desconto de cupom corretamente', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 100,
        duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    // Mock do cupom (20% de desconto)
    mockRepos.couponRepository.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'DESC20',
      type: 'PERCENTAGE',
      value: 20,
      scope: 'GLOBAL',
      active: true,
      uses: 0,
      maxUses: 100,
      startDate: new Date(),
      endDate: null,
      minBookingValue: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      redemptions: [],
    });

    mockRepos.bookingsRepository.create.mockResolvedValue({
      id: 'booking-1',
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 60 * 60000),
      userId: 'user-1',
      professionalId: 'pro-1',
      status: 'PENDING',
      totalAmount: 80, // 100 - 20%
      pointsUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }],
      startDateTime: futureDate,
      couponCode: 'DESC20',
    });

    expect(result.totalAmount).toBe(80);
    expect(mockRepos.couponRepository.registerRedemption).toHaveBeenCalled();
  });

  it('deve lanÃ§ar erro ao usar cupom e pontos simultaneamente', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 100,
        duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    mockRepos.couponRepository.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'DESC20',
      type: 'PERCENTAGE',
      value: 20,
      scope: 'GLOBAL',
      active: true,
      uses: 0,
      maxUses: 100,
      startDate: new Date(),
      endDate: null,
      minBookingValue: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      redemptions: [],
    });

    await expect(
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
        couponCode: 'DESC20',
        useBonusPoints: true,
      }),
    ).rejects.toThrow(CouponBonusConflictError);
  });

  it('deve lanÃ§ar erro para cupom invÃ¡lido', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 100,
        duration: 60,
        service: makeValidService({
          id: 'srv-1',
          name: 'ServiÃ§o X',
          description: null,
          category: null,
          active: true,
        }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    mockRepos.couponRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
        couponCode: 'CUPOMINVALIDO',
      }),
    ).rejects.toThrow(InvalidCouponError);
  });
});
