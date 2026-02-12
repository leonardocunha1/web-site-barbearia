import { NotFoundError } from './app-error';

export class CouponNotFoundError extends NotFoundError {
  constructor() {
    super('Cupom não encontrado.', 'COUPON_NOT_FOUND');
  }
}
