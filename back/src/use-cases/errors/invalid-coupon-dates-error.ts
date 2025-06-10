export class InvalidCouponDatesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCouponDatesError';
  }
}
