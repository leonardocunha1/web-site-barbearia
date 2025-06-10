import { CouponRepository } from '@/repositories/coupon-repository';
import { CouponNotFoundError } from '../errors/coupon-not-found-error';
import { CouponInUseError } from '../errors/coupon-in-use-error';

interface DeleteCouponRequest {
  couponId: string;
}

interface DeleteCouponResponse {
  success: boolean;
}

export class DeleteCouponUseCase {
  constructor(private couponRepository: CouponRepository) {}

  async execute({
    couponId,
  }: DeleteCouponRequest): Promise<DeleteCouponResponse> {
    // Verifica se o cupom existe
    const coupon = await this.couponRepository.findById(couponId);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

    // Verifica se o cupom já foi usado (tem redemptions)
    const couponWithRedemptions = await this.couponRepository.findByCode(
      coupon.code,
    );

    if (couponWithRedemptions && couponWithRedemptions.redemptions.length > 0) {
      throw new CouponInUseError();
    }

    // Deleta o cupom
    await this.couponRepository.delete(couponId);

    return {
      success: true,
    };
  }
}
