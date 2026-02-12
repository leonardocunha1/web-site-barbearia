import { ConflictError } from './app-error';

export class BonusAlreadyAssignedError extends ConflictError {
  constructor() {
    super('Bônus já foi atribuído para este agendamento', 'BONUS_ALREADY_ASSIGNED');
  }
}
