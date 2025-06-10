export class CouponBonusConflictError extends Error {
  constructor() {
    super(
      'Não é possível usar cupom de desconto e pontos de bônus no mesmo agendamento',
    );
    this.name = 'CouponBonusConflictError';
  }
}
