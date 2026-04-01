import { BadRequestError } from '../errors/app-error';

export class InvalidCouponError extends BadRequestError {
  constructor(message = 'Cupom inválido') {
    super(message, 'INVALID_COUPON');
  }
}
