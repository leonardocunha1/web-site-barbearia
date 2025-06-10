export class InvalidCouponScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCouponScopeError';
  }
}
