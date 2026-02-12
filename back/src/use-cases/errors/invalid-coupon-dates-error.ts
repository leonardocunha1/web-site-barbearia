import { BadRequestError } from './app-error';

export class InvalidCouponDatesError extends BadRequestError {
  constructor(message: string) {
    super(message, 'INVALID_COUPON_DATES');
  }
}
