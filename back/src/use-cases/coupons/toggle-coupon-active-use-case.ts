import { ICouponRepository } from '@/repositories/coupon-repository';
import { CouponNotFoundError } from '../errors/coupon-not-found-error';

interface ToggleCouponActiveRequest {
  couponId: string;
}

interface ToggleCouponActiveResponse {
  coupon: {
    id: string;
    active: boolean;
  };
}

export class ToggleCouponActiveUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute({ couponId }: ToggleCouponActiveRequest): Promise<ToggleCouponActiveResponse> {
    const coupon = await this.couponRepository.findById(couponId);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

    const updatedCoupon = await this.couponRepository.update(couponId, {
      active: !coupon.active,
    });

    return {
      coupon: {
        id: updatedCoupon.id,
        active: updatedCoupon.active,
      },
    };
  }
}
