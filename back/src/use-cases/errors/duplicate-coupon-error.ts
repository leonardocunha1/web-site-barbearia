import { ConflictError } from './app-error';

export class DuplicateCouponError extends ConflictError {
  constructor() {
    super('Codigo do cupom já existe.', 'DUPLICATE_COUPON');
  }
}
