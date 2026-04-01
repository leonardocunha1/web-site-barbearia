import { couponRepository } from '@/repositories/prisma/instances';
import { ToggleCouponActiveUseCase } from '../coupons/toggle-coupon-active-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeToggleCouponActiveUseCase() {
  const useCase = new ToggleCouponActiveUseCase(couponRepository);

  return traceUseCase('coupon.toggle_active', useCase);
}
