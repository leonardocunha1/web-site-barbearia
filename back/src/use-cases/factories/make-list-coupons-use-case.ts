import { couponRepository } from '@/repositories/prisma/instances';
import { ListCouponsUseCase } from '../coupons/list-coupons-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeListCouponsUseCase() {
  const useCase = new ListCouponsUseCase(couponRepository);

  return traceUseCase('coupon.list', useCase);
}
