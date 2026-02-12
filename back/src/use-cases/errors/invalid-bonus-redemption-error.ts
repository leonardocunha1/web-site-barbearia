import { BadRequestError } from './app-error';

export class InvalidBonusRedemptionError extends BadRequestError {
  constructor() {
    super('Valor do desconto não pode exceder o valor total da reserva', 'INVALID_BONUS_REDEMPTION');
  }
}
