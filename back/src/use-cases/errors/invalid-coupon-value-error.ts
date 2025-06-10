export class InvalidCouponValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCouponValueError';
  }
}
