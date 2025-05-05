export class InvalidDateTimeError extends Error {
  constructor() {
    super(' A data/hora de início não pode estar no passado.');
    this.name = 'InvalidDateTimeError';
  }
}
