export class CouponNotApplicableError extends Error {
  constructor(message = 'Cupom não aplicável a este agendamento') {
    super(message);
    this.name = 'CouponNotApplicableError';
  }
}
