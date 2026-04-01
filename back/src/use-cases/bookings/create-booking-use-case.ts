import { IBookingsRepository } from '@/repositories/bookings-repository';
import { IUsersRepository } from '@/repositories/users-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { IUserBonusRepository } from '@/repositories/user-bonus-repository';
import { Booking, ServiceType, Status } from '@prisma/client';

import {
  COUPON_MESSAGES,
  MIN_BOOKING_VALUE_AFTER_DISCOUNT,
  MIN_POINTS_TO_REDEEM,
  VALUE_PER_POINT,
} from '@/consts/const';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { InvalidBonusRedemptionError } from '../errors/invalid-bonus-redemption-error';
import { InsufficientBonusPointsError } from '../errors/insufficient-bonus-points-error';
import { CouponBonusConflictError } from '../errors/coupon-bonus-conflict-error';
import { InvalidCouponError } from './invalid-coupon-error';
import { CouponNotApplicableError } from '../errors/coupon-not-applicable-error';
import { ICouponRepository } from '@/repositories/coupon-repository';
import { MultipleServicesPerTypeError } from '../errors/multiple-services-per-type-error';

export interface BookingRequest {
  userId: string;
  professionalId: string;
  services: Array<{ serviceId: string }>;
  startDateTime: Date;
  notes?: string;
  useBonusPoints?: boolean;
  couponCode?: string;
}

export class CreateBookingUseCase {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private usersRepository: IUsersRepository,
    private professionalsRepository: IProfessionalsRepository,
    private serviceProfessionalRepository: IServiceProfessionalRepository,
    private userBonusRepository: IUserBonusRepository,
    private couponRepository: ICouponRepository,
  ) {}

  async execute(request: BookingRequest): Promise<Booking> {
    // --- Fase 1: Validações (leitura) ---
    this.validateDate(request.startDateTime);

    await this.loadEntities(request.userId, request.professionalId);

    const services = await this.loadAndValidateServices(request.services, request.professionalId);
    this.ensureServiceTypeRules(services);

    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const endDateTime = new Date(request.startDateTime.getTime() + totalDuration * 60000);

    await this.ensureNoConflict(request.professionalId, request.startDateTime, endDateTime);

    const totalValue = services.reduce((sum, s) => sum + Number(s.price), 0);

    if (request.couponCode && request.useBonusPoints) {
      throw new CouponBonusConflictError();
    }

    let couponDiscount = 0;
    let couponId: string | undefined;

    if (request.couponCode) {
      const couponValidation = await this.validateAndApplyCoupon(
        request.couponCode,
        request.userId,
        request.professionalId,
        request.services,
        totalValue,
      );

      couponDiscount = couponValidation.discount;
      couponId = couponValidation.couponId;
    }

    const valueAfterCoupon = totalValue - couponDiscount;

    const bonusResult =
      !request.couponCode && request.useBonusPoints
        ? await this.calculateBonusDiscount(request.userId, valueAfterCoupon)
        : {
            finalValue: valueAfterCoupon,
            pointsUsed: 0,
            discount: 0,
            bonusBreakdown: [] as Array<{ type: 'BOOKING_POINTS' | 'LOYALTY'; toConsume: number }>,
          };

    // --- Fase 2: Escrita atômica via repository ---
    try {
      return await this.bookingsRepository.createWithRedemptions({
        bookingData: {
          startDateTime: request.startDateTime,
          endDateTime,
          notes: request.notes,
          user: { connect: { id: request.userId } },
          professional: { connect: { id: request.professionalId } },
          status: Status.PENDING,
          totalAmount: parseFloat(bonusResult.finalValue.toFixed(2)),
          pointsUsed: bonusResult.pointsUsed,
          coupon: couponId ? { connect: { id: couponId } } : undefined,
          couponDiscount,
          items: {
            create: services.map((s) => ({
              serviceProfessionalId: s.id,
              price: s.price,
              name: s.service.name,
              duration: s.duration,
              serviceId: s.service.id,
            })),
          },
        },
        conflictCheck: {
          professionalId: request.professionalId,
          startDateTime: request.startDateTime,
          endDateTime,
        },
        bonusRedemption:
          bonusResult.pointsUsed > 0 && bonusResult.discount > 0
            ? {
                userId: request.userId,
                pointsUsed: bonusResult.pointsUsed,
                discount: parseFloat(bonusResult.discount.toFixed(2)),
                breakdown: bonusResult.bonusBreakdown,
              }
            : undefined,
        couponRedemption:
          couponId && couponDiscount > 0
            ? {
                couponId,
                userId: request.userId,
                discount: couponDiscount,
              }
            : undefined,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'TIME_SLOT_ALREADY_BOOKED') throw new TimeSlotAlreadyBookedError();
        if (error.message === 'INSUFFICIENT_BONUS_POINTS') throw new InsufficientBonusPointsError();
      }
      throw error;
    }
  }

  private async validateAndApplyCoupon(
    code: string,
    userId: string,
    professionalId: string,
    services: Array<{ serviceId: string }>,
    totalValue: number,
  ) {
    const normalizedCode = code.toUpperCase();
    const coupon = await this.couponRepository.findByCode(normalizedCode);

    if (!coupon || !coupon.active) {
      throw new InvalidCouponError();
    }

    const now = new Date();

    if (coupon.startDate && coupon.startDate > now) {
      throw new InvalidCouponError(COUPON_MESSAGES.NOT_YET_VALID);
    }

    const isDateExpired = !!coupon.endDate && coupon.endDate < now;
    const isQuantityExceeded =
      coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.uses >= coupon.maxUses;

    switch (coupon.expirationType) {
      case 'DATE':
        if (isDateExpired) {
          throw new InvalidCouponError(COUPON_MESSAGES.EXPIRED);
        }
        break;
      case 'QUANTITY':
        if (isQuantityExceeded) {
          throw new InvalidCouponError(COUPON_MESSAGES.MAX_USES_REACHED);
        }
        break;
      case 'BOTH':
        if (isDateExpired) {
          throw new InvalidCouponError(COUPON_MESSAGES.EXPIRED);
        }
        if (isQuantityExceeded) {
          throw new InvalidCouponError(COUPON_MESSAGES.MAX_USES_REACHED);
        }
        break;
    }

    const userAlreadyUsed = coupon.redemptions.some((r) => r.userId === userId);
    if (userAlreadyUsed) {
      throw new InvalidCouponError(COUPON_MESSAGES.ALREADY_USED);
    }

    switch (coupon.scope) {
      case 'PROFESSIONAL':
        if (coupon.professionalId !== professionalId) {
          throw new CouponNotApplicableError();
        }
        break;
      case 'SERVICE': {
        const serviceIds = services.map((s) => s.serviceId);
        if (!coupon.serviceId || !serviceIds.includes(coupon.serviceId)) {
          throw new CouponNotApplicableError();
        }
        break;
      }
    }

    const minBookingValue = coupon.minBookingValue ? Number(coupon.minBookingValue) : null;
    if (minBookingValue && totalValue < minBookingValue) {
      throw new CouponNotApplicableError(
        `Valor mínimo para este cupom: R$ ${minBookingValue.toFixed(2)}`,
      );
    }

    const couponValue = Number(coupon.value);
    let discount = 0;
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = totalValue * (couponValue / 100);
        break;
      case 'FIXED':
        discount = Math.min(couponValue, totalValue);
        break;
      case 'FREE':
        discount = totalValue;
        break;
    }

    return {
      couponId: coupon.id,
      discount,
    };
  }

  private validateDate(start: Date) {
    if (start < new Date()) throw new InvalidDateTimeError();
  }

  private async loadEntities(userId: string, professionalId: string) {
    const [user, professional] = await Promise.all([
      this.usersRepository.findById(userId),
      this.professionalsRepository.findById(professionalId),
    ]);
    if (!user) throw new UserNotFoundError();
    if (!professional) throw new ProfessionalNotFoundError();
    return [user, professional];
  }

  private async loadAndValidateServices(
    services: BookingRequest['services'],
    professionalId: string,
  ) {
    const result = await Promise.all(
      services.map(async ({ serviceId }) => {
        const sp = await this.serviceProfessionalRepository.findByServiceAndProfessional(
          serviceId,
          professionalId,
        );
        if (!sp) throw new ServiceProfessionalNotFoundError();
        if (sp.duration <= 0) throw new InvalidDurationError();
        return sp;
      }),
    );
    if (result.length === 0) throw new InvalidDurationError();
    return result;
  }

  private ensureServiceTypeRules(services: Array<{ service: { type: ServiceType } }>) {
    const seen = new Set<ServiceType>();

    for (const service of services) {
      const type = service.service.type ?? 'ESTETICA';
      if (type === 'ESTETICA') continue;
      if (seen.has(type)) {
        throw new MultipleServicesPerTypeError(type);
      }
      seen.add(type);
    }
  }

  private async ensureNoConflict(professionalId: string, start: Date, end: Date) {
    const conflicting = await this.bookingsRepository.findOverlappingBooking(
      professionalId,
      start,
      end,
    );
    if (conflicting) throw new TimeSlotAlreadyBookedError();
  }

  private async calculateBonusDiscount(userId: string, totalValue: number) {
    if (totalValue <= 0) throw new InvalidBonusRedemptionError();

    const [bookingBonus, loyaltyBonus] = await Promise.all([
      this.userBonusRepository.getValidPointsWithExpiration(userId, 'BOOKING_POINTS', new Date()),
      this.userBonusRepository.getValidPointsWithExpiration(userId, 'LOYALTY', new Date()),
    ]);

    const allBonuses = [
      { type: 'BOOKING_POINTS' as const, ...bookingBonus },
      { type: 'LOYALTY' as const, ...loyaltyBonus },
    ].filter((bonus) => bonus.points > 0);

    const totalPoints = allBonuses.reduce((sum, b) => sum + b.points, 0);

    if (totalPoints < MIN_POINTS_TO_REDEEM) throw new InsufficientBonusPointsError();

    const maxDiscount = totalValue - MIN_BOOKING_VALUE_AFTER_DISCOUNT;
    const maxPoints = Math.floor(maxDiscount / VALUE_PER_POINT);
    const pointsToUse = Math.min(totalPoints, maxPoints);
    const discount = pointsToUse * VALUE_PER_POINT;
    const finalValue = Math.max(totalValue - discount, MIN_BOOKING_VALUE_AFTER_DISCOUNT);

    let remaining = pointsToUse;
    const bonusesSorted = [...allBonuses].sort((a, b) => {
      if (!a.expiresAt) return 1;
      if (!b.expiresAt) return -1;
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    });

    const bonusBreakdown: Array<{ type: 'BOOKING_POINTS' | 'LOYALTY'; toConsume: number }> = [];

    for (const bonus of bonusesSorted) {
      if (remaining <= 0) break;

      const toConsume = Math.min(remaining, bonus.points);
      bonusBreakdown.push({ type: bonus.type, toConsume });
      remaining -= toConsume;
    }

    return {
      finalValue,
      pointsUsed: pointsToUse,
      discount,
      bonusBreakdown,
    };
  }
}
