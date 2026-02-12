import { BadRequestError } from './app-error';

export class CouponBonusConflictError extends BadRequestError {
  constructor() {
    super(
      'Não é possível usar cupom de desconto e pontos de bônus no mesmo agendamento',
      'COUPON_BONUS_CONFLICT',
    );
  }
}
