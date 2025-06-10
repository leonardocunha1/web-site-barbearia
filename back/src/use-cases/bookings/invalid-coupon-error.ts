export class InvalidCouponError extends Error {
  constructor(message = 'Cupom inválido') {
    super(message);
    this.name = 'InvalidCouponError';
  }
}
