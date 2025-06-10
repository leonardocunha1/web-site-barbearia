export class CouponInUseError extends Error {
  constructor() {
    super('Cannot delete coupon that has been used');
    this.name = 'CouponInUseError';
  }
}
