import { BadRequestError } from './app-error';

export class CouponNotApplicableError extends BadRequestError {
  constructor(message = 'Cupom não aplicável a este agendamento') {
    super(message, 'COUPON_NOT_APPLICABLE');
  }
}
