export class DuplicateCouponError extends Error {
  constructor() {
    super('Codigo do cupom já existe.');
    this.name = 'DuplicateCouponError';
  }
}
