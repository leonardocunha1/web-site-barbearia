export class BonusAlreadyAssignedError extends Error {
  constructor() {
    super('Bônus já foi atribuído para este agendamento');
    this.name = 'BonusAlreadyAssignedError';
  }
}
