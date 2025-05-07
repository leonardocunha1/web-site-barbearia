export class InvalidBonusRedemptionError extends Error {
  constructor() {
    super('Valor do desconto não pode exceder o valor total da reserva');
    this.name = 'InvalidBonusRedemptionError';
  }
}
