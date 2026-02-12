import { ForbiddenError } from './app-error';

export class CouponInUseError extends ForbiddenError {
  constructor() {
    super('Cannot delete coupon that has been used', 'COUPON_IN_USE');
  }
}
