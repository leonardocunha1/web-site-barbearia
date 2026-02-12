import { ForbiddenError } from './app-error';

export class InsufficientBonusPointsError extends ForbiddenError {
  constructor() {
    super('Pontos de bônus insuficientes (mínimo 10 pontos)', 'INSUFFICIENT_BONUS_POINTS');
  }
}
