export class InvalidTimeFormatError extends Error {
  constructor() {
    super('Formato de horário inválido. Use "HH:MM"');
    this.name = 'InvalidTimeFormatError';
  }
}
