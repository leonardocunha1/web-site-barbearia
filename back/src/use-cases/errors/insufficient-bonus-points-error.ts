export class InsufficientBonusPointsError extends Error {
  constructor() {
    super('Pontos de bônus insuficientes (mínimo 10 pontos)');
    this.name = 'InsufficientBonusPointsError';
  }
}
