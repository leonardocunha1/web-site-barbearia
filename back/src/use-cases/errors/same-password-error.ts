export class SamePasswordError extends Error {
  constructor() {
    super('New password must be different from current password');
    this.name = 'SamePasswordError';
  }
}
