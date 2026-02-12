import { BadRequestError } from './app-error';

export class InvalidCouponScopeError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_COUPON_SCOPE');
  }
}
