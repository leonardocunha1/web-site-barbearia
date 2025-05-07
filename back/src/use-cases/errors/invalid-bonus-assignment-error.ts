export class InvalidBonusAssignmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBonusAssignmentError';
  }
}
