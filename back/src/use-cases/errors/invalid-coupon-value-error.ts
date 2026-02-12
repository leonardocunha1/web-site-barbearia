import { BadRequestError } from './app-error';

export class InvalidCouponValueError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_COUPON_VALUE');
  }
}
