import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBookingUseCase } from './create-booking-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import {
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
import { mockBooking } from '@/dtos/booking-dto';
import { Status } from '@prisma/client';

const createMockRepositories = () => ({
  bookingsRepository: createMockBookingsRepository(),
  usersRepository: createMockUsersRepository(),
  professionalsRepository: createMockProfessionalsRepository(),
  serviceProfessionalRepository: createMockServiceProfessionalRepository(),
  userBonusRepository: createMockUserBonusRepository(),
  couponRepository: createMockCouponsRepository(),
});

const makeValidUser = (overrides: Parameters<typeof makeUser>[0] = {}) =>
  makeUser({
    id: 'user-1',
    name: 'Usuário Teste',
    email: 'user@example.com',
    password: 'hash',
    role: 'CLIENT',
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
    name: 'Serviço X',
    description: 'Descrição do Serviço X',
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
      mockRepos.couponRepository,
    );
  });

  it('deve criar um agendamento com sucesso', async () => {
    const now = new Date();
    const startDateTime = new Date(now.getTime() + 60 * 60 * 1000);
    const mockBookingId = 'mock-booking-id-123';

    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1', active: true }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        service: makeValidService({ id: 'srv-1' }),
      }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.bookingsRepository.createWithRedemptions.mockResolvedValue({
      id: mockBookingId,
      startDateTime,
      endDateTime: new Date(startDateTime.getTime() + 60 * 60000),
      notes: 'observações',
      userId: 'user-1',
      professionalId: 'pro-1',
      status: Status.PENDING,
      totalAmount: 100 as any,
      pointsUsed: 0,
      couponId: null,
      couponDiscount: 0 as any,
      canceledAt: null,
      confirmedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }],
      startDateTime,
      notes: 'observações',
    });

    expect(mockRepos.bookingsRepository.createWithRedemptions).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingData: expect.objectContaining({
          startDateTime,
          endDateTime: new Date(startDateTime.getTime() + 60 * 60000),
          notes: 'observações',
          user: { connect: { id: 'user-1' } },
          professional: { connect: { id: 'pro-1' } },
          status: Status.PENDING,
          totalAmount: 100,
          pointsUsed: 0,
        }),
        conflictCheck: {
          professionalId: 'pro-1',
          startDateTime,
          endDateTime: new Date(startDateTime.getTime() + 60 * 60000),
        },
        bonusRedemption: undefined,
        couponRedemption: undefined,
      }),
    );
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

  it('deve lançar erro se profissional não existir', async () => {
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

  it('deve lançar erro se serviço não estiver vinculado ao profissional', async () => {
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

  it('deve lançar erro se duração do serviço for inválida', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', duration: 0 }),
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
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', duration: 60 }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue({
      ...mockBooking,
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
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional
      .mockResolvedValueOnce(
        makeValidServiceProfessional({
          id: 'sp-1',
          professionalId: 'pro-1',
          price: 100,
          duration: 30,
          service: makeValidService({ id: 'srv-1', name: 'Serviço A' }),
        }),
      )
      .mockResolvedValueOnce(
        makeValidServiceProfessional({
          id: 'sp-2',
          professionalId: 'pro-1',
          price: 150,
          duration: 45,
          service: makeValidService({ id: 'srv-2', name: 'Serviço B' }),
        }),
      );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);
    mockRepos.bookingsRepository.createWithRedemptions.mockResolvedValue({
      id: 'booking-1',
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 75 * 60000),
      notes: null,
      userId: 'user-1',
      professionalId: 'pro-1',
      status: Status.PENDING,
      totalAmount: 250 as any,
      pointsUsed: 0,
      couponId: null,
      couponDiscount: 0 as any,
      canceledAt: null,
      confirmedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }, { serviceId: 'srv-2' }],
      startDateTime: futureDate,
    });

    const callArg = mockRepos.bookingsRepository.createWithRedemptions.mock.calls[0][0];
    expect(callArg.bookingData.endDateTime).toEqual(
      new Date(futureDate.getTime() + 75 * 60000),
    );
    expect(callArg.bookingData.totalAmount).toBe(250);
    const items = Array.isArray(callArg.bookingData.items?.create)
      ? callArg.bookingData.items?.create
      : [];
    expect(items).toHaveLength(2);
  });

  it('deve aplicar desconto de bônus corretamente', async () => {
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
    mockRepos.bookingsRepository.createWithRedemptions.mockResolvedValue({
      id: 'booking-1',
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 60 * 60000),
      notes: null,
      userId: 'user-1',
      professionalId: 'pro-1',
      status: Status.PENDING,
      totalAmount: 0 as any,
      pointsUsed: 200,
      couponId: null,
      couponDiscount: 0 as any,
      canceledAt: null,
      confirmedAt: null,
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

    expect(mockRepos.bookingsRepository.createWithRedemptions).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingData: expect.objectContaining({
          totalAmount: 0,
          pointsUsed: 200,
        }),
        bonusRedemption: expect.objectContaining({
          userId: 'user-1',
          pointsUsed: 200,
          discount: 100,
          breakdown: [{ type: 'BOOKING_POINTS', toConsume: 200 }],
        }),
      }),
    );
  });

  it('deve lançar erro se não houver pontos suficientes para resgate', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', price: 100, duration: 60 }),
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

  it('deve usar apenas pontos necessários quando desconto excede valor total', async () => {
    const futureDate = new Date(Date.now() + 3600000);

    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1', active: true }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({
        id: 'sp-1',
        professionalId: 'pro-1',
        price: 50,
        duration: 60,
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
    mockRepos.bookingsRepository.createWithRedemptions.mockResolvedValue({
      id: 'booking-excess',
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 60 * 60000),
      notes: null,
      userId: 'user-1',
      professionalId: 'pro-1',
      status: Status.PENDING,
      totalAmount: 0 as any,
      pointsUsed: 100,
      couponId: null,
      couponDiscount: 0 as any,
      canceledAt: null,
      confirmedAt: null,
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

    // Serviço R$50. MAX_BOOKING_VALUE_AFTER_DISCOUNT = 0.
    // maxDiscount = 50, maxPoints = floor(50 / 0.5) = 100
    // pointsToUse = min(200, 100) = 100
    expect(mockRepos.bookingsRepository.createWithRedemptions).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingData: expect.objectContaining({
          totalAmount: 0,
          pointsUsed: 100,
        }),
        bonusRedemption: expect.objectContaining({
          pointsUsed: 100,
          discount: 50,
        }),
      }),
    );
  });

  it('não deve tentar usar pontos se valor total for zero', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', price: 0, duration: 60 }),
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
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', price: 100, duration: 60 }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    mockRepos.couponRepository.findByCode.mockResolvedValue({
      id: 'coupon-1',
      code: 'DESC20',
      type: 'PERCENTAGE',
      value: 20 as any,
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
      expirationType: 'BOTH',
      serviceId: null,
      professionalId: null,
      userId: null,
    } as any);

    mockRepos.bookingsRepository.createWithRedemptions.mockResolvedValue({
      id: 'booking-1',
      startDateTime: futureDate,
      endDateTime: new Date(futureDate.getTime() + 60 * 60000),
      notes: null,
      userId: 'user-1',
      professionalId: 'pro-1',
      status: Status.PENDING,
      totalAmount: 80 as any,
      pointsUsed: 0,
      couponId: 'coupon-1',
      couponDiscount: 20 as any,
      canceledAt: null,
      confirmedAt: null,
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
    expect(mockRepos.bookingsRepository.createWithRedemptions).toHaveBeenCalledWith(
      expect.objectContaining({
        couponRedemption: expect.objectContaining({
          couponId: 'coupon-1',
          userId: 'user-1',
          discount: 20,
        }),
      }),
    );
  });

  it('deve lançar erro ao usar cupom e pontos simultaneamente', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', price: 100, duration: 60 }),
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

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

  it('deve lançar erro para cupom inválido', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(makeValidUser({ id: 'user-1' }));
    mockRepos.professionalsRepository.findById.mockResolvedValue(
      makeValidProfessional({ id: 'pro-1' }),
    );
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      makeValidServiceProfessional({ id: 'sp-1', professionalId: 'pro-1', price: 100, duration: 60 }),
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
