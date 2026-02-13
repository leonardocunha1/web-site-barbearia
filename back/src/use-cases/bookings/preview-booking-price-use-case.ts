import { IUsersRepository } from '@/repositories/users-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { IUserBonusRepository } from '@/repositories/user-bonus-repository';
import { ICouponRepository } from '@/repositories/coupon-repository';
import {
  MIN_BOOKING_VALUE_AFTER_DISCOUNT,
  MIN_POINTS_TO_REDEEM,
  VALUE_PER_POINT,
} from '@/consts/const';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import { InvalidBonusRedemptionError } from '../errors/invalid-bonus-redemption-error';
import { InsufficientBonusPointsError } from '../errors/insufficient-bonus-points-error';
import { CouponBonusConflictError } from '../errors/coupon-bonus-conflict-error';
import { InvalidCouponError } from './invalid-coupon-error';
import { CouponNotApplicableError } from '../errors/coupon-not-applicable-error';

export interface BookingPricePreviewRequest {
  userId: string;
  professionalId: string;
  services: Array<{ serviceId: string }>;
  useBonusPoints?: boolean;
  couponCode?: string;
}

export interface BookingPricePreviewResponse {
  totalValue: number;
  couponDiscount: number;
  pointsDiscount: number;
  pointsUsed: number;
  finalValue: number;
}

export class PreviewBookingPriceUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private professionalsRepository: IProfessionalsRepository,
    private serviceProfessionalRepository: IServiceProfessionalRepository,
    private userBonusRepository: IUserBonusRepository,
    private couponRepository: ICouponRepository,
  ) {}

  async execute(request: BookingPricePreviewRequest): Promise<BookingPricePreviewResponse> {
    await this.loadEntities(request.userId, request.professionalId);

    const services = await this.loadAndValidateServices(request.services, request.professionalId);

    const totalValue = services.reduce((sum, s) => sum + s.price, 0);

    if (request.couponCode && request.useBonusPoints) {
      throw new CouponBonusConflictError();
    }

    let couponDiscount = 0;
    if (request.couponCode) {
      const couponValidation = await this.validateAndApplyCoupon(
        request.couponCode,
        request.userId,
        request.professionalId,
        request.services,
        totalValue,
      );
      couponDiscount = couponValidation.discount;
    }

    const valueAfterCoupon = Math.max(totalValue - couponDiscount, 0);

    const bonusResult =
      !request.couponCode && request.useBonusPoints
        ? await this.previewBonusPoints(request.userId, valueAfterCoupon)
        : {
            finalValue: valueAfterCoupon,
            pointsUsed: 0,
            discount: 0,
          };

    return {
      totalValue,
      couponDiscount,
      pointsDiscount: bonusResult.discount,
      pointsUsed: bonusResult.pointsUsed,
      finalValue: bonusResult.finalValue,
    };
  }

  private async loadEntities(userId: string, professionalId: string) {
    const [user, professional] = await Promise.all([
      this.usersRepository.findById(userId),
      this.professionalsRepository.findById(professionalId),
    ]);
    if (!user) throw new UserNotFoundError();
    if (!professional) throw new ProfessionalNotFoundError();
  }

  private async loadAndValidateServices(
    services: BookingPricePreviewRequest['services'],
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

    if (coupon.endDate && coupon.endDate < new Date()) {
      throw new InvalidCouponError('Cupom expirado');
    }

    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      throw new InvalidCouponError('Limite de usos do cupom atingido');
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

    if (coupon.minBookingValue && totalValue < coupon.minBookingValue) {
      throw new CouponNotApplicableError(
        `Valor minimo para este cupom: R$ ${coupon.minBookingValue.toFixed(2)}`,
      );
    }

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
      discount,
    };
  }

  private async previewBonusPoints(userId: string, totalValue: number) {
    if (totalValue <= 0) throw new InvalidBonusRedemptionError();

    const [bookingBonus, loyaltyBonus] = await Promise.all([
      this.userBonusRepository.getValidPointsWithExpiration(userId, 'BOOKING_POINTS', new Date()),
      this.userBonusRepository.getValidPointsWithExpiration(userId, 'LOYALTY', new Date()),
    ]);

    const allBonuses = [
      { type: 'BOOKING_POINTS', ...bookingBonus },
      { type: 'LOYALTY', ...loyaltyBonus },
    ].filter((bonus) => bonus.points > 0);

    const totalPoints = allBonuses.reduce((sum, b) => sum + b.points, 0);

    if (totalPoints < MIN_POINTS_TO_REDEEM) {
      throw new InsufficientBonusPointsError();
    }

    const maxDiscount = Math.max(totalValue - MIN_BOOKING_VALUE_AFTER_DISCOUNT, 0);
    const maxPoints = Math.floor(maxDiscount / VALUE_PER_POINT);
    const pointsToUse = Math.min(totalPoints, maxPoints);
    const discount = pointsToUse * VALUE_PER_POINT;
    const finalValue = Math.max(totalValue - discount, MIN_BOOKING_VALUE_AFTER_DISCOUNT);

    return {
      finalValue,
      pointsUsed: pointsToUse,
      discount,
    };
  }
}
