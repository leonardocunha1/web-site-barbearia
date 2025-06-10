import { BookingsRepository } from '@/repositories/bookings-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { UserBonusRepository } from '@/repositories/user-bonus-repository';
import { BonusRedemptionRepository } from '@/repositories/bonus-redemption-repository';
import { Booking } from '@prisma/client';

import {
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
import { CouponRepository } from '@/repositories/coupon-repository';

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
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private serviceProfessionalRepository: ServiceProfessionalRepository,
    private userBonusRepository: UserBonusRepository,
    private bonusRedemptionRepository: BonusRedemptionRepository,
    private couponRepository: CouponRepository,
  ) {}

  async execute(request: BookingRequest): Promise<Booking> {
    this.validateDate(request.startDateTime);

    await this.loadEntities(request.userId, request.professionalId);

    const services = await this.loadAndValidateServices(
      request.services,
      request.professionalId,
    );

    const totalDuration = services.reduce((sum, s) => sum + s.duracao, 0);
    const endDateTime = new Date(
      request.startDateTime.getTime() + totalDuration * 60000,
    );

    await this.ensureNoConflict(
      request.professionalId,
      request.startDateTime,
      endDateTime,
    );

    const totalValue = services.reduce((sum, s) => sum + s.preco, 0);

    // Verificar conflito entre cupom e pontos de bônus
    if (request.couponCode && request.useBonusPoints) {
      throw new CouponBonusConflictError();
    }

    let couponDiscount = 0;
    let couponId: string | undefined;

    // Aplicar cupom de desconto se existir
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

    // Calcular valor após desconto do cupom
    const valueAfterCoupon = totalValue - couponDiscount;

    // Aplicar pontos de bônus (apenas se não tiver cupom)
    const bonusResult =
      !request.couponCode && request.useBonusPoints
        ? await this.applyBonusPoints(request.userId, valueAfterCoupon)
        : {
            finalValue: valueAfterCoupon,
            pointsUsed: 0,
            discount: 0,
            details: [],
          };

    const booking = await this.bookingsRepository.create({
      dataHoraInicio: request.startDateTime,
      dataHoraFim: endDateTime,
      observacoes: request.notes,
      user: { connect: { id: request.userId } },
      profissional: { connect: { id: request.professionalId } },
      status: 'PENDENTE',
      valorFinal: parseFloat(bonusResult.finalValue.toFixed(2)),
      pontosUtilizados: bonusResult.pointsUsed,
      coupon: couponId ? { connect: { id: couponId } } : undefined,
      couponDiscount,
      items: {
        create: services.map((s) => ({
          serviceProfessionalId: s.id,
          preco: s.preco,
          nome: s.service.nome,
          duracao: s.duracao,
          serviceId: s.service.id,
        })),
      },
    });

    // Registrar resgate de pontos (se aplicável)
    if (bonusResult.pointsUsed > 0 && bonusResult.discount > 0) {
      await this.registerBonusRedemptions(
        request.userId,
        booking.id,
        bonusResult.pointsUsed,
        bonusResult.discount,
        bonusResult.details,
      );
    }

    // Registrar resgate de cupom (se aplicável)
    if (couponId && couponDiscount > 0) {
      await this.couponRepository.registerRedemption({
        couponId,
        userId: request.userId,
        bookingId: booking.id,
        discount: couponDiscount,
      });
    }

    return booking;
  }

  private async validateAndApplyCoupon(
    code: string,
    userId: string,
    professionalId: string,
    services: Array<{ serviceId: string }>,
    totalValue: number,
  ) {
    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon || !coupon.active) {
      throw new InvalidCouponError();
    }

    // Verificar validade
    if (coupon.endDate && coupon.endDate < new Date()) {
      throw new InvalidCouponError('Cupom expirado');
    }

    // Verificar usos máximos
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      throw new InvalidCouponError('Limite de usos do cupom atingido');
    }

    // Verificar escopo
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

    // Verificar valor mínimo
    if (coupon.minBookingValue && totalValue < coupon.minBookingValue) {
      throw new CouponNotApplicableError(
        `Valor mínimo para este cupom: R$ ${coupon.minBookingValue.toFixed(2)}`,
      );
    }

    // Calcular desconto
    let discount = 0;
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = totalValue * (coupon.value / 100);
        break;
      case 'FIXED':
        discount = Math.min(coupon.value, totalValue);
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
        const sp =
          await this.serviceProfessionalRepository.findByServiceAndProfessional(
            serviceId,
            professionalId,
          );
        if (!sp) throw new ServiceProfessionalNotFoundError();
        if (sp.duracao <= 0) throw new InvalidDurationError();
        return sp;
      }),
    );
    if (result.length === 0) throw new InvalidDurationError();
    return result;
  }

  private async ensureNoConflict(
    professionalId: string,
    start: Date,
    end: Date,
  ) {
    const conflicting = await this.bookingsRepository.findOverlappingBooking(
      professionalId,
      start,
      end,
    );
    if (conflicting) throw new TimeSlotAlreadyBookedError();
  }

  private async applyBonusPoints(userId: string, totalValue: number) {
    if (totalValue <= 0) throw new InvalidBonusRedemptionError();

    const allBonuses =
      await this.userBonusRepository.getValidPointsWithExpiration(
        userId,
        new Date(),
      );
    const totalPoints = allBonuses.reduce((sum, b) => sum + b.points, 0);

    if (totalPoints < MIN_POINTS_TO_REDEEM)
      throw new InsufficientBonusPointsError();

    const maxDiscount = totalValue - MIN_BOOKING_VALUE_AFTER_DISCOUNT;
    const maxPoints = Math.ceil(maxDiscount / VALUE_PER_POINT);
    const pointsToUse = Math.min(totalPoints, maxPoints);
    const discount = pointsToUse * VALUE_PER_POINT;
    const finalValue = Math.max(
      totalValue - discount,
      MIN_BOOKING_VALUE_AFTER_DISCOUNT,
    );

    const details: Array<{ type: string; pointsUsed: number }> = [];

    let remaining = pointsToUse;
    const bonusesSorted = [...allBonuses].sort((a, b) => {
      if (!a.expiresAt) return 1;
      if (!b.expiresAt) return -1;
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    });

    for (const bonus of bonusesSorted) {
      if (remaining <= 0) break;

      const toConsume = Math.min(remaining, bonus.points);
      await this.userBonusRepository.consumePoints(
        userId,
        toConsume,
        bonus.type,
      );
      details.push({ type: bonus.type, pointsUsed: toConsume });
      remaining -= toConsume;
    }

    return {
      finalValue,
      pointsUsed: pointsToUse,
      discount,
      details,
    };
  }

  private async registerBonusRedemptions(
    userId: string,
    bookingId: string,
    totalPoints: number,
    discount: number,
    details: Array<{ type: string; pointsUsed: number }>,
  ) {
    await this.bonusRedemptionRepository.create({
      user: { connect: { id: userId } },
      booking: { connect: { id: bookingId } },
      pointsUsed: totalPoints,
      discount: parseFloat(discount.toFixed(2)),
    });

    for (const detail of details) {
      await this.bonusRedemptionRepository.create({
        user: { connect: { id: userId } },
        booking: { connect: { id: bookingId } },
        pointsUsed: detail.pointsUsed,
        discount: parseFloat(discount.toFixed(2)),
      });
    }
  }
}
